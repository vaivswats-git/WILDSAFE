
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pathlib import Path
from datetime import datetime
import json
import camera_service
from alerts.alarm_system import set_alarm_preference

app = FastAPI(title="WILDSAFE API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_DIR = Path("data")
DATA_DIR.mkdir(exist_ok=True)

DETECTIONS_FILE = DATA_DIR / "detections.json"
ALERTS_FILE = DATA_DIR / "alerts.json"


def read_records(file_path):
    if not file_path.exists():
        return []

    try:
        with open(file_path, "r", encoding="utf-8") as file:
            return json.load(file)
    except (json.JSONDecodeError, OSError):
        return []


def write_records(file_path, records):
    with open(file_path, "w", encoding="utf-8") as file:
        json.dump(records, file, indent=4)


def save_detection(record):
    records = read_records(DETECTIONS_FILE)
    records.append(record)
    write_records(DETECTIONS_FILE, records)


def save_alert(record):
    records = read_records(ALERTS_FILE)
    records.append(record)
    write_records(ALERTS_FILE, records)


@app.get("/")
def home():
    return {"message": "WILDSAFE API is running"}


@app.get("/health")
def health():
    return {
        "status": "online",
        "service": "WILDSAFE API"
    }


# Detection endpoints
@app.get("/detections")
def get_detections():
    return read_records(DETECTIONS_FILE)


@app.post("/detections")
def create_detection(record: dict):
    record.setdefault("timestamp", datetime.now().isoformat())
    save_detection(record)

    return {
        "message": "Detection saved",
        "record": record
    }


# Alert endpoints
@app.get("/alerts")
def get_alerts():
    return read_records(ALERTS_FILE)


@app.post("/alerts")
def create_alert(record: dict):
    record.setdefault("timestamp", datetime.now().isoformat())
    save_alert(record)

    return {
        "message": "Alert saved",
        "record": record
    }


# Camera endpoints
@app.post("/camera/start")
def start_camera():
    success = camera_service.start_camera()

    if not success:
        return {
            "status": "error",
            "message": "Unable to access webcam."
        }

    return {
        "status": "started",
        "message": "WILDSAFE camera started."
    }


@app.post("/camera/stop")
def stop_camera():
    camera_service.stop_camera()

    return {
        "status": "stopped",
        "message": "WILDSAFE camera stopped."
    }


@app.get("/camera/status")
def camera_status():
    return {
        "running": camera_service.running
    }


@app.get("/camera/stream")
def camera_stream():
    if not camera_service.running:
        return {
            "status": "error",
            "message": "Camera is not running."
        }

    return StreamingResponse(
        camera_service.generate_frames(),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )


@app.on_event("shutdown")
def shutdown_camera():
    camera_service.stop_camera()

# Alarm preference endpoint
@app.post("/alarm/preference")
def update_alarm_preference(data: dict):
    preference = data.get("preference", "").lower()

    success = set_alarm_preference(preference)

    if not success:
        return {
            "status": "error",
            "message": "Invalid alarm preference."
        }

    return {
        "status": "success",
        "preference": preference,
        "message": "Alarm preference updated."
    }