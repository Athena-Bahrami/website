"use client";

import { useEffect, useRef } from "react";

// ─── Seismic colormap: blue → cyan → green → yellow → red ───────────────────

const sc = (t, a = 1) => {
  t = Math.max(0, Math.min(1, t));
  let r, g, b;
  if (t < 0.25)      { r = 0;   g = Math.round(t * 4 * 255);           b = 255; }
  else if (t < 0.5)  { r = 0;   g = 255;                                 b = Math.round((1 - (t - 0.25) * 4) * 255); }
  else if (t < 0.75) { r = Math.round((t - 0.5) * 4 * 255);  g = 255;  b = 0; }
  else               { r = 255; g = Math.round((1 - (t - 0.75) * 4) * 255); b = 0; }
  return `rgba(${r},${g},${b},${a})`;
};

const terrain = (nx, ny, t) =>
  Math.sin(nx * 2.1 + t * 0.4) * 0.35 +
  Math.sin(ny * 1.8 + t * 0.3) * 0.30 +
  Math.sin((nx + ny) * 1.5 + t * 0.25) * 0.20 +
  Math.cos(nx * 0.9 - ny * 1.2 + t * 0.15) * 0.15;

function fitCanvas(canvas) {
  const r = canvas.getBoundingClientRect();
  const w = Math.round(r.width);
  const h = Math.round(r.height);
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function GeoscienceWorkstation() {
  const seismicRef  = useRef(null);
  const wellLogRef  = useRef(null);
  const crossRef    = useRef(null);
  const rhoRef      = useRef(null);
  const permRef     = useRef(null);

  // ── 3D Seismic Surface ───────────────────────────────────────────────────
  useEffect(() => {
    const canvas = seismicRef.current;
    if (!canvas) return;
    let t = 0, raf, G = 24;

    const draw = () => {
      fitCanvas(canvas);
      const W = canvas.width, H = canvas.height;
      if (!W || !H) { raf = requestAnimationFrame(draw); return; }
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#050810"; ctx.fillRect(0, 0, W, H);

      const tW = W / (G * 1.35), tH = tW * 0.5;
      const ox = W * 0.5, oy = H * 0.36, hs = H * 0.22;

      const h = Array.from({ length: G + 1 }, (_, r) =>
        Array.from({ length: G + 1 }, (_, c) =>
          terrain((c / G) * 4 - 2, (r / G) * 4 - 2, t)
        )
      );
      const iso = (r, c) => ({
        x: (c - r) * tW + ox,
        y: (c + r) * tH + oy - h[r][c] * hs,
      });

      // Terrain tiles (painter's algorithm: back to front)
      for (let r = 0; r < G; r++) {
        for (let c = 0; c < G; c++) {
          const [p0, p1, p2, p3] = [iso(r,c), iso(r,c+1), iso(r+1,c+1), iso(r+1,c)];
          const avg = (h[r][c] + h[r][c+1] + h[r+1][c+1] + h[r+1][c]) / 4;
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y); ctx.lineTo(p3.x, p3.y);
          ctx.closePath();
          ctx.fillStyle = sc((avg + 1) / 2);
          ctx.fill();
          ctx.strokeStyle = "rgba(0,0,0,0.22)"; ctx.lineWidth = 0.4;
          ctx.stroke();
        }
      }

      // Fault lines
      [0.27, 0.60].forEach(frac => {
        const fr = Math.round(frac * G);
        ctx.beginPath(); ctx.strokeStyle = "rgba(4,6,14,0.9)"; ctx.lineWidth = 3.5;
        for (let c = 0; c <= G; c++) {
          const p = iso(fr, c); c === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
        ctx.beginPath(); ctx.strokeStyle = "rgba(255,225,0,0.55)"; ctx.lineWidth = 1;
        for (let c = 0; c <= G; c++) {
          const p = iso(fr, c); c === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      });

      // Well markers
      [[0.35, 0.4], [0.52, 0.62], [0.65, 0.33]].forEach(([fR, fC]) => {
        const p = iso(Math.round(fR * G), Math.round(fC * G));
        ctx.beginPath(); ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,230,0,0.9)"; ctx.fill();
        ctx.strokeStyle = "rgba(255,230,0,0.6)"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x, p.y - 22); ctx.stroke();
      });



      // Colorbar
      const cbX = W * 0.965, cbY = H * 0.1, cbH = H * 0.55, cbW = 9;
      for (let i = 0; i < cbH; i++) {
        ctx.fillStyle = sc(1 - i / cbH); ctx.fillRect(cbX, cbY + i, cbW, 1);
      }
      ctx.strokeStyle = "rgba(0,200,255,0.25)"; ctx.lineWidth = 0.5;
      ctx.strokeRect(cbX, cbY, cbW, cbH);

      t += 0.007;
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  // ── Well Log ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = wellLogRef.current;
    if (!canvas) return;
    let t = 0, raf;

    const tracks = [
      { label: "GR",  unit: "API",  col: "#FF4455", min: 0,   max: 150,  fn: (d,t) => 58 + 38 * Math.sin(d * 0.28 + t) + 16 * Math.sin(d * 0.72 + t * 1.3) },
      { label: "RES", unit: "Ω·m", col: "#4A90FF", min: 1,   max: 100,  fn: (d,t) => 7  + 36 * Math.pow(Math.abs(Math.sin(d * 0.19 + t * 0.8)), 1.5) },
      { label: "POR", unit: "frac", col: "#44FF88", min: 0,   max: 0.35, fn: (d,t) => 0.11 + 0.12 * Math.sin(d * 0.38 + t * 0.6) + 0.04 * Math.cos(d * 1.1) },
    ];
    const litCols = ["#E8C840", "#27AE60", "#E8C840", "#27AE60", "#C0392B", "#E8C840"];

    const draw = () => {
      fitCanvas(canvas);
      const W = canvas.width, H = canvas.height;
      if (!W || !H) { raf = requestAnimationFrame(draw); return; }
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#060A10"; ctx.fillRect(0, 0, W, H);

      const hH = 34, DEPTH = 120, litW = 12, trackW = (W - litW) / 3;
      ctx.fillStyle = "#07091A"; ctx.fillRect(0, 0, W, hH);

      tracks.forEach((tk, ti) => {
        const tx = ti * trackW;
        ctx.strokeStyle = "rgba(0,200,255,0.12)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(tx, 0); ctx.lineTo(tx, H); ctx.stroke();

        ctx.font = "bold 8px monospace"; ctx.fillStyle = tk.col;
        ctx.fillText(tk.label, tx + 4, hH - 21);
        ctx.font = "7px monospace"; ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.fillText(tk.unit, tx + 4, hH - 12);
        ctx.fillText(`${tk.min}─${tk.max}`, tx + 4, hH - 3);

        for (let g = 1; g < 4; g++) {
          const gx = tx + (g / 4) * trackW;
          ctx.strokeStyle = "rgba(255,255,255,0.04)"; ctx.lineWidth = 0.5;
          ctx.beginPath(); ctx.moveTo(gx, hH); ctx.lineTo(gx, H); ctx.stroke();
        }

        ctx.beginPath();
        for (let d = 0; d < DEPTH; d++) {
          const val = tk.fn(d + t * 9, t);
          const norm = Math.max(0, Math.min(1, (val - tk.min) / (tk.max - tk.min)));
          const x = tx + norm * (trackW - 4) + 2, y = hH + (d / DEPTH) * (H - hH);
          d === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = tk.col; ctx.lineWidth = 1.5; ctx.stroke();
      });

      // Lithology column
      const litX = 3 * trackW;
      for (let d = 0; d < DEPTH; d++) {
        const y = hH + (d / DEPTH) * (H - hH), bH = (H - hH) / DEPTH + 1;
        const lType = Math.floor((d + Math.floor(t * 0.7)) / 12) % litCols.length;
        ctx.fillStyle = litCols[lType] + "88"; ctx.fillRect(litX, y, litW, bH);
      }
      ctx.strokeStyle = "rgba(0,200,255,0.15)"; ctx.lineWidth = 0.5;
      ctx.strokeRect(litX, hH, litW, H - hH);

      ctx.fillStyle = "rgba(255,255,255,0.28)"; ctx.font = "7px monospace";
      for (let i = 0; i <= 5; i++) {
        const y = hH + (i / 5) * (H - hH);
        ctx.fillText(`${Math.round(1800 + i * 200 + t * 10)}`, 1, y + 3);
      }

      t += 0.015;
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  // ── Porosity–Permeability Crossplot ───────────────────────────────────────
  useEffect(() => {
    const canvas = crossRef.current;
    if (!canvas) return;
    let t = 0, raf;

    const pts = Array.from({ length: 85 }, (_, i) => {
      const s = i * 2.41 + 1.37;
      const por = 0.04 + 0.25 * Math.abs(Math.sin(s * 1.1));
      const perm = Math.pow(10, -1.4 + (por - 0.04) / 0.25 * 3.5 + Math.sin(s * 3.7) * 0.55);
      return { por, perm: Math.min(500, Math.max(0.01, perm)), f: i % 3 };
    });
    const fCols = ["#FF5566", "#4A90FF", "#44FF88"];

    const draw = () => {
      fitCanvas(canvas);
      const W = canvas.width, H = canvas.height;
      if (!W || !H) { raf = requestAnimationFrame(draw); return; }
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#060A10"; ctx.fillRect(0, 0, W, H);

      const pad = { l: 34, r: 6, t: 8, b: 22 };
      const pW = W - pad.l - pad.r, pH = H - pad.t - pad.b;

      for (let g = 1; g < 5; g++) {
        ctx.strokeStyle = "rgba(255,255,255,0.045)"; ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.moveTo(pad.l + g/5*pW, pad.t); ctx.lineTo(pad.l + g/5*pW, pad.t+pH); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(pad.l, pad.t + g/5*pH); ctx.lineTo(pad.l+pW, pad.t + g/5*pH); ctx.stroke();
      }
      ctx.strokeStyle = "rgba(0,200,255,0.45)"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(pad.l, pad.t); ctx.lineTo(pad.l, pad.t+pH); ctx.lineTo(pad.l+pW, pad.t+pH); ctx.stroke();

      ctx.strokeStyle = "rgba(255,200,50,0.4)"; ctx.lineWidth = 1.2; ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(pad.l + pW*0.02, pad.t + pH*0.9); ctx.lineTo(pad.l + pW*0.97, pad.t + pH*0.06); ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "rgba(255,255,255,0.3)"; ctx.font = "7px monospace";
      ["500","100","10","1","0.1"].forEach((lab, i) => {
        ctx.fillText(lab, 2, pad.t + (i/4)*pH + 3);
      });
      ctx.textAlign = "center"; ctx.fillText("Porosity (frac)", pad.l + pW/2, H - 4); ctx.textAlign = "left";

      pts.forEach((pt, i) => {
        const pulse = 1 + 0.22 * Math.sin(t * 1.8 + i * 0.52);
        const x = pad.l + (pt.por / 0.29) * pW;
        const y = pad.t + (1 - (Math.log10(pt.perm) + 2) / 4) * pH;
        if (x < pad.l || x > pad.l + pW || y < pad.t || y > pad.t + pH) return;
        ctx.beginPath(); ctx.arc(x, y, 2.8 * pulse, 0, Math.PI * 2);
        ctx.fillStyle = fCols[pt.f] + "BB"; ctx.fill();
        ctx.strokeStyle = fCols[pt.f]; ctx.lineWidth = 0.5; ctx.stroke();
      });

      t += 0.022;
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  // ── RHOb Crossplot ────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = rhoRef.current;
    if (!canvas) return;
    let t = 0, raf;

    const pts = Array.from({ length: 75 }, (_, i) => {
      const s = i * 1.73 + 2.11;
      const rhob = 2.0 + 0.8 * Math.abs(Math.sin(s * 0.9));
      const rho  = rhob * (0.85 + 0.3 * Math.abs(Math.sin(s * 2.1)));
      return { rhob, rho: Math.min(3.5, Math.max(0.1, rho)), f: i % 3 };
    });
    const fCols = ["#FF5566", "#4A90FF", "#44FF88"];

    const draw = () => {
      fitCanvas(canvas);
      const W = canvas.width, H = canvas.height;
      if (!W || !H) { raf = requestAnimationFrame(draw); return; }
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#060A10"; ctx.fillRect(0, 0, W, H);

      const pad = { l: 30, r: 6, t: 8, b: 22 };
      const pW = W - pad.l - pad.r, pH = H - pad.t - pad.b;

      for (let g = 1; g < 5; g++) {
        ctx.strokeStyle = "rgba(255,255,255,0.045)"; ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.moveTo(pad.l + g/5*pW, pad.t); ctx.lineTo(pad.l + g/5*pW, pad.t+pH); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(pad.l, pad.t + g/5*pH); ctx.lineTo(pad.l+pW, pad.t + g/5*pH); ctx.stroke();
      }
      ctx.strokeStyle = "rgba(0,200,255,0.45)"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(pad.l, pad.t); ctx.lineTo(pad.l, pad.t+pH); ctx.lineTo(pad.l+pW, pad.t+pH); ctx.stroke();

      ctx.strokeStyle = "rgba(255,200,50,0.35)"; ctx.lineWidth = 1.1; ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(pad.l + pW*0.05, pad.t + pH*0.9); ctx.lineTo(pad.l + pW*0.95, pad.t + pH*0.08); ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "rgba(255,255,255,0.3)"; ctx.font = "7px monospace";
      ctx.textAlign = "center"; ctx.fillText("RHOb (g/cm³)", pad.l + pW/2, H - 4); ctx.textAlign = "left";
      ctx.fillText("3.5", 1, pad.t + 3); ctx.fillText("2.0", 1, pad.t + pH);

      pts.forEach((pt, i) => {
        const pulse = 1 + 0.2 * Math.sin(t * 2 + i * 0.48);
        const x = pad.l + ((pt.rhob - 1.8) / (3.2 - 1.8)) * pW;
        const y = pad.t + (1 - (pt.rho - 0.1) / (3.5 - 0.1)) * pH;
        if (x < pad.l || x > pad.l + pW || y < pad.t || y > pad.t + pH) return;
        ctx.beginPath(); ctx.arc(x, y, 2.6 * pulse, 0, Math.PI * 2);
        ctx.fillStyle = fCols[pt.f] + "BB"; ctx.fill();
        ctx.strokeStyle = fCols[pt.f]; ctx.lineWidth = 0.5; ctx.stroke();
      });

      t += 0.02;
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  // ── Permeability Log ──────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = permRef.current;
    if (!canvas) return;
    let t = 0, raf;

    const draw = () => {
      fitCanvas(canvas);
      const W = canvas.width, H = canvas.height;
      if (!W || !H) { raf = requestAnimationFrame(draw); return; }
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#060A10"; ctx.fillRect(0, 0, W, H);

      const hH = 34, N = 180;
      ctx.fillStyle = "#07091A"; ctx.fillRect(0, 0, W, hH);
      ctx.font = "bold 8px monospace"; ctx.fillStyle = "#FF8844";
      ctx.fillText("PERM  (mD)", 8, 13);
      ctx.font = "7px monospace"; ctx.fillStyle = "rgba(255,255,255,0.28)";
      ctx.fillText("0.1 ─────────────── 1000  log scale", 8, 25);

      const segW = W / N, trkH = H - hH;
      for (let i = 0; i < N; i++) {
        const dv = i + t * 18;
        const raw = 0.4 + 250 * Math.pow(Math.abs(Math.sin(dv * 0.17 + t)), 2) *
          (0.4 + 0.6 * Math.abs(Math.sin(dv * 0.07)));
        const norm = Math.log10(raw + 0.1) / Math.log10(1001);
        const bH = norm * trkH * 0.9;
        ctx.fillStyle = sc(norm, 0.9);
        ctx.fillRect(i * segW, hH + (trkH - bH), segW + 0.5, bH);
      }

      ctx.strokeStyle = "rgba(0,200,255,0.25)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, hH); ctx.lineTo(W, hH); ctx.stroke();

      ctx.fillStyle = "rgba(255,255,255,0.25)"; ctx.font = "7px monospace";
      for (let i = 0; i <= 4; i++) {
        ctx.fillText(`${Math.round(1800 + i * 220 + t * 12)}m`, i / 4 * W + 2, H - 3);
      }

      t += 0.018;
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  // ─── Styles ────────────────────────────────────────────────────────────────

  // Gradient "border" wrapper: 1px of gradient shows around the inner panel.
  // The gradient fades from a dim cyan tint → fully transparent, so on a
  // pitch-black background the edge dissolves instead of cutting hard.
  const panelWrap = {
    background: "linear-gradient(135deg, rgba(0,200,255,0.09) 0%, rgba(0,200,255,0.02) 45%, rgba(0,0,0,0) 100%)",
    padding: "1px",
    borderRadius: "5px",
    overflow: "hidden",
    display: "flex",
    minHeight: 0,
  };

  // Inner panel — no border of its own; the wrapper gradient IS the border.
  const panel = {
    background: "#090C18",
    borderRadius: "4px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minHeight: 0,
  };

  const label = {
    padding: "5px 10px",
    background: "#060810",
    // Soft gradient separator instead of a hard line
    borderBottom: "1px solid rgba(0,200,255,0.05)",
    fontSize: 8,
    letterSpacing: "0.14em",
    color: "rgba(0,200,255,0.45)",
    flexShrink: 0,
  };

  const cv = { display: "block", width: "100%", height: "100%", flex: 1, minHeight: 0 };

  // Convenience wrapper so JSX stays readable
  const Panel = ({ labelText, children }) => (
    <div style={panelWrap}>
      <div style={panel}>
        <div style={label}>{labelText}</div>
        {children}
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes livepulse { 0%,100%{opacity:1} 50%{opacity:.3} }
      `}</style>

      <div style={{ background: "#000000", minHeight: "100vh", fontFamily: "'Courier New', monospace", color: "#00C8FF", overflow: "hidden", display: "flex", flexDirection: "column", maskImage: "linear-gradient(to bottom, transparent 0%, black 3%, black 97%, transparent 100%), linear-gradient(to right, transparent 0%, black 1.5%, black 98.5%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 3%, black 97%, transparent 100%), linear-gradient(to right, transparent 0%, black 1.5%, black 98.5%, transparent 100%)", maskComposite: "intersect", WebkitMaskComposite: "source-in" }}>

        {/* Header — gradient bottom edge so it melts into black */}
        <header style={{
          background: "linear-gradient(to bottom, #080B18 60%, #000000 100%)",
          padding: "0 20px",
          height: 40,
          display: "flex",
          alignItems: "center",
          gap: 20,
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 10, letterSpacing: "0.22em", color: "rgba(0,200,255,0.55)" }}>Subsurface Modeling Practice</span>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#44FF88", boxShadow: "0 0 5px #44FF88", animation: "livepulse 1.8s infinite" }} />
            <span style={{ fontSize: 9, color: "#44FF88", letterSpacing: "0.1em" }}>STREAMING</span>
          </div>
        </header>

        {/* Main grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 12, padding: 12, flex: 1, minHeight: 0 }}>

          {/* LEFT: 3D Seismic */}
          <Panel labelText="3D SEISMIC HORIZON · PETREL VIEW">
            <canvas ref={seismicRef} style={cv} />
          </Panel>

          {/* RIGHT: Analysis panels */}
          <div style={{ display: "grid", gridTemplateRows: "1.5fr 1fr", gap: 12 }}>

            {/* Top row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Panel labelText="WELL LOG · SUITE 5.3">
                <canvas ref={wellLogRef} style={cv} />
              </Panel>
              <Panel labelText="POR – PERM · CROSSPLOT">
                <canvas ref={crossRef} style={cv} />
              </Panel>
            </div>

            {/* Bottom row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Panel labelText="RHOB – RHO · CROSSPLOT">
                <canvas ref={rhoRef} style={cv} />
              </Panel>
              <Panel labelText="PERMEABILITY LOG · SUITE 5.6">
                <canvas ref={permRef} style={cv} />
              </Panel>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
