
import { useState } from "react";
import {
  ScanEye,
  Settings,
  ShieldCheck,
  BellRing,
  ChartNoAxesCombined,
  BookOpenCheck,
  PhoneCall,
  MapPin,
  ArrowUpRight,
  Video,
  X
} from "lucide-react";

function Home({ onNavigate, preference, onPreferenceChange }) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  const notificationOptions = [
    {
      value: "life",
      title: "Life Safety",
      description: "Wildlife threats to people"
    },
    {
      value: "crop",
      title: "Crop Protection",
      description: "Wildlife activity affecting farmland"
    },
    {
      value: "both",
      title: "Both",
      description: "Receive both types of alerts"
    }
  ];

  return (
    <main className="wildsafe-home">
      <div className="forest-overlay"></div>

      {/* HEADER */}
      <header className="wildsafe-header">
        <div className="wildsafe-brand">
          <ScanEye size={29} />
          <div>
            <h2>WILDSAFE</h2>
            <span>TRAVEL WITH AWARENESS</span>
          </div>
        </div>

        <button
          className="settings-icon"
          onClick={() => setSettingsOpen(!settingsOpen)}
          aria-label="Notification settings"
        >
          <Settings size={21} />
        </button>
      </header>

      {/* NOTIFICATION SETTINGS */}
      {settingsOpen && (
        <>
          <div
            className="settings-backdrop"
            onClick={() => setSettingsOpen(false)}
          ></div>

          <section className="preference-panel">
            <div className="preference-heading">
              <div>
                <span>PERSONALIZE YOUR EXPERIENCE</span>
                <h2>Notification Settings</h2>
              </div>

              <button onClick={() => setSettingsOpen(false)}>
                <X size={19} />
              </button>
            </div>

            <p>Choose which wildlife alerts you want to receive.</p>

            {notificationOptions.map((option) => (
              <label className="preference-option" key={option.value}>
                <input
                  type="radio"
                  name="notification-preference"
                  value={option.value}
                  checked={preference === option.value}
                  onChange={() => onPreferenceChange(option.value)}
                />

                <div>
                  <strong>{option.title}</strong>
                  <span>{option.description}</span>
                </div>
              </label>
            ))}

            <p className="preference-footnote">
              You can change your preference anytime.
            </p>
          </section>
        </>
      )}

      {/* MAIN CONTENT */}
      <section className="wildsafe-content">

        {/* WELCOME */}
        <div className="welcome-section">
          <span className="welcome-eyebrow">
            YOUR WILDLIFE SAFETY COMPANION
          </span>

          <h1>
            Stay aware.
            <br />
            <span>Travel safely.</span>
          </h1>

          <p>
            A little awareness goes a long way when travelling
            through wildlife-prone areas.
          </p>
        </div>

        {/* SAFETY STATUS */}
        <section className="safety-status">
          <div className="status-top">
            <div className="status-label">
              <ShieldCheck size={22} />
              <span>CURRENT SAFETY STATUS</span>
            </div>

            <span className="status-indicator">
              NO ACTIVE ALERTS
            </span>
          </div>

          <h2>No wildlife alerts reported</h2>

          <p>
            No active alerts are currently available for your
            monitored area. This does not guarantee wildlife is absent.
          </p>

          <div className="location-status">
            <MapPin size={15} />
            <span>Current zone · Awaiting location</span>
            <span className="last-update">Not yet updated</span>
          </div>
        </section>

        {/* MAIN FEATURE CARDS */}
        <div className="feature-layout">

          <button
            className="feature-card primary-card alerts-card"
            onClick={() => onNavigate("alerts")}
          >
            <div className="feature-card-top">
              <BellRing size={25} />
              <span>01</span>
            </div>

            <div>
              <h2>Alerts</h2>
              <p>
                Wildlife notifications, threat levels and
                risk analysis.
              </p>
            </div>

            <div className="feature-link">
              EXPLORE <ArrowUpRight size={17} />
            </div>
          </button>

          <button
            className="feature-card primary-card history-card"
            onClick={() => onNavigate("history")}
          >
            <div className="feature-card-top">
              <ChartNoAxesCombined size={25} />
              <span>02</span>
            </div>

            <div>
              <h2>Detection History</h2>
              <p>
                Previous sightings, zones, timestamps and
                wildlife frequency.
              </p>
            </div>

            <div className="feature-link">
              EXPLORE <ArrowUpRight size={17} />
            </div>
          </button>

          {/* SECONDARY CARDS */}
          <button
            className="feature-card secondary-card"
            onClick={() => onNavigate("safety")}
          >
            <div className="feature-card-top">
              <BookOpenCheck size={23} />
            </div>

            <h2>Safety Instructions</h2>
            <p>
              Know how to respond during a wildlife encounter.
            </p>

            <div className="feature-link">
              VIEW GUIDE <ArrowUpRight size={16} />
            </div>
          </button>

          <button
            className="feature-card secondary-card"
            onClick={() => onNavigate("contacts")}
          >
            <div className="feature-card-top">
              <PhoneCall size={23} />
            </div>

            <h2>Emergency Contacts</h2>
            <p>
              Forest department, family and trusted contacts.
            </p>

            <div className="feature-link">
              VIEW CONTACTS <ArrowUpRight size={16} />
            </div>
          </button>
        </div>

        {/* WILDLIFE INSIGHT */}
        <section className="wildlife-insight">
          <div className="insight-icon">
            <ScanEye size={23} />
          </div>

          <div>
            <span>WILDLIFE ACTIVITY INSIGHT</span>
            <h3>Discover the wildlife in your area</h3>
            <p>
              Frequently spotted animals will appear here once
              actual detection records are collected.
            </p>
          </div>

          <button onClick={() => onNavigate("history")}>
            VIEW INSIGHTS <ArrowUpRight size={17} />
          </button>
        </section>

      </section>

      {/* FOOTER */}
      <footer className="wildsafe-footer">
        <span>WILDSAFE · WILDLIFE CONFLICT MITIGATION</span>

        <button onClick={() => onNavigate("detection")}>
          <Video size={15} />
          PROTOTYPE DEMO
          <ArrowUpRight size={14} />
        </button>
      </footer>
    </main>
  );
}

export default Home;
