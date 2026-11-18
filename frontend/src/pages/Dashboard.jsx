
import {
  ScanEye,
  MapPin,
  ShieldAlert,
  Activity,
  Camera,
  Bell
} from "lucide-react";

function Dashboard() {
  return (
    <section className="dashboard-main">

      <header className="dashboard-header">
        <div>
          <p className="eyebrow">
            MONITORING NETWORK / OVERVIEW
          </p>
          <h1>Command Centre</h1>
          <p className="muted">
            Wildlife conflict monitoring at a glance.
          </p>
        </div>

        <div className="system-status">
          <span className="status-dot"></span>
          SYSTEM READY
        </div>
      </header>

      <div className="stats-grid">

        <div className="stat-card">
          <ScanEye />
          <p>ANIMAL DETECTIONS</p>
          <h2>--</h2>
          <span>Awaiting camera data</span>
        </div>

        <div className="stat-card">
          <MapPin />
          <p>MONITORED ZONES</p>
          <h2>05</h2>
          <span>Configured zones</span>
        </div>

        <div className="stat-card">
          <ShieldAlert />
          <p>ACTIVE ALERTS</p>
          <h2>--</h2>
          <span>Awaiting detection data</span>
        </div>

        <div className="stat-card">
          <Activity />
          <p>RISK ANALYSIS</p>
          <h2>READY</h2>
          <span>Risk engine initialized</span>
        </div>

      </div>

      <div className="dashboard-grid">

        <div className="panel camera-panel">
          <div className="panel-heading">
            <div>
              <h3>Live Surveillance</h3>
              <p>Wildlife detection feed</p>
            </div>
            <span className="live-tag">● STANDBY</span>
          </div>

          <div className="camera-placeholder">
            <Camera size={42} />
            <h3>Camera feed unavailable</h3>
            <p>
              Connect the detection engine to view live footage.
            </p>
          </div>
        </div>

        <div className="panel zone-panel">
          <div className="panel-heading">
            <div>
              <h3>Monitoring Zones</h3>
              <p>ArUco zone configuration</p>
            </div>
            <MapPin size={20} />
          </div>

          {[1, 2, 3, 4, 5].map((zone) => (
            <div className="zone-row" key={zone}>
              <span>ZONE 0{zone}</span>
              <span className="zone-status">
                ● CONFIGURED
              </span>
            </div>
          ))}
        </div>

        <div className="panel activity-panel">
          <div className="panel-heading">
            <div>
              <h3>System Activity</h3>
              <p>Module status</p>
            </div>
            <Activity size={20} />
          </div>

          {[
            "YOLO detection engine",
            "ArUco zone tracker",
            "Risk analysis module",
            "Alert and alarm system"
          ].map((item) => (
            <div className="activity-row" key={item}>
              <span className="status-dot"></span>
              {item}
              <span>READY</span>
            </div>
          ))}
        </div>

        <div className="panel alert-panel">
          <div className="panel-heading">
            <div>
              <h3>Recent Alerts</h3>
              <p>Latest system notifications</p>
            </div>
            <Bell size={20} />
          </div>

          <p className="empty-state">
            No alert records available yet.
          </p>
        </div>

      </div>
    </section>
  );
}

export default Dashboard;
