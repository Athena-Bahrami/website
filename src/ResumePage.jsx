import { useState } from "react";
import GeoscienceWorkstation from "./components/GeoscienceWorkstation";
import "./resume.css";

const FRAGMENTS = [
  {
    id: "summary",
    title: "Summary",
    accent: "#EE6F11",
    defaultOpen: true,
    body: (
      <>
        <p>
          I'm a PhD candidate in geotechnical engineering at the University of
          Alberta (wrapping up October 2026), and I've spent the last 8+
          years doing the kind of work that lives at the intersection of
          breaking rocks in a lab and convincing a computer to simulate it
          afterward. My research spans experimental rock mechanics, discrete
          element method (DEM) modeling, and subsurface characterization — in
          practice, that means I design large-scale testing programs, build
          geomechanical frameworks, and apply the results to real problems in
          hydraulic fracturing and reservoir engineering.
        </p>
        <p>
          Before academia pulled me in, I worked in petrophysics and
          subsurface modeling at NIOC and Schlumberger-affiliated operations,
          so I know what it feels like when the models have to actually
          work. I'm a registered EIT with APEGA, and I serve as Secretary of
          the CGS Equity, Diversity, and Inclusion Committee — because good
          science needs good people, full stop.
        </p>
      </>
    ),
  },
  {
    id: "experience",
    title: "Professional Experience",
    accent: "#EE6F11",
    body: (
      <>
        <div className="entry">
          <div className="entry-head">
            <span className="entry-title">PhD Candidate</span>
            <span className="entry-org">University of Alberta, Edmonton</span>
            <span className="entry-date">2021 – Oct 2026</span>
          </div>
          <ul className="bullets">
            <li>
              Decided that rocks shouldn't need to look pretty to be useful —
              developed a methodology using <b>irregular rock fragments</b>{" "}
              to characterize mechanical properties, opening up testing in
              formations where core recovery can't produce a proper cylinder
              anyway.
            </li>
            <li>
              Put <b>200+</b> mechanical tests on Sulphur Mountain Formation
              (Montney equivalent) siltstone through their paces, building
              the <b>first comprehensive mechanical database</b> it's ever
              had.
            </li>
            <li>
              Ran a <b>Central Composite Design</b> parametric study in
              ESyS-Particle across <b>14</b> simulation runs to quantify how
              modulus and strength mismatch steer fracture paths in
              composite specimens.
            </li>
            <li>
              Worked with a team of six to design and validate the{" "}
              <b>world's smallest triaxial cell</b>. Went very small. Do not
              regret it.
            </li>
          </ul>
        </div>

        <div className="entry">
          <div className="entry-head">
            <span className="entry-title">Geomechanics Researcher</span>
            <span className="entry-org">University of Alberta, Edmonton</span>
            <span className="entry-date">2019 – 2021</span>
          </div>
          <ul className="bullets">
            <li>
              Built a comprehensive rock mechanical dataset for the Duvernay
              Formation to help explain induced seismicity near Fox Creek.
            </li>
            <li>
              Constructed <b>1D mechanical earth models</b> for three wells
              in Techlog — it turned out stratigraphy had a lot to answer
              for.
            </li>
          </ul>
        </div>

        <div className="entry">
          <div className="entry-head">
            <span className="entry-title">Subsurface Modeler</span>
            <span className="entry-org">
              National Iranian Oil Company, Ahvaz
            </span>
            <span className="entry-date">2017 – 2019</span>
          </div>
          <ul className="bullets">
            <li>
              Performed well log QC, normalization, and petrophysical
              interpretation to feed 3D geological models that actually
              reflect what's down there.
            </li>
            <li>
              Constructed static 3D subsurface models in Petrel — essentially
              mapmaking for the underground.
            </li>
          </ul>
        </div>

        <div className="entry">
          <div className="entry-head">
            <span className="entry-title">Junior Petrophysicist</span>
            <span className="entry-org">
              Well Services of Iran (Schlumberger Methods), Tehran
            </span>
            <span className="entry-date">2016 – 2017</span>
          </div>
          <ul className="bullets">
            <li>
              Learned to read a rock's autobiography from wireline signals —
              petrophysical analysis of well logs in GeoFrame and Techlog.
            </li>
          </ul>
        </div>

        <div className="entry">
          <div className="entry-head">
            <span className="entry-title">Seismic Interpreter — Intern</span>
            <span className="entry-org">
              Research Institute of Petroleum Industry, Tehran
            </span>
            <span className="entry-date">2014</span>
          </div>
          <ul className="bullets">
            <li>
              First real encounter with the subsurface: horizon picking,
              fault mapping, and formation top correlation in Petrel.
            </li>
          </ul>
        </div>
      </>
    ),
  },
  {
    id: "skills",
    title: "Skills",
    accent: "#EE6F11",
    body: (
      <div className="skills-grid">
        <div className="skill-cat">
          <b>Programming &amp; Data Analysis</b>
          <span>Python (Pandas, NumPy, Matplotlib), Gnuplot, Git, Bash</span>
        </div>
        <div className="skill-cat">
          <b>Computational &amp; Simulation</b>
          <span>
            ESyS-Particle, PFC3D, Abaqus, RS2, Techlog, Petrel, Geolog,
            Blender, SLURM (HPC)
          </span>
        </div>
        <div className="skill-cat">
          <b>Experimental &amp; Image Processing</b>
          <span>
            ParaView, DIC (VICSnap, VIC2D, VIC3D), Dragonfly ORS, Metavision
            SDK
          </span>
        </div>
        <div className="skill-cat">
          <b>Laboratory Expertise</b>
          <span>
            UCS, TCS, Brazilian tensile strength, point load index, sonic
            velocity, permeability, porosity
          </span>
        </div>
        <div className="skill-cat">
          <b>Languages</b>
          <span>
            English (full professional), French (B1, advancing), Persian
            (native)
          </span>
        </div>
      </div>
    ),
  },
  {
    id: "education",
    title: "Education",
    accent: "#EE6F11",
    body: (
      <>
        <div className="entry">
          <div className="entry-head entry-head--stack">
            <span className="entry-title">PhD, Geotechnical Engineering</span>
            <span className="entry-org">University of Alberta</span>
            <span className="entry-date">2021 – 2026</span>
          </div>
        </div>
        <div className="entry">
          <div className="entry-head entry-head--stack">
            <span className="entry-title">
              M.Sc., Petroleum Exploration Engineering
            </span>
            <span className="entry-org">University of Tehran</span>
            <span className="entry-date">2015 – 2018</span>
          </div>
        </div>
        <div className="entry">
          <div className="entry-head entry-head--stack">
            <span className="entry-title">
              B.Sc., Petroleum Engineering (Exploration)
            </span>
            <span className="entry-org">Petroleum University of Technology</span>
            <span className="entry-date">2011 – 2015</span>
          </div>
        </div>
      </>
    ),
  },
  {
    id: "leadership",
    title: "Leadership & Service",
    accent: "#EE6F11",
    body: (
      <>
        <div className="entry">
          <div className="entry-head">
            <span className="entry-title">Secretary, EDI Committee</span>
            <span className="entry-org">Canadian Geotechnical Society</span>
            <span className="entry-date">2026 – Present</span>
          </div>
          <ul className="bullets">
            <li>
              Makes sure the important conversations are actually documented
              and don't just evaporate into the ether after a good meeting.
            </li>
          </ul>
        </div>
        <div className="entry">
          <div className="entry-head">
            <span className="entry-title">Weekly Webinar Organizer</span>
            <span className="entry-org">University of Alberta</span>
            <span className="entry-date">2023 – 2025</span>
          </div>
          <ul className="bullets">
            <li>
              Kept a weekly geotechnical seminar series alive for two years —
              speakers, schedules, promotion, and 20+ attendees per session.
            </li>
          </ul>
        </div>
      </>
    ),
  },
  {
    id: "affiliations",
    title: "Professional Affiliations",
    accent: "#EE6F11",
    body: (
      <ul className="bullets">
        <li>
          <b>Engineer in Training (EIT)</b>, APEGA — 2025 to present.
        </li>
        <li>
          <b>Member</b>, Canadian Geotechnical Society — 2021 to present.
        </li>
      </ul>
    ),
  },
  {
    id: "awards",
    title: "Certificates & Awards",
    accent: "#EE6F11",
    body: (
      <ul className="bullets">
        <li>
          <b>Earle Klohn Graduate Scholarship in Geotechnical Engineering</b>,
          Klohn Crippen Berger — 2025.
        </li>
        <li>
          <b>RAP Bursary for Graduate Studies</b>, Geological Survey of Canada
          — 2019.
        </li>
        <li>
          <b>Gender-Based Analysis Plus (GBA+) Certification</b>, Government
          of Canada — 2022.
        </li>
        <li>
          <b>Unconventional Reservoir Geomechanics</b>, Stanford University
          (Online) — 2019.
        </li>
        <li>
          <b>Reservoir Geomechanics</b>, Stanford University (Online) — 2015.
        </li>
      </ul>
    ),
  },
];

export default function ResumePage() {
  const [openIds, setOpenIds] = useState(
    () => new Set(FRAGMENTS.filter((f) => f.defaultOpen).map((f) => f.id))
  );

  function toggle(id) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <div className="resume-page">
      <div className="resume-container">
        <div className="chrome">
          <a className="back" href="/">
            ← BACK
          </a>
          <a
            className="download"
            href="/athena_bahrami_cv.pdf"
            download
          >
            Download Professional PDF
          </a>
        </div>

        <div className="fragments">
          {FRAGMENTS.map((fragment) => {
            const isOpen = openIds.has(fragment.id);
            return (
              <div
                key={fragment.id}
                className="fragment"
                data-open={isOpen}
                style={{ "--accent": fragment.accent }}
              >
                <div className="fragment-top" />
                <button
                  className="fragment-header"
                  aria-expanded={isOpen}
                  onClick={() => toggle(fragment.id)}
                >
                  <span className="fragment-title">{fragment.title}</span>
                  <span className="fragment-toggle">+</span>
                </button>
                <div className="fragment-body-wrap">
                  <div className="fragment-body-inner">
                    {fragment.id === "experience" ? (
                      <div className="fragment-body fragment-body--wide">
                        <div className="experience-layout">
                          <div className="experience-text">
                            {fragment.body}
                          </div>
                          <div className="experience-visual">
                            {isOpen && <GeoscienceWorkstation />}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="fragment-body">{fragment.body}</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
