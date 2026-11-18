
import cv2
import json
import urllib.request
import urllib.error

from ultralytics import YOLO

from gps_tracking.zone_config import get_zone
from alerts.risk_analysis import assess_risk
from alerts.notification import create_notification
from alerts.alarm_system import trigger_alarm, stop_alarm


# FastAPI server
API_URL = "http://127.0.0.1:8000"


def send_to_api(endpoint, record):
    """Send a record to the WILDSAFE API."""

    url = f"{API_URL}/{endpoint}"

    data = json.dumps(record).encode("utf-8")

    request = urllib.request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST"
    )

    try:
        with urllib.request.urlopen(request, timeout=2) as response:
            print(f"{endpoint.capitalize()} saved to API.")
            return True

    except (urllib.error.URLError, TimeoutError) as error:
        print(f"API connection failed: {error}")
        return False


# Load wildlife model
model = YOLO("models/best.pt")


# Initialize ArUco detector
aruco_dict = cv2.aruco.getPredefinedDictionary(
    cv2.aruco.DICT_4X4_50
)

parameters = cv2.aruco.DetectorParameters()

aruco_detector = cv2.aruco.ArucoDetector(
    aruco_dict, parameters
)


# Start webcam
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("Unable to access webcam.")
    exit()


print("Wildlife detection system started.")
print("Press S to stop alarms.")
print("Press Q to exit.")

previous_event = None


while True:
    ret, frame = cap.read()

    if not ret:
        break

    # YOLO animal detection
    results = model(frame, conf=0.4, verbose=False)

    detected_animal = None
    confidence = None

    for result in results:
        frame = result.plot()

        if result.boxes is not None and len(result.boxes) > 0:

            best_index = result.boxes.conf.argmax().item()

            class_id = int(
                result.boxes.cls[best_index].item()
            )

            detected_animal = model.names[class_id].lower()

            confidence = float(
                result.boxes.conf[best_index].item()
            )

    # ArUco zone detection
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    corners, ids, rejected = aruco_detector.detectMarkers(gray)

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

    # Display zones
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

    # Risk analysis and API integration
    if detected_animal:

        event = (
            detected_animal,
            tuple(sorted(detected_zones))
        )

        if event != previous_event:

            risk = assess_risk(detected_animal)

            zones_for_message = (
                detected_zones
                if detected_zones
                else ["No zone detected"]
            )

            if risk is not None:

                # Save detection record
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

                # Generate notification
                message = create_notification(
                    detected_animal,
                    zones_for_message,
                    risk
                )

                print(message)

                # Create separate alerts
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

                    send_to_api(
                        "alerts",
                        alert_record
                    )

                # Trigger existing alarm system
                trigger_alarm(risk)

            previous_event = event

    else:
        previous_event = None

    # Display webcam
    cv2.imshow(
        "Wildlife-Human Conflict Detection",
        frame
    )

    key = cv2.waitKey(1) & 0xFF

    if key == ord("s"):
        stop_alarm()

    if key == ord("q"):
        stop_alarm()
        break


# Release resources
cap.release()
cv2.destroyAllWindows()
