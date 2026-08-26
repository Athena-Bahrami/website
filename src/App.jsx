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
    <div>
      <DemHero />

      <section
        style={{
          background: "#0a0c0e",
          padding: "80px 24px 96px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: 40,
            fontWeight: 500,
            margin: "0 0 12px",
            color: "#e8e6e1",
          }}
        >
          {NAME}
        </h1>
        <p
          style={{
            fontSize: 18,
            color: "#8a8f94",
            margin: "0 0 32px",
          }}
        >
          {TAGLINE}
        </p>

        <div
          style={{
            display: "flex",
            gap: 16,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              style={{
                border: "1px solid #2a2d31",
                borderRadius: 4,
                padding: "10px 20px",
                fontSize: 15,
                color: "#e8e6e1",
                textDecoration: "none",
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
