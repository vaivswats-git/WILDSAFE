
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Clock3,
  Search,
  Filter,
  MapPin,
  Eye,
  PawPrint,
  Activity,
  ShieldAlert,
  ChevronDown
} from "lucide-react";

function DetectionHistory({ detections: initialDetections, onNavigate }) {
  const [detections, setDetections] = useState(initialDetections || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [animalFilter, setAnimalFilter] = useState("all");
  const [zoneFilter, setZoneFilter] = useState("all");

  // Fetch actual detections from FastAPI
  useEffect(() => {
    let active = true;

    const fetchDetections = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/detections"
        );

        if (!response.ok) {
          throw new Error("Unable to retrieve detection records.");
        }

        const data = await response.json();

        if (active) {
          setDetections(Array.isArray(data) ? data : []);
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

    fetchDetections();

    // Refresh records every 5 seconds
    const interval = setInterval(fetchDetections, 5000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const animals = [
    ...new Set(detections.map((item) => item.animal).filter(Boolean))
  ];

  const zones = [
    ...new Set(detections.map((item) => item.zone).filter(Boolean))
  ];

  const filteredDetections = useMemo(() => {
    return detections.filter((item) => {
      const matchesSearch =
        `${item.animal || ""} ${item.zone || ""}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesAnimal =
        animalFilter === "all" || item.animal === animalFilter;

      const matchesZone =
        zoneFilter === "all" || item.zone === zoneFilter;

      return matchesSearch && matchesAnimal && matchesZone;
    });
  }, [detections, search, animalFilter, zoneFilter]);

  const highRiskCount = detections.filter((item) => {
    const risk = Number(item.risk);
    return Number.isFinite(risk) && risk >= 50;
  }).length;

  const formatDate = (value) => {
    if (!value) return "Date unavailable";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short"
    });
  };

  const animalCounts = animals.map((animal) => ({
    animal,
    count: detections.filter((item) => item.animal === animal).length
  })).sort((a, b) => b.count - a.count);

  const maxCount = Math.max(
    1,
    ...animalCounts.map((item) => item.count)
  );

  const getRiskLabel = (risk) => {
    if (typeof risk !== "number") return "Unassessed";
    if (risk >= 75) return "High";
    if (risk >= 50) return "Moderate";
    return "Low";
  };

  return (
    <main className="wildsafe-history">

      <header className="history-topbar">
        <button
          className="history-back"
          onClick={() => onNavigate?.("home")}
        >
          <ArrowLeft size={18} />
          Home
        </button>

        <span className="history-brand">WILDSAFE</span>
        <span className="history-brand-caption">
          WILDLIFE SAFETY COMPANION
        </span>
      </header>

      <div className="history-content">

        <section className="history-intro">
          <p className="history-eyebrow">
            UNDERSTANDING WILDLIFE ACTIVITY
          </p>
          <h1>Detection History</h1>
          <p>
            Explore previously recorded wildlife activity across
            monitored zones.
          </p>
        </section>

        <section className="history-stats">

          <div className="history-stat-card">
            <div className="history-stat-icon">
              <PawPrint size={22} />
            </div>
            <span>TOTAL DETECTIONS</span>
            <h2>{detections.length}</h2>
            <p>Recorded sightings</p>
          </div>

          <div className="history-stat-card">
            <div className="history-stat-icon">
              <ShieldAlert size={22} />
            </div>
            <span>HIGH-RISK EVENTS</span>
            <h2>{highRiskCount}</h2>
            <p>Risk score of 50 or above</p>
          </div>

          <div className="history-stat-card">
            <div className="history-stat-icon">
              <MapPin size={22} />
            </div>
            <span>ZONES COVERED</span>
            <h2>{zones.length}</h2>
            <p>Zones with recorded activity</p>
          </div>

        </section>

        <section className="history-activity-panel">
          <div className="history-panel-heading">
            <div>
              <p className="history-eyebrow">WILDLIFE INSIGHTS</p>
              <h2>Animal Activity</h2>
              <p>Detection frequency based on recorded data</p>
            </div>
            <Activity size={23} />
          </div>

          {loading ? (
            <div className="history-insight-empty">
              <Activity size={25} />
              <p>Loading wildlife activity...</p>
            </div>
          ) : animalCounts.length === 0 ? (
            <div className="history-insight-empty">
              <PawPrint size={25} />
              <p>Collecting wildlife activity data</p>
              <span>
                Animal frequency insights will appear after detections
                have been recorded.
              </span>
            </div>
          ) : (
            <div className="animal-frequency-list">
              {animalCounts.map((item) => (
                <div className="animal-frequency-item" key={item.animal}>
                  <div className="animal-frequency-label">
                    <span>{item.animal}</span>
                    <strong>{item.count}</strong>
                  </div>

                  <div className="animal-frequency-track">
                    <div
                      className="animal-frequency-fill"
                      style={{
                        width: `${(item.count / maxCount) * 100}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="history-records-panel">

          <div className="history-panel-heading">
            <div>
              <p className="history-eyebrow">YOUR RECORDS</p>
              <h2>Detection Records</h2>
              <p>Review previously recorded animal detections</p>
            </div>
            <Clock3 size={23} />
          </div>

          {error && (
            <p className="history-disclaimer">
              {error} Start the FastAPI server to retrieve records.
            </p>
          )}

          <div className="history-controls">

            <div className="history-search">
              <Search size={17} />
              <input
                type="text"
                placeholder="Search animal or zone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <label className="history-select">
              <Filter size={16} />
              <select
                value={animalFilter}
                onChange={(e) => setAnimalFilter(e.target.value)}
              >
                <option value="all">All animals</option>
                {animals.map((animal) => (
                  <option key={animal} value={animal}>
                    {animal}
                  </option>
                ))}
              </select>
              <ChevronDown size={15} />
            </label>

            <label className="history-select">
              <MapPin size={16} />
              <select
                value={zoneFilter}
                onChange={(e) => setZoneFilter(e.target.value)}
              >
                <option value="all">All zones</option>
                {zones.map((zone) => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ))}
              </select>
              <ChevronDown size={15} />
            </label>

          </div>

          {loading ? (
            <div className="history-empty">
              <Activity size={29} />
              <h3>Loading detection records...</h3>
            </div>
          ) : filteredDetections.length === 0 ? (
            <div className="history-empty">
              <div className="history-empty-icon">
                <Eye size={29} />
              </div>

              <h3>
                {detections.length === 0
                  ? "No detection records yet"
                  : "No matching records"}
              </h3>

              <p>
                {detections.length === 0
                  ? "Once wildlife is detected and recorded, its details will appear here."
                  : "Try changing your search or filters."}
              </p>
            </div>
          ) : (
            <div className="history-record-list">
              {filteredDetections.map((item, index) => {
                const riskValue = Number(item.risk);
                const riskLabel = getRiskLabel(riskValue);

                return (
                  <article
                    className="history-record-card"
                    key={item.id ?? `${item.animal}-${item.timestamp}-${index}`}
                  >
                    <div className="record-animal-icon">
                      <PawPrint size={23} />
                    </div>

                    <div className="record-main">
                      <h3>{item.animal || "Unknown animal"}</h3>

                      <div className="record-meta">
                        <span>
                          <MapPin size={14} />
                          {item.zone || "Zone unavailable"}
                        </span>

                        <span>
                          <Clock3 size={14} />
                          {formatDate(item.timestamp)}
                        </span>
                      </div>
                    </div>

                    <div className="record-extra">
                      <span className="record-confidence">
                        {typeof item.confidence === "number"
                          ? `${(item.confidence * 100).toFixed(1)}%`
                          : item.confidence || "Unavailable"}
                      </span>
                      <span>Confidence</span>
                    </div>

                    <span
                      className={`record-risk ${riskLabel.toLowerCase()}`}
                    >
                      {riskLabel}
                    </span>
                  </article>
                );
              })}
            </div>
          )}

        </section>

        <p className="history-disclaimer">
          Activity summaries reflect recorded detections only.
          Missing records do not mean wildlife is absent from an area.
        </p>

      </div>
    </main>
  );
}

export default DetectionHistory;
