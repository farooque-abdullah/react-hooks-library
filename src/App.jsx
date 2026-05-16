import { useState } from "react";
import {
  useLocalStorage, useDebounce, useToggle,
  useWindowSize, useCounter, useCopyToClipboard,
} from "./hooks";

const HOOKS = [
  { name: "useDebounce", tag: "Performance", desc: "Delays updating a value until user stops typing. Perfect for search inputs." },
  { name: "useLocalStorage", tag: "State", desc: "Persists state to localStorage. Data survives page refreshes." },
  { name: "useToggle", tag: "State", desc: "Boolean toggle with a stable callback. Ideal for modals, dropdowns." },
  { name: "useCounter", tag: "State", desc: "Numeric counter with increment, decrement, reset, min/max constraints." },
  { name: "useWindowSize", tag: "Browser", desc: "Reactively tracks viewport dimensions on resize." },
  { name: "useCopyToClipboard", tag: "Browser", desc: "Copy any text to clipboard with feedback state." },
  { name: "useFetch", tag: "Data", desc: "Fetch data with loading, error, and auto-cancel on unmount." },
  { name: "useClickOutside", tag: "Events", desc: "Detect clicks outside a ref. Perfect for dismissing dropdowns." },
  { name: "useMediaQuery", tag: "Responsive", desc: "Returns true/false based on a CSS media query string." },
  { name: "usePrevious", tag: "State", desc: "Returns the previous value of any state or prop." },
  { name: "useAsync", tag: "Data", desc: "Wraps any async function with loading/error/data state." },
];

const TAG_COLORS = {
  Performance: "#f59e0b", State: "#6366f1", Browser: "#3b82f6",
  Data: "#10b981", Events: "#ec4899", Responsive: "#8b5cf6",
};

function HookCard({ hook }) {
  return (
    <div style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: 12, padding: 18,
      transition: "box-shadow 0.15s",
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 20px rgba(99,102,241,0.15)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <code style={{ fontSize: 14, fontWeight: 700, color: "#6366f1", fontFamily: "monospace" }}>{hook.name}</code>
        <span style={{ fontSize: 11, background: `${TAG_COLORS[hook.tag]}22`, color: TAG_COLORS[hook.tag], padding: "2px 10px", borderRadius: 20, fontWeight: 600 }}>{hook.tag}</span>
      </div>
      <p style={{ fontSize: 13, color: "var(--muted)", margin: 0, lineHeight: 1.5 }}>{hook.desc}</p>
    </div>
  );
}

export default function App() {
  const [dark, setDark] = useLocalStorage("hooks-dark", true);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [sidebarOpen, toggleSidebar] = useToggle(false);
  const { count, increment, decrement, reset } = useCounter(0, { min: 0, max: 100 });
  const { width, height } = useWindowSize();
  const [copied, copy] = useCopyToClipboard();

  const filtered = HOOKS.filter(h =>
    h.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    h.tag.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const vars = dark
    ? { "--bg": "#0d0d1a", "--surface": "#12121f", "--surface2": "#1a1a2e", "--border": "rgba(255,255,255,0.08)", "--text": "#e5e7eb", "--muted": "#6b7280" }
    : { "--bg": "#f8fafc", "--surface": "#ffffff", "--surface2": "#f1f5f9", "--border": "rgba(0,0,0,0.08)", "--text": "#111827", "--muted": "#6b7280" };

  const installCmd = "npm install use-hooks-lib";

  return (
    <div style={{ ...vars, minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>⚓ use-hooks</h1>
          <p style={{ margin: 0, fontSize: 13, color: "var(--muted)" }}>11 production-ready React custom hooks</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => copy(installCmd)} style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 14px", color: "var(--text)", cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}>
            {copied ? "✓ Copied!" : `📋 ${installCmd}`}
          </button>
          <button onClick={() => setDark(!dark)} style={{ background: "transparent", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 12px", cursor: "pointer", color: "var(--text)", fontSize: 13 }}>
            {dark ? "☀️" : "🌙"}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 20px" }}>
        {/* Live demos */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14, marginBottom: 36 }}>
          {/* useCounter */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 20 }}>
            <code style={{ color: "#6366f1", fontSize: 13 }}>useCounter</code>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginTop: 14 }}>
              <button onClick={decrement} style={{ width: 36, height: 36, background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 8, cursor: "pointer", color: "var(--text)", fontSize: 18, fontFamily: "inherit" }}>−</button>
              <span style={{ fontSize: 32, fontWeight: 800, color: "#6366f1", minWidth: 60, textAlign: "center" }}>{count}</span>
              <button onClick={increment} style={{ width: 36, height: 36, background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 8, cursor: "pointer", color: "var(--text)", fontSize: 18, fontFamily: "inherit" }}>+</button>
            </div>
            <button onClick={reset} style={{ width: "100%", marginTop: 12, background: "transparent", border: "1px solid var(--border)", borderRadius: 8, padding: "6px", color: "var(--muted)", cursor: "pointer", fontFamily: "inherit", fontSize: 12 }}>Reset</button>
          </div>

          {/* useWindowSize */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 20 }}>
            <code style={{ color: "#6366f1", fontSize: 13 }}>useWindowSize</code>
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ background: "var(--surface2)", borderRadius: 8, padding: "10px 14px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--muted)", fontSize: 13 }}>Width</span>
                <span style={{ fontWeight: 700, color: "#6366f1" }}>{width}px</span>
              </div>
              <div style={{ background: "var(--surface2)", borderRadius: 8, padding: "10px 14px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "var(--muted)", fontSize: 13 }}>Height</span>
                <span style={{ fontWeight: 700, color: "#6366f1" }}>{height}px</span>
              </div>
            </div>
          </div>

          {/* useDebounce */}
          <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 14, padding: 20 }}>
            <code style={{ color: "#6366f1", fontSize: 13 }}>useDebounce (300ms)</code>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Type to search hooks..." style={{ width: "100%", marginTop: 12, background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 8, padding: "9px 12px", color: "var(--text)", fontFamily: "inherit", fontSize: 13, outline: "none" }} />
            <div style={{ marginTop: 8, fontSize: 12, color: "var(--muted)" }}>Debounced: <span style={{ color: "#6366f1" }}>"{debouncedSearch}"</span></div>
          </div>
        </div>

        {/* Hook cards */}
        <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: "var(--text)" }}>All Hooks ({filtered.length})</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
          {filtered.map(h => <HookCard key={h.name} hook={h} />)}
        </div>
      </div>
    </div>
  );
}
