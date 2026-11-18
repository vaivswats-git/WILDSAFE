
import { useEffect, useState } from "react";
import {
  Camera,
  ScanEye,
  Activity,
  MapPin,
  CircleDot,
  Play,
  Square,
  RefreshCw,
  ArrowLeft
} from "lucide-react";

const API = "http://127.0.0.1:8000";

function LiveDetection({ onNavigate }) {
  const [cameraRunning, setCameraRunning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [streamKey, setStreamKey] = useState(0);

  useEffect(() => {
    let active = true;

    fetch(`${API}/camera/status`)
      .then((response) => response.json())
      .then((data) => {
        if (active) {
          setCameraRunning(data.running);
          if (data.running) setStreamKey(Date.now());
        }
      })
      .catch(() => {
        if (active) {
          setError("Unable to connect to WILDSAFE server.");
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const startCamera = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API}/camera/start`, {
        method: "POST"
      });

      const data = await response.json();

      if (!response.ok || data.status !== "started") {
        throw new Error(data.message || "Unable to start camera.");
      }

      setStreamKey(Date.now());
      setCameraRunning(true);
    } catch (err) {
      setError(err.message || "Camera connection failed.");
    } finally {
      setLoading(false);
    }
  };

  const stopCamera = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API}/camera/stop`, {
        method: "POST"
      });

      if (!response.ok) {
        throw new Error("Unable to stop camera.");
      }

      setCameraRunning(false);
    } catch (err) {
      setError(err.message || "Unable to stop camera.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="dashboard-main">

      <button
        className="history-back"
        onClick={() => onNavigate?.("home")}
      >
        <ArrowLeft size={18} />
        Back to Home
      </button>

      <header className="dashboard-header">
        <div>
          <p className="eyebrow">WILDSAFE / PROTOTYPE DEMO</p>
          <h1>Live Detection</h1>
          <p className="muted">
            Real-time wildlife identification and zone monitoring.
          </p>
        </div>

        <div className="system-status">
          <span
            className={`status-dot ${cameraRunning ? "camera-active" : ""}`}
          />
          {cameraRunning ? "CAMERA LIVE" : "CAMERA STANDBY"}
        </div>
      </header>

      <div className="panel camera-panel">

        <div className="panel-heading">
          <div>
            <h3>Primary Camera Feed</h3>
            <p>YOLO wildlife detection engine</p>
          </div>

          <span className={`live-tag ${cameraRunning ? "camera-live-tag" : ""}`}>
            {cameraRunning ? "● LIVE" : "● OFFLINE"}
          </span>
        </div>

        <div className="camera-placeholder live-camera">

          {cameraRunning ? (
            <img
              key={streamKey}
              src={`${API}/camera/stream?session=${streamKey}`}
              alt="Live WILDSAFE webcam feed with wildlife detection"
              className="wildsafe-live-feed"
            />
          ) : (
            <div className="camera-waiting">
              <Camera size={48} />
              <h3>Camera is on standby</h3>
              <p>
                Start the camera to begin real-time wildlife detection.
              </p>
            </div>
          )}

        </div>

        <div className="camera-controls">

          {!cameraRunning ? (
            <button
              className="camera-start-button"
              onClick={startCamera}
              disabled={loading}
            >
              {loading ? (
                <RefreshCw size={18} className="camera-spinner" />
              ) : (
                <Play size={18} />
              )}
              {loading ? "Starting..." : "Start Camera"}
            </button>
          ) : (
            <button
              className="camera-stop-button"
              onClick={stopCamera}
              disabled={loading}
            >
              <Square size={17} />
              {loading ? "Stopping..." : "Stop Camera"}
            </button>
          )}

        </div>

        {error && (
          <p className="camera-error">{error}</p>
        )}

      </div>

      <div className="dashboard-grid detection-details">

        <div className="panel">
          <div className="panel-heading">
            <h3>Detection Information</h3>
            <ScanEye />
          </div>

          <div className="detail-row">
            <span>Detected Animal</span>
            <strong>See live feed</strong>
          </div>

          <div className="detail-row">
            <span>Confidence Score</span>
            <strong>See live feed</strong>
          </div>

          <div className="detail-row">
            <span>Detection Status</span>
            <strong>{cameraRunning ? "Running" : "Standby"}</strong>
          </div>
        </div>

        <div className="panel">
          <div className="panel-heading">
            <h3>Zone Information</h3>
            <MapPin />
          </div>

          <div className="detail-row">
            <span>Detected Zones</span>
            <strong>See live feed</strong>
          </div>

          <div className="detail-row">
            <span>ArUco Tracker</span>
            <strong>{cameraRunning ? "Active" : "Standby"}</strong>
          </div>

          <div className="detail-row">
            <span>Tracking Status</span>
            <strong>
              <CircleDot size={12} />
              {cameraRunning ? "Monitoring" : "Waiting"}
            </strong>
          </div>
        </div>

      </div>

      <div className="panel detection-engine">
        <div className="panel-heading">
          <h3>Detection Engine</h3>
          <Activity />
        </div>

        <p className="muted">
          Custom YOLO wildlife model · 5 animal classes
        </p>

        <p className="muted">
          Deer · Elephant · Horse · Lion · Tiger
        </p>
      </div>

      <p className="camera-demo-note">
        Prototype demonstration: camera zones are simulated using ArUco
        markers. This is not a live GPS tracking system.
      </p>

    </section>
  );
}

export default LiveDetection;
