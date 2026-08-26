export default function ResumePage() {
  return (
    <div
      style={{
        minHeight: "100svh",
        background: "#000",
        color: "#e8e6e1",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "32px 24px 48px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 900,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <a href="/" style={{ color: "#8a8f94", textDecoration: "none", fontSize: 15 }}>
          ← Back
        </a>
        <a
          href="/resume.pdf"
          download
          style={{
            border: "1.5px solid #e8e6e1",
            padding: "10px 22px",
            fontSize: 15,
            fontWeight: 600,
            color: "#e8e6e1",
            textDecoration: "none",
          }}
        >
          Download PDF
        </a>
      </div>

      <iframe
        src="/resume.pdf"
        title="Resume"
        style={{
          width: "100%",
          maxWidth: 900,
          height: "85vh",
          border: "1px solid #2a2d31",
          background: "#fff",
        }}
      />
    </div>
  );
}
