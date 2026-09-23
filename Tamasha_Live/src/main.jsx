import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const draftKey = "tamasha-draft";
const skillsByTrack = {
  Frontend: ["React", "Vue", "TypeScript", "CSS Modules"],
  Backend: ["Node.js", "Python / Django", "PostgreSQL", "Redis"],
  Fullstack: ["React", "Node.js", "TypeScript", "PostgreSQL"],
  "UI/UX Design": ["Figma", "Storybook", "Design Systems"],
};
const emptyForm = {
  name: "",
  email: "",
  portfolio: "",
  track: "",
  level: "",
  skills: [],
};

function App() {
  const [form, setForm] = useState(() => {
    try {
      return { ...emptyForm, ...JSON.parse(localStorage.getItem(draftKey)) };
    } catch {
      return emptyForm;
    }
  });
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setSaved(false);
    const timer = setTimeout(() => {
      localStorage.setItem(draftKey, JSON.stringify(form));
      setSaved(true);
    }, 500);
    return () => clearTimeout(timer);
  }, [form]);

  const update = (name, value) => setForm({ ...form, [name]: value });
  const selectTrack = (track) => setForm({ ...form, track, skills: [] });
  const toggleSkill = (skill) =>
    update(
      "skills",
      form.skills.includes(skill)
        ? form.skills.filter((item) => item !== skill)
        : [...form.skills, skill],
    );

  function valid() {
    if (
      step === 1 &&
      (!form.name.trim() || !/^\S+@\S+\.\S+$/.test(form.email))
    ) {
      setError("Enter your name and a valid email address.");
      return false;
    }
    if (step === 2 && (!form.track || !form.level)) {
      setError("Select your track and experience level.");
      return false;
    }
    if (step === 3 && !form.skills.length) {
      setError("Select at least one skill.");
      return false;
    }
    setError("");
    return true;
  }

  if (submitted)
    return (
      <main className="container success">
        <div className="success-icon">✓</div>
        <h1>Application submitted!</h1>
        <p>Thanks, {form.name}. Your details have been saved.</p>
        <button
          onClick={() => {
            setForm(emptyForm);
            setStep(1);
            setSubmitted(false);
          }}
        >
          Start again
        </button>
      </main>
    );

  return (
    <main className="container">
      <header>
        <div>
          <p className="tag">Tamasha.live</p>
          <h1>Onboarding wizard</h1>
        </div>
        <small className={saved ? "saved" : "saving"}>
          {saved ? "● Draft saved" : "● Saving draft..."}
        </small>
      </header>

      <div className="hero">
        <center>
          <h1>
            Welcome to <span>Tamasha.live!</span>
          </h1>
        </center>
        <center>
          <p>Rebuilding how India Socialises</p>
        </center>
        <br />
        <center>
          <button id="jiggle-btn">
            <a href="#target">Click to START</a>
          </button>
        </center>
      </div>

      <div className="stepper" id="target">
        {["Personal info", "Preferences", "Tech stack", "Review"].map(
          (name, index) => (
            <button
              key={name}
              className={step === index + 1 ? "active-step" : ""}
              disabled={index + 1 > step}
              onClick={() => setStep(index + 1)}
            >
              {index + 1}. {name}
            </button>
          ),
        )}
      </div>
      <section className="card">
        {error && <p className="error">{error}</p>}
        {step === 1 && (
          <>
            <h2>Personal information</h2>
            <label>
              Full name <span>*</span>
              <input
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Enter your Name"
              />
            </label>
            <label>
              Email <span>*</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="Enter your email "
              />
            </label>
            <label>
              Portfolio or GitHub
              <input
                value={form.portfolio}
                onChange={(e) => update("portfolio", e.target.value)}
                placeholder="https://github.com/your_username here"
              />
            </label>
          </>
        )}
        {step === 2 && (
          <>
            <h2>Preferences</h2>
            <label>
              Primary track
              <select
                value={form.track}
                onChange={(e) => selectTrack(e.target.value)}
              >
                <option value="">Select a track</option>
                {Object.keys(skillsByTrack).map((track) => (
                  <option key={track}>{track}</option>
                ))}
              </select>
            </label>
            <label>
              Experience level
              <select
                value={form.level}
                onChange={(e) => update("level", e.target.value)}
              >
                <option value="">Select your level</option>
                <option>Junior</option>
                <option>Mid-level</option>
                <option>Senior</option>
              </select>
            </label>
          </>
        )}
        {step === 3 && (
          <>
            <h2>Tech stack</h2>
            <p className="help">Select the tools you use most often.</p>
            <div className="skills">
              {(skillsByTrack[form.track] || []).map((skill) => (
                <label className="check" key={skill}>
                  <input
                    type="checkbox"
                    checked={form.skills.includes(skill)}
                    onChange={() => toggleSkill(skill)}
                  />
                  {skill}
                </label>
              ))}
            </div>
            {!form.track && (
              <p className="help">Go back and select a track first.</p>
            )}
          </>
        )}
        {step === 4 && (
          <>
            <h2>Review your application</h2>
            <Review
              title="Personal information"
              edit={() => setStep(1)}
              rows={[
                ["Name", form.name],
                ["Email", form.email],
                ["Portfolio", form.portfolio || "Not provided"],
              ]}
            />
            <Review
              title="Preferences"
              edit={() => setStep(2)}
              rows={[
                ["Track", form.track],
                ["Level", form.level],
              ]}
            />
            <Review
              title="Tech stack"
              edit={() => setStep(3)}
              rows={[["Skills", form.skills.join(", ")]]}
            />
          </>
        )}
        <div className="actions">
          {step > 1 && (
            <button className="secondary" onClick={() => setStep(step - 1)}>
              Back
            </button>
          )}
          {step < 4 ? (
            <button onClick={() => valid() && setStep(step + 1)}>
              Continue
            </button>
          ) : (
            <button
              onClick={() => {
                localStorage.removeItem(draftKey);
                setSubmitted(true);
              }}
            >
              Submit application
            </button>
          )}
        </div>
      </section>
    </main>
  );
}

function Review({ title, rows, edit }) {
  return (
    <div className="review">
      <div>
        <h3>{title}</h3>
        <button className="edit" onClick={edit}>
          Edit
        </button>
      </div>
      {rows.map(([label, value]) => (
        <p key={label}>
          <span>{label}</span>
          {value}
        </p>
      ))}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
