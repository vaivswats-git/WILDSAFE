
import { MapPin, ScanEye, Radio, ShieldCheck } from "lucide-react";

const zones = [
  { id: 7, name: "ZONE 01", location: "Monitoring Area 01" },
  { id: 8, name: "ZONE 02", location: "Monitoring Area 02" },
  { id: 9, name: "ZONE 03", location: "Monitoring Area 03" },
  { id: 10, name: "ZONE 04", location: "Monitoring Area 04" },
  { id: 11, name: "ZONE 05", location: "Monitoring Area 05" }
];

function ZoneTracking() {
  return (
    <section className="dashboard-main">

      <header className="dashboard-header">
        <div>
          <p className="eyebrow">MONITORING NETWORK / ZONE TRACKING</p>
          <h1>Zone Surveillance</h1>
          <p className="muted">
            ArUco-based location identification and zone monitoring.
          </p>
        </div>

        <div className="system-status">
          <span className="status-dot"></span>
          TRACKER READY
        </div>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <MapPin />
          <p>TOTAL ZONES</p>
          <h2>05</h2>
          <span>Configured monitoring zones</span>
        </div>

        <div className="stat-card">
          <ScanEye />
          <p>MARKER SYSTEM</p>
          <h2>4×4_50</h2>
          <span>ArUco dictionary</span>
        </div>

        <div className="stat-card">
          <Radio />
          <p>ACTIVE MARKERS</p>
          <h2>--</h2>
          <span>Awaiting camera input</span>
        </div>

        <div className="stat-card">
          <ShieldCheck />
          <p>TRACKING STATUS</p>
          <h2>READY</h2>
          <span>Zone identification configured</span>
        </div>
      </div>

      <div className="panel">
        <div className="panel-heading">
          <div>
            <h3>Configured Monitoring Zones</h3>
            <p>Marker ID to zone mapping</p>
          </div>
          <MapPin />
        </div>

        <div className="zone-list">
          {zones.map((zone) => (
            <div className="zone-card" key={zone.id}>
              <div className="zone-marker">
                <span>#{zone.id}</span>
              </div>

              <div className="zone-info">
                <h3>{zone.name}</h3>
                <p>{zone.location}</p>
              </div>

              <span className="zone-status">
                ● CONFIGURED
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="panel zone-note">
        <h3>Zone Identification</h3>
        <p>
          Each ArUco marker represents a predefined monitoring zone.
          When a marker is detected by the camera, its corresponding
          zone is identified and can be included in wildlife alerts.
        </p>
        <p>
          This prototype uses simulated zone identification,
          not actual GPS coordinates.
        </p>
      </div>

    </section>
  );
}

export default ZoneTracking;
