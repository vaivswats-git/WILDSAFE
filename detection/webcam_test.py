
import cv2
from ultralytics import YOLO

# Load both models
wildlife_model = YOLO("../models/best.pt")
coco_model = YOLO("../models/yolo26n.pt")

cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # Custom wildlife detection
    wildlife_results = wildlife_model.predict(
        frame, conf=0.25, verbose=False
    )[0]

    # COCO detection
    coco_results = coco_model.predict(
        frame, conf=0.40, verbose=False
    )[0]

    # Identify people
    people = []

    for box in coco_results.boxes:
        if int(box.cls[0]) == 0:  # COCO person class
            people.append(box.xyxy[0].tolist())

    # Draw COCO detections
    for box in coco_results.boxes:
        class_id = int(box.cls[0])
        confidence = float(box.conf[0])
        name = coco_model.names[class_id]

        if name == "person":
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            cv2.rectangle(frame, (x1, y1), (x2, y2), (255, 0, 0), 2)
            cv2.putText(
                frame, "HUMAN DETECTED",
                (x1, y1 - 10),
                cv2.FONT_HERSHEY_SIMPLEX, 0.6,
                (255, 0, 0), 2
            )

    # Draw custom wildlife detections
    for box in wildlife_results.boxes:
        confidence = float(box.conf[0])
        class_id = int(box.cls[0])
        animal = wildlife_model.names[class_id]

        x1, y1, x2, y2 = map(int, box.xyxy[0])

        # Check overlap with human detections
        human_detected = False

        for person in people:
            px1, py1, px2, py2 = map(int, person)

            ix1 = max(x1, px1)
            iy1 = max(y1, py1)
            ix2 = min(x2, px2)
            iy2 = min(y2, py2)

            if ix2 > ix1 and iy2 > iy1:
                human_detected = True
                break

        if human_detected:
            continue

        if confidence >= 0.70:
            label = f"{animal}: {confidence:.2f}"
        elif confidence >= 0.40:
            label = "UNCERTAIN - VERIFY"
        else:
            continue

        cv2.rectangle(
            frame, (x1, y1), (x2, y2),
            (0, 255, 0), 2
        )

        cv2.putText(
            frame, label, (x1, y1 - 10),
            cv2.FONT_HERSHEY_SIMPLEX, 0.6,
            (0, 255, 0), 2
        )

    cv2.imshow("Wildlife Human Conflict Detection", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
