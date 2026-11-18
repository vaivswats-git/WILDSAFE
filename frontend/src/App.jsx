
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import LiveDetection from "./pages/LiveDetection";
import ZoneTracking from "./pages/ZoneTracking";
import Alerts from "./pages/Alerts";
import DetectionHistory from "./pages/DetectionHistory";
import Settings from "./pages/Settings";
import "./App.css";
import SafetyInstructions from "./pages/SafetyInstructions";
import EmergencyContacts from "./pages/EmergencyContacts";
import Intro from "./pages/Intro";

function App() {
  const [page, setPage] = useState("intro");
  const [preference, setPreference] = useState("life");

  const navigate = (nextPage) => setPage(nextPage);

  // Sync the default preference with the backend
  useEffect(() => {
    fetch("http://127.0.0.1:8000/alarm/preference", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        preference: "life"
      })
    })
      .then(response => response.json())
      .then(data => console.log("Alarm preference:", data))
      .catch(error => console.error("Preference sync error:", error));
  }, []);

  // Update preference in both React and Python
  const handlePreferenceChange = async (newPreference) => {
    setPreference(newPreference);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/alarm/preference",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            preference: newPreference
          })
        }
      );

      const data = await response.json();

      console.log("Alarm preference updated:", data);

      if (!response.ok || data.status !== "success") {
        console.error("Backend preference update failed:", data);
      }

    } catch (error) {
      console.error("Preference connection error:", error);
    }
  };

  const renderPage = () => {
    switch (page) {
      case "intro":
        return <Intro onEnter={() => navigate("home")} />;

      case "alerts":
        return (
          <Alerts
            preference={preference}
            onNavigate={navigate}
          />
        );

      case "history":
        return <DetectionHistory onNavigate={navigate} />;

      case "safety":
        return <SafetyInstructions onNavigate={navigate} />;

      case "contacts":
        return <EmergencyContacts onNavigate={navigate} />;

      case "detection":
        return <LiveDetection onNavigate={navigate} />;

      case "zones":
        return <ZoneTracking />;

      case "settings":
        return (
          <Settings
            preference={preference}
            onPreferenceChange={handlePreferenceChange}
          />
        );

      case "dashboard":
        return <Dashboard />;

      default:
        return (
          <Home
            onNavigate={navigate}
            preference={preference}
            onPreferenceChange={handlePreferenceChange}
          />
        );
    }
  };

  return <>{renderPage()}</>;
}

export default App;
