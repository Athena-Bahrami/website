import DemHero from "./components/DemHero";

// TODO: fill in your real details
const NAME = "Athena Bahrami";
const PRONOUNS = "she/her";
const LINKS = [
  { label: "Resume", href: "/resume.pdf" },
  { label: "LinkedIn", href: "https://linkedin.com/in/your-profile" },
  { label: "Github", href: "https://github.com/your-username" },
  { label: "Email", href: "mailto:bahramiy@ualberta.ca" },
];

export default function App() {
  return (
    <div className="page">
      <div className="page-info">
        <div className="name-row">
          <div className="name-box">{NAME}</div>
          <span className="pronouns">{PRONOUNS}</span>
        </div>

        <div className="page-links">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <div className="page-visual">
        <DemHero />
      </div>
    </div>
  );
}
