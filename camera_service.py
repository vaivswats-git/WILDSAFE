
import cv2
import json
import time
import urllib.request
import urllib.error
import threading

from ultralytics import YOLO

from gps_tracking.zone_config import get_zone
from alerts.risk_analysis import assess_risk
from alerts.notification import create_notification
from alerts.alarm_system import trigger_alarm, stop_alarm


API_URL = "http://127.0.0.1:8000"

camera = None
model = None
coco_model = None
running = False
camera_lock = threading.Lock()
previous_event = None


def load_model():
    global model, coco_model

    if model is None:
        model = YOLO("models/best.pt")

    if coco_model is None:
        coco_model = YOLO("yolo26n.pt")

def send_to_api(endpoint, record):
    try:
        data = json.dumps(record).encode("utf-8")

        request = urllib.request.Request(
            f"{API_URL}/{endpoint}",
            data=data,
            headers={"Content-Type": "application/json"},
            method="POST"
        )

        with urllib.request.urlopen(request, timeout=2):
            pass

    except (urllib.error.URLError, TimeoutError) as error:
        print("API save error:", error)


def start_camera():
    global camera, running, previous_event

    with camera_lock:
        if running and camera is not None and camera.isOpened():
            return True

        load_model()

        camera = cv2.VideoCapture(0)

        if not camera.isOpened():
            camera.release()
            camera = None
            return False

        running = True
        previous_event = None

    print("WILDSAFE camera started.")
    return True


def stop_camera():
    global camera, running, previous_event

    with camera_lock:
        running = False

        if camera is not None:
            camera.release()
            camera = None

        previous_event = None

    stop_alarm()
    print("WILDSAFE camera stopped.")



def process_frame(frame):
    global previous_event

    # 1. Run pretrained COCO model
    coco_results = coco_model(
        frame, conf=0.35, verbose=False
    )

    # Draw COCO detections: person, cell phone, etc.
    for result in coco_results:
        frame = result.plot()

    # 2. Identify person bounding boxes
    person_boxes = []

    for result in coco_results:
        if result.boxes is None:
            continue

        for box in result.boxes:
            class_id = int(box.cls[0].item())

            if class_id == 0:  # COCO class 0 = person
                person_boxes.append(
                    box.xyxy[0].tolist()
                )

    # 3. Run custom wildlife model
    wildlife_results = model(
        frame, conf=0.5, verbose=False
    )

    detected_animal = None
    confidence = None
    best_confidence = 0

    for result in wildlife_results:
        if result.boxes is None:
            continue

        for box in result.boxes:
            class_id = int(box.cls[0].item())
            animal = model.names[class_id].lower()

            x1, y1, x2, y2 = map(
                int, box.xyxy[0].tolist()
            )

            box_confidence = float(box.conf[0].item())

            # 4. Check whether wildlife box overlaps a person
            is_person = False

            animal_center_x = (x1 + x2) / 2
            animal_center_y = (y1 + y2) / 2

            animal_area = max(1, (x2 - x1) * (y2 - y1))

            for px1, py1, px2, py2 in person_boxes:
                px1, py1, px2, py2 = map(
                    int, [px1, py1, px2, py2]
                )

                intersection_x1 = max(x1, px1)
                intersection_y1 = max(y1, py1)
                intersection_x2 = min(x2, px2)
                intersection_y2 = min(y2, py2)

                intersection_area = max(
                    0, intersection_x2 - intersection_x1
                ) * max(
                    0, intersection_y2 - intersection_y1
                )

                overlap = intersection_area / animal_area

                center_inside_person = (
                    px1 <= animal_center_x <= px2
                    and py1 <= animal_center_y <= py2
                )

                if overlap > 0.3 or center_inside_person:
                    is_person = True
                    break

            # Ignore animal predictions overlapping a person
            if is_person:
                continue

            # Draw valid wildlife bounding box
            cv2.rectangle(
                frame,
                (x1, y1),
                (x2, y2),
                (0, 255, 0),
                2
            )

            label = f"{animal.title()} {box_confidence:.2f}"

            cv2.putText(
                frame,
                label,
                (x1, max(y1 - 10, 20)),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.6,
                (0, 255, 0),
                2
            )

            # Select highest-confidence wildlife detection
            if box_confidence > best_confidence:
                best_confidence = box_confidence
                detected_animal = animal
                confidence = box_confidence

    # 5. ArUco zone detection
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    aruco_dict = cv2.aruco.getPredefinedDictionary(
        cv2.aruco.DICT_4X4_50
    )

    parameters = cv2.aruco.DetectorParameters()

    detector = cv2.aruco.ArucoDetector(
        aruco_dict, parameters
    )

    corners, ids, rejected = detector.detectMarkers(gray)

    detected_zones = []

    if ids is not None:
        cv2.aruco.drawDetectedMarkers(frame, corners, ids)

        for marker_id in ids.flatten():
            zone = get_zone(marker_id)

            if (
                zone != "Unknown Zone"
                and zone not in detected_zones
            ):
                detected_zones.append(zone)

    zone_text = (
        "Zones: " + ", ".join(detected_zones)
        if detected_zones else "Zones: None"
    )

    cv2.putText(
        frame,
        zone_text,
        (20, 40),
        cv2.FONT_HERSHEY_SIMPLEX,
        0.7,
        (0, 255, 0),
        2
    )

    # 6. Record a new wildlife detection event
    if detected_animal:
        event = (
            detected_animal,
            tuple(sorted(detected_zones))
        )

        if event != previous_event:
            risk = assess_risk(detected_animal)

            if risk is not None:
                zones_for_message = (
                    detected_zones
                    if detected_zones
                    else ["No zone detected"]
                )

                detection_record = {
                    "animal": detected_animal,
                    "zone": ", ".join(zones_for_message),
                    "confidence": confidence,
                    "risk": max(
                        risk["crop_risk"],
                        risk["life_risk"]
                    ),
                    "cropRisk": risk["crop_risk"],
                    "lifeRisk": risk["life_risk"]
                }

                send_to_api(
                    "detections",
                    detection_record
                )

                message = create_notification(
                    detected_animal,
                    zones_for_message,
                    risk
                )

                print(message)

                alert_types = []

                if risk["crop_risk"] >= 50:
                    alert_types.append("crop")

                if risk["life_risk"] >= 50:
                    alert_types.append("life")

                for category in alert_types:
                    alert_record = {
                        "category": category,
                        "animal": detected_animal,
                        "zone": ", ".join(zones_for_message),
                        "cropRisk": risk["crop_risk"],
                        "lifeRisk": risk["life_risk"],
                        "message": message,
                        "action": "Follow local forest-authority guidance."
                    }

                    send_to_api("alerts", alert_record)

                trigger_alarm(risk)

            previous_event = event

    else:
        previous_event = None

    return frame


def generate_frames():
    while True:
        with camera_lock:
            active = running
            cap = camera

        if not active or cap is None:
            break

        success, frame = cap.read()

        if not success:
            time.sleep(0.1)
            continue

        try:
            frame = process_frame(frame)
        except Exception as error:
            print("Detection error:", error)
            continue

        success, buffer = cv2.imencode(
            ".jpg", frame
        )

        if not success:
            continue

        yield (
            b"--frame\r\n"
            b"Content-Type: image/jpeg\r\n\r\n"
            + buffer.tobytes()
            + b"\r\n"
        )
