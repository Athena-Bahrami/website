import DemHero from "./components/DemHero";

// TODO: fill in your real details
const NAME = "Athena Bahrami";
const TAGLINE = "Rock mechanics researcher — discrete element modeling & fracture";
const LINKS = [
  { label: "Resume", href: "/resume.pdf" },
  { label: "Email", href: "mailto:bahramiy@ualberta.ca" },
  { label: "GitHub", href: "https://github.com/your-username" },
  { label: "LinkedIn", href: "https://linkedin.com/in/your-profile" },
];

export default function App() {
  return (
    <div className="page">
      <div className="page-visual">
        <DemHero />
      </div>

      <div className="page-info">
        <h1
          style={{
            fontSize: 40,
            fontWeight: 500,
            margin: 0,
            color: "#e8e6e1",
          }}
        >
          {NAME}
        </h1>
        <p
          style={{
            fontSize: 18,
            color: "#8a8f94",
            margin: 0,
          }}
        >
          {TAGLINE}
        </p>

        <div className="page-links">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              style={{
                border: "1px solid #2a2d31",
                borderRadius: 4,
                padding: "12px 20px",
                fontSize: 15,
                color: "#e8e6e1",
                textDecoration: "none",
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
