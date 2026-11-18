
import {
  ScanEye,
  LayoutDashboard,
  Camera,
  MapPin,
  Bell,
  Activity,
  Settings,
  LogOut
} from "lucide-react";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "detection", label: "Live Detection", icon: Camera },
  { id: "zones", label: "Zone Tracking", icon: MapPin },
  { id: "alerts", label: "Alerts", icon: Bell },
  { id: "history", label: "Detection History", icon: Activity },
  { id: "settings", label: "Settings", icon: Settings }
];

function Sidebar({ activePage, setActivePage, onLogout }) {
  return (
    <aside className="sidebar">
      <div className="logo">
        <ScanEye size={26} />
        <span>WILDLIFE</span>
      </div>

      <p className="side-label">MONITORING</p>

      <nav>
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              className={`side-link ${
                activePage === item.id ? "active" : ""
              }`}
              onClick={() => setActivePage(item.id)}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <button className="side-link" onClick={onLogout}>
          <LogOut size={18} />
          Exit Dashboard
        </button>

        <p>WILDLIFE.OS · PROTOTYPE</p>
      </div>
    </aside>
  );
}

export default Sidebar;
