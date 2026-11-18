
import { useState } from "react";
import {
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
  ChevronDown,
  Footprints,
  Eye,
  PhoneCall,
  Trees,
  PawPrint,
  HeartPulse
} from "lucide-react";

const animalGuides = [
  {
    name: "Elephant",
    subtitle: "When you encounter an elephant",
    icon: "🐘",
    color: "elephant",
    instructions: [
      "Keep a substantial distance. Never approach an elephant, especially a calf or a herd.",
      "Do not stand between an elephant and its herd or block its escape route.",
      "Never feed, tease, chase or attempt to photograph it at close range.",
      "If it approaches, do not try to confront it. Follow local forest-authority guidance and move to safety when possible."
    ],
    avoid: "Do not honk, shout, throw objects or attempt to scare the elephant."
  },
  {
    name: "Tiger",
    subtitle: "If you spot a tiger",
    icon: "🐅",
    color: "tiger",
    instructions: [
      "Do not approach, follow or surround the animal.",
      "Keep your group together and give the tiger space to move away.",
      "Do not run towards it or attempt a close-up photograph.",
      "Move away cautiously when it is safe to do so and inform forest authorities."
    ],
    avoid: "Never attempt to attract, feed or provoke a tiger."
  },
  {
    name: "Lion",
    subtitle: "If you encounter a lion",
    icon: "🦁",
    color: "lion",
    instructions: [
      "Keep your distance and do not approach the animal.",
      "Avoid sudden movements and do not corner or surround it.",
      "Move towards a secure place or vehicle if safely accessible.",
      "Contact local wildlife or forest authorities."
    ],
    avoid: "Do not run towards the animal, feed it or try to drive it away."
  },
  {
    name: "Leopard",
    subtitle: "If you spot a leopard",
    icon: "🐆",
    color: "leopard",
    instructions: [
      "Stay calm and do not approach or follow the leopard.",
      "Give it an unobstructed route to move away.",
      "Keep children close and pets under control.",
      "Move to a secure location and notify forest authorities."
    ],
    avoid: "Do not crowd the animal or attempt to take a close-up photograph."
  },
  {
    name: "Deer & other herbivores",
    subtitle: "When you encounter grazing wildlife",
    icon: "🦌",
    color: "deer",
    instructions: [
      "Observe quietly from a distance.",
      "Avoid touching, feeding or chasing the animal.",
      "Do not approach young animals; their parents may be nearby.",
      "Leave the animal's path clear."
    ],
    avoid: "Do not attempt to pet or capture wild animals."
  }
];

function SafetyInstructions({ onNavigate }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <main className="wildsafe-safety">

      <header className="safety-topbar">
        <button
          className="safety-back"
          onClick={() => onNavigate?.("home")}
        >
          <ArrowLeft size={18} />
          Home
        </button>

        <span className="safety-brand">WILDSAFE</span>
        <span className="safety-brand-caption">WILDLIFE SAFETY COMPANION</span>
      </header>

      <div className="safety-content">

        <section className="safety-intro">
          <p className="safety-eyebrow">KNOW WHAT TO DO</p>
          <h1>Safety Instructions</h1>
          <p>
            A little awareness can make a big difference.
            Learn how to respond responsibly when wildlife
            crosses your path.
          </p>
        </section>

        <section className="safety-principle">
          <div className="safety-principle-icon">
            <ShieldCheck size={28} />
          </div>
          <div>
            <span>YOUR FIRST PRIORITY</span>
            <h2>Keep your distance. Give wildlife space.</h2>
            <p>
              Wild animals are unpredictable. Never approach,
              feed, chase or attempt to handle them.
            </p>
          </div>
        </section>

        <section className="safety-animal-section">
          <div className="safety-heading">
            <p className="safety-eyebrow">SPECIES-SPECIFIC GUIDANCE</p>
            <h2>Know your wildlife</h2>
            <p>Select an animal to read its safety guidance.</p>
          </div>

          <div className="safety-animal-list">
            {animalGuides.map((animal, index) => (
              <article
                className={`safety-animal-card ${expanded === index ? "expanded" : ""}`}
                key={animal.name}
              >
                <button
                  className="safety-animal-trigger"
                  onClick={() =>
                    setExpanded(expanded === index ? null : index)
                  }
                  aria-expanded={expanded === index}
                >
                  <span className={`animal-emoji ${animal.color}`}>
                    {animal.icon}
                  </span>

                  <span className="animal-title">
                    <strong>{animal.name}</strong>
                    <small>{animal.subtitle}</small>
                  </span>

                  <ChevronDown
                    className={`safety-chevron ${expanded === index ? "rotated" : ""}`}
                    size={20}
                  />
                </button>

                {expanded === index && (
                  <div className="safety-animal-details">
                    <h3>What you should do</h3>
                    <ul>
                      {animal.instructions.map((instruction, i) => (
                        <li key={i}>{instruction}</li>
                      ))}
                    </ul>

                    <div className="safety-avoid">
                      <AlertTriangle size={18} />
                      <p>{animal.avoid}</p>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="safety-general-section">
          <div className="safety-heading">
            <p className="safety-eyebrow">BEFORE YOU ENTER THE FOREST</p>
            <h2>Travel smart</h2>
          </div>

          <div className="safety-tips-grid">
            <div className="safety-tip-card">
              <Trees size={23} />
              <h3>Stay on designated routes</h3>
              <p>Follow permitted trails and forest-authority instructions.</p>
            </div>

            <div className="safety-tip-card">
              <Footprints size={23} />
              <h3>Travel responsibly</h3>
              <p>Respect restricted areas and avoid wandering alone.</p>
            </div>

            <div className="safety-tip-card">
              <Eye size={23} />
              <h3>Stay alert</h3>
              <p>Watch your surroundings and never disturb wildlife.</p>
            </div>

            <div className="safety-tip-card">
              <PhoneCall size={23} />
              <h3>Keep your phone ready</h3>
              <p>Save local emergency and forest department contacts.</p>
            </div>
          </div>
        </section>

        <section className="safety-emergency">
          <div className="emergency-icon">
            <HeartPulse size={25} />
          </div>
          <div>
            <p className="safety-eyebrow">IN CASE OF AN EMERGENCY</p>
            <h2>Prioritise human safety</h2>
            <p>
              Move to a secure place if possible. Do not attempt
              to rescue, capture or confront a wild animal.
              Contact local emergency services or forest authorities.
            </p>
          </div>
        </section>

        <p className="safety-disclaimer">
          These are general awareness guidelines, not a substitute
          for species-specific instructions from trained wildlife
          professionals or local forest authorities. Follow official
          directions for your location.
        </p>

      </div>
    </main>
  );
}

export default SafetyInstructions;
