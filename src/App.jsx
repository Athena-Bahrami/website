import DemHero from "./components/DemHero";

// TODO: fill in your real details
const NAME = "Athena Bahrami";
const PRONOUNS = "she/her";
const LINKS = [
  { label: "Resume", href: "/resume.pdf" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/bahrami-athena" },
  { label: "Github", href: "https://github.com/your-username" },
  { label: "Email", href: "mailto:bahrami.atena@gmail.com" },
  { label: "Sundry", href: "#" }, // TODO: point this at whatever "Sundry" should link to
];

export default function App() {
  return (
    <div className="page">
      <div className="page-info">
        <div className="name-row">
          <h1 className="name-box">{NAME}</h1>
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
