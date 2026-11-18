import { Settings as SettingsIcon, Camera, Shield, Bell, Save } from "lucide-react";

function Settings() {
  return (
    <section className="dashboard-main">
      <header className="page-header">
        <div>
          <p className="eyebrow">SYSTEM CONFIGURATION</p>
          <h1>Settings</h1>
          <p className="page-subtitle">
            Configure detection and monitoring preferences.
          </p>
        </div>
      </header>

      <div className="settings-grid">
        <div className="settings-card">
          <div className="settings-heading">
            <Camera size={20} />
            <h2>Detection Settings</h2>
          </div>

          <label>Detection Confidence</label>
          <select defaultValue="0.40">
            <option value="0.30">30%</option>
            <option value="0.40">40%</option>
            <option value="0.50">50%</option>
            <option value="0.60">60%</option>
            <option value="0.70">70%</option>
          </select>

          <label>Detection Model</label>
          <input value="Custom YOLO Model" readOnly />
        </div>

        <div className="settings-card">
          <div className="settings-heading">
            <Shield size={20} />
            <h2>Risk Configuration</h2>
          </div>

          <label>Crop Protection Threshold</label>
          <input value="50" readOnly />

          <label>Life Safety Threshold</label>
          <input value="50" readOnly />

          <p className="settings-hint">
            Risk thresholds are currently configured in the backend.
          </p>
        </div>

        <div className="settings-card">
          <div className="settings-heading">
            <Bell size={20} />
            <h2>Notification Preferences</h2>
          </div>

          <label className="setting-toggle">
            <span>Crop Protection Alerts</span>
            <input type="checkbox" defaultChecked />
          </label>

          <label className="setting-toggle">
            <span>Life Safety Alerts</span>
            <input type="checkbox" defaultChecked />
          </label>

          <label className="setting-toggle">
            <span>Sound Notifications</span>
            <input type="checkbox" defaultChecked />
          </label>
        </div>

        <div className="settings-card system-info">
          <div className="settings-heading">
            <SettingsIcon size={20} />
            <h2>System Information</h2>
          </div>
          <p>Project: Wildlife–Human Conflict Mitigation System</p>
          <p>Detection: Custom YOLO Model</p>
          <p>Zone Tracking: ArUco Markers</p>
          <p>Environment: Prototype</p>
        </div>
      </div>

      <button className="settings-save" onClick={() => alert("Settings UI saved for this session.")}>
        <Save size={17} /> Save Preferences
      </button>
    </section>
  );
}

export default Settings;