
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Bell,
  ShieldAlert,
  Sprout,
  Clock3,
  MapPin,
  Activity,
  AlertTriangle,
  CheckCircle2
} from "lucide-react";

function Alerts({ preference = "life", onNavigate }) {
  const [alerts, setAlerts] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch actual alerts from FastAPI
  useEffect(() => {
    let active = true;

    const fetchAlerts = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/alerts"
        );

        if (!response.ok) {
          throw new Error("Unable to retrieve alerts.");
        }

        const data = await response.json();

        if (active) {
          setAlerts(Array.isArray(data) ? data : []);
          setError("");
        }
      } catch (err) {
        if (active) {
          setError("Unable to connect to the WILDSAFE server.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchAlerts();

    const interval = setInterval(fetchAlerts, 5000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const allowedCategories =
    preference === "both"
      ? ["life", "crop"]
      : [preference];

  // Reset category filter if it is no longer allowed
  useEffect(() => {
    if (
      activeFilter !== "all" &&
      !allowedCategories.includes(activeFilter)
    ) {
      setActiveFilter("all");
    }
  }, [preference]);

  const visibleAlerts = useMemo(() => {
    return alerts
      .filter((alert) => {
        const categoryAllowed =
          allowedCategories.includes(alert.category);

        const filterAllowed =
          activeFilter === "all" ||
          alert.category === activeFilter;

        return categoryAllowed && filterAllowed;
      })
      .slice()
      .reverse();
  }, [alerts, activeFilter, preference]);

  const formatTime = (value) => {
    if (!value) return "Time unavailable";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short"
    });
  };

  const getRiskLabel = (risk) => {
    if (typeof risk !== "number") return "Not assessed";
    if (risk >= 75) return "High";
    if (risk >= 50) return "Moderate";
    return "Low";
  };

  const getRiskClass = (risk) => {
    if (typeof risk !== "number") return "risk-unknown";
    if (risk >= 75) return "risk-high";
    if (risk >= 50) return "risk-medium";
    return "risk-low";
  };

  const lifeCount = alerts.filter(
    (alert) => alert.category === "life"
  ).length;

  const cropCount = alerts.filter(
    (alert) => alert.category === "crop"
  ).length;

  return (
    <main className="wildsafe-alerts">

      <header className="alerts-topbar">
        <button
          className="alerts-back"
          onClick={() => onNavigate?.("home")}
          aria-label="Back to home"
        >
          <ArrowLeft size={19} />
          <span>Home</span>
        </button>

        <span className="alerts-brand">WILDSAFE</span>
        <span className="alerts-brand-caption">
          WILDLIFE SAFETY COMPANION
        </span>
      </header>

      <div className="alerts-content">

        <section className="alerts-intro">
          <p className="alerts-eyebrow">
            STAY INFORMED • STAY SAFE
          </p>
          <h1>Alert Centre</h1>
          <p>
            Wildlife activity notifications and safety information
            for your monitored areas.
          </p>
        </section>

        <section className="alerts-overview">
          <div className="overview-icon">
            <Bell size={25} />
          </div>

          <div>
            <p className="overview-label">YOUR NOTIFICATIONS</p>

            <h2>
              {loading
                ? "Loading alerts..."
                : visibleAlerts.length === 0
                  ? "No matching alerts"
                  : `${visibleAlerts.length} notification${visibleAlerts.length === 1 ? "" : "s"}`}
            </h2>

            <p>
              {visibleAlerts.length === 0
                ? "No matching detection alerts have been recorded yet."
                : "Review wildlife activity and recommended actions below."}
            </p>
          </div>

          <span className="overview-status">
            <CheckCircle2 size={15} />
            Monitoring view
          </span>
        </section>

        {error && (
          <p className="alerts-disclaimer">
            {error} Please ensure the FastAPI server is running.
          </p>
        )}

        <section className="alerts-section">
          <div className="alerts-section-heading">
            <div>
              <p className="alerts-eyebrow">
                NOTIFICATION CATEGORIES
              </p>
              <h2>What would you like to view?</h2>
            </div>
          </div>

          <div className="alerts-category-grid">

            {allowedCategories.includes("life") && (
              <button
                className={`alerts-category-card life-category ${
                  activeFilter === "life" ? "selected" : ""
                }`}
                onClick={() =>
                  setActiveFilter(
                    activeFilter === "life" ? "all" : "life"
                  )
                }
              >
                <div className="category-icon">
                  <ShieldAlert size={25} />
                </div>

                <span>HUMAN & LIVESTOCK SAFETY</span>
                <h3>Life Safety</h3>

                <p>
                  Notifications about wildlife activity that may
                  pose a risk to people or livestock.
                </p>

                <strong>{lifeCount} notifications</strong>
              </button>
            )}

            {allowedCategories.includes("crop") && (
              <button
                className={`alerts-category-card crop-category ${
                  activeFilter === "crop" ? "selected" : ""
                }`}
                onClick={() =>
                  setActiveFilter(
                    activeFilter === "crop" ? "all" : "crop"
                  )
                }
              >
                <div className="category-icon">
                  <Sprout size={25} />
                </div>

                <span>FARM & CROP AWARENESS</span>
                <h3>Crop Protection</h3>

                <p>
                  Notifications about wildlife activity that may
                  threaten nearby agricultural areas.
                </p>

                <strong>{cropCount} notifications</strong>
              </button>
            )}

          </div>
        </section>

        <section className="alerts-section notification-section">

          <div className="alerts-section-heading">
            <div>
              <p className="alerts-eyebrow">RECENT ACTIVITY</p>
              <h2>Alert Notifications</h2>
            </div>
          </div>

          <div className="alerts-filter-row">

            <button
              className={activeFilter === "all" ? "active" : ""}
              onClick={() => setActiveFilter("all")}
            >
              All
            </button>

            {allowedCategories.includes("life") && (
              <button
                className={activeFilter === "life" ? "active" : ""}
                onClick={() => setActiveFilter("life")}
              >
                Life Safety
              </button>
            )}

            {allowedCategories.includes("crop") && (
              <button
                className={activeFilter === "crop" ? "active" : ""}
                onClick={() => setActiveFilter("crop")}
              >
                Crop Protection
              </button>
            )}

          </div>

          {loading ? (
            <div className="alerts-empty-state">
              <Activity size={30} />
              <h3>Retrieving wildlife alerts...</h3>
            </div>
          ) : visibleAlerts.length === 0 ? (
            <div className="alerts-empty-state">
              <div className="empty-icon">
                <Activity size={30} />
              </div>

              <h3>No alerts to display</h3>

              <p>
                New notifications will appear here when the
                detection system records a matching wildlife alert.
              </p>

              <span>
                The absence of an alert does not guarantee that
                wildlife is absent from the area.
              </span>
            </div>
          ) : (
            <div className="alerts-list">

              {visibleAlerts.map((alert, index) => {

                const risk =
                  alert.category === "life"
                    ? alert.lifeRisk
                    : alert.cropRisk;

                return (
                  <article
                    className="wildlife-alert-card"
                    key={alert.id ?? `${alert.timestamp}-${index}`}
                  >

                    <div className="wildlife-alert-top">

                      <div className="wildlife-alert-animal">

                        {alert.category === "life" ? (
                          <ShieldAlert size={22} />
                        ) : (
                          <Sprout size={22} />
                        )}

                        <div>
                          <h3>
                            {alert.animal || "Wildlife detection"}
                          </h3>

                          <p>
                            {alert.category === "life"
                              ? "Life Safety Alert"
                              : "Crop Protection Alert"}
                          </p>
                        </div>

                      </div>

                      <span className={`risk-label ${getRiskClass(risk)}`}>
                        {getRiskLabel(risk)} Risk
                      </span>

                    </div>

                    <div className="wildlife-alert-details">

                      <span>
                        <MapPin size={15} />
                        {alert.zone || "Zone unavailable"}
                      </span>

                      <span>
                        <Clock3 size={15} />
                        {formatTime(alert.timestamp)}
                      </span>

                    </div>

                    {typeof risk === "number" && (
                      <div className="alert-risk-meter">

                        <div>
                          <span>Risk assessment</span>
                          <strong>{risk}/100</strong>
                        </div>

                        <div className="risk-track">
                          <div
                            className={`risk-fill ${getRiskClass(risk)}`}
                            style={{
                              width: `${Math.max(0, Math.min(100, risk))}%`
                            }}
                          />
                        </div>

                      </div>
                    )}

                    <p className="alert-message">
                      {alert.message ||
                        "Wildlife activity detected in this zone."}
                    </p>

                    {alert.action && (
                      <div className="alert-recommendation">
                        <AlertTriangle size={17} />
                        <p>{alert.action}</p>
                      </div>
                    )}

                  </article>
                );
              })}

            </div>
          )}

        </section>

        <p className="alerts-disclaimer">
          Wildlife risk indicators are decision-support estimates, not
          guarantees of danger or safety. Follow local forest department
          guidance during wildlife encounters.
        </p>

      </div>
    </main>
  );
}

export default Alerts;
