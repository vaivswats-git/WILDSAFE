
import React from "react";
import "./Intro.css";

function Intro({ onEnter }) {
  return (
    <div className="intro-page">
      <div className="intro-overlay"></div>

      <nav className="intro-nav">
        <div className="intro-logo">
          <span className="logo-mark">✧</span>
          WILDSAFE
        </div>

        <div className="intro-nav-links">
          <button onClick={() => {}}>HOME</button>
          <button onClick={() => {}}>ABOUT</button>
          <button onClick={() => {}}>MONITORING</button>
        </div>
      </nav>

      <main className="intro-content">
        <p className="intro-eyebrow">
          AI-POWERED WILDLIFE CONFLICT MITIGATION
        </p>

        <h1 className="intro-heading">
          A SAFER BOUNDARY
          <br />
          BETWEEN TWO
          <br />
          <span>WORLDS.</span>
        </h1>

        <p className="intro-description">
          Intelligent wildlife detection and proactive
          <br className="desktop-break" />
          conflict mitigation for safer coexistence.
        </p>

        <button className="enter-button" onClick={onEnter}>
          ENTER APP
          <span>→</span>
        </button>
      </main>

      <footer className="intro-footer">
        <span>WILDSAFE — WILDLIFE CONFLICT MITIGATION SYSTEM</span>
        <span>DETECT · ANALYZE · PROTECT</span>
      </footer>
    </div>
  );
}

export default Intro;
