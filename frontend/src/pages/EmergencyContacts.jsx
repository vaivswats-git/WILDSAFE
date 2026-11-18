import { useEffect, useState } from "react";
import {
  Phone,
  UserRound,
  ShieldCheck,
  Plus,
  Trash2,
  ArrowLeft,
  Trees,
  HeartHandshake,
  PhoneCall,
} from "lucide-react";

const STORAGE_KEY = "wildsafe-emergency-contacts";

function EmergencyContacts({ onNavigate }) {
  const [contacts, setContacts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });

  const [form, setForm] = useState({
    name: "",
    phone: "",
    type: "Trusted Contact",
  });

  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  }, [contacts]);

  const addContact = (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.phone.trim()) return;

    setContacts((previous) => [
      ...previous,
      {
        id: Date.now(),
        name: form.name.trim(),
        phone: form.phone.trim(),
        type: form.type,
      },
    ]);

    setForm({
      name: "",
      phone: "",
      type: "Trusted Contact",
    });

    setShowForm(false);
  };

  const deleteContact = (id) => {
    setContacts((previous) => previous.filter((contact) => contact.id !== id));
  };

  const getIcon = (type) => {
    if (type === "Forest Department") return <Trees size={21} />;
    if (type === "Emergency Services") return <ShieldCheck size={21} />;
    return <HeartHandshake size={21} />;
  };

  return (
    <main className="emergency-page">
      <div className="emergency-overlay">
        <header className="emergency-header">
          <button
            className="emergency-back"
            onClick={() => onNavigate?.("home")}
          >
            <ArrowLeft size={18} /> Back to Home
          </button>

          <div className="emergency-brand">WILDSAFE</div>
        </header>

        <section className="emergency-content">
          <div className="emergency-heading">
            <span className="emergency-eyebrow">YOUR SAFETY NETWORK</span>
            <h1>Emergency Contacts</h1>
            <p>
              Keep important contacts close. In an emergency, every second
              matters.
            </p>
          </div>

          <div className="emergency-notice">
            <ShieldCheck size={23} />
            <div>
              <strong>Stay prepared</strong>
              <p>
                Save verified local emergency and Forest Department numbers,
                along with people you trust.
              </p>
            </div>
          </div>

          <div className="emergency-section-heading">
            <div>
              <h2>Your saved contacts</h2>
              <p>{contacts.length} contact{contacts.length !== 1 ? "s" : ""} saved</p>
            </div>

            <button
              className="emergency-add-button"
              onClick={() => setShowForm(!showForm)}
            >
              <Plus size={18} />
              Add Contact
            </button>
          </div>

          {showForm && (
            <form className="emergency-form" onSubmit={addContact}>
              <h3>Add a contact</h3>

              <label>Contact name</label>
              <input
                type="text"
                placeholder="Enter name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                required
              />

              <label>Phone number</label>
              <input
                type="tel"
                placeholder="Enter phone number"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
                required
              />

              <label>Contact category</label>
              <select
                value={form.type}
                onChange={(e) =>
                  setForm({ ...form, type: e.target.value })
                }
              >
                <option>Trusted Contact</option>
                <option>Forest Department</option>
                <option>Emergency Services</option>
              </select>

              <div className="emergency-form-actions">
                <button type="submit" className="emergency-save">
                  Save Contact
                </button>
                <button
                  type="button"
                  className="emergency-cancel"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {contacts.length === 0 ? (
            <div className="emergency-empty">
              <UserRound size={35} />
              <h3>No contacts added yet</h3>
              <p>
                Add trusted people and verified local emergency contacts to
                make them accessible here.
              </p>
            </div>
          ) : (
            <div className="emergency-contact-list">
              {contacts.map((contact) => (
                <article className="emergency-contact-card" key={contact.id}>
                  <div className="emergency-contact-icon">
                    {getIcon(contact.type)}
                  </div>

                  <div className="emergency-contact-info">
                    <span>{contact.type}</span>
                    <h3>{contact.name}</h3>
                    <p>{contact.phone}</p>
                  </div>

                  <div className="emergency-contact-actions">
                    <a
                      href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`}
                      className="emergency-call"
                      aria-label={`Call ${contact.name}`}
                    >
                      <PhoneCall size={17} />
                    </a>

                    <button
                      className="emergency-delete"
                      onClick={() => deleteContact(contact.id)}
                      aria-label={`Delete ${contact.name}`}
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="emergency-bottom-note">
            <Phone size={19} />
            <p>
              Calling a contact opens your device's phone app. Make sure
              numbers are correct and verified before relying on them.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default EmergencyContacts;