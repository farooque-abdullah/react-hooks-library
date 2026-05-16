// ═══════════════════════════════════════════
// use-hooks — A library of production-ready React custom hooks
// ═══════════════════════════════════════════

import { useState, useEffect, useRef, useCallback, useReducer } from "react";

// ── useLocalStorage ───────────────────────────
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try { const item = localStorage.getItem(key); return item ? JSON.parse(item) : initialValue; }
    catch { return initialValue; }
  });
  const set = (val) => {
    const toStore = val instanceof Function ? val(value) : val;
    setValue(toStore);
    localStorage.setItem(key, JSON.stringify(toStore));
  };
  return [value, set];
}

// ── useDebounce ───────────────────────────────
export function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ── useFetch ──────────────────────────────────
export function useFetch(url, options = {}) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  useEffect(() => {
    if (!url) return;
    let cancelled = false;
    setState({ data: null, loading: true, error: null });
    fetch(url, options)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(data => { if (!cancelled) setState({ data, loading: false, error: null }); })
      .catch(error => { if (!cancelled) setState({ data: null, loading: false, error }); });
    return () => { cancelled = true; };
  }, [url]);
  return state;
}

// ── useToggle ─────────────────────────────────
export function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  const toggle = useCallback(() => setValue(v => !v), []);
  return [value, toggle];
}

// ── useClickOutside ───────────────────────────
export function useClickOutside(callback) {
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) callback(); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [callback]);
  return ref;
}

// ── useWindowSize ─────────────────────────────
export function useWindowSize() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  useEffect(() => {
    const handler = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return size;
}

// ── usePrevious ───────────────────────────────
export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => { ref.current = value; });
  return ref.current;
}

// ── useCounter ────────────────────────────────
export function useCounter(initial = 0, { min, max, step = 1 } = {}) {
  const [count, setCount] = useState(initial);
  const increment = () => setCount(c => (max !== undefined ? Math.min(max, c + step) : c + step));
  const decrement = () => setCount(c => (min !== undefined ? Math.max(min, c - step) : c - step));
  const reset = () => setCount(initial);
  const set = (val) => setCount(typeof val === "function" ? val : Math.min(max ?? Infinity, Math.max(min ?? -Infinity, val)));
  return { count, increment, decrement, reset, set };
}

// ── useMediaQuery ─────────────────────────────
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [query]);
  return matches;
}

// ── useCopyToClipboard ────────────────────────
export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch { return false; }
  }, []);
  return [copied, copy];
}

// ── useAsync ──────────────────────────────────
export function useAsync(asyncFn, immediate = true) {
  const [state, setState] = useState({ data: null, loading: immediate, error: null });
  const execute = useCallback(async (...args) => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const data = await asyncFn(...args);
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      setState({ data: null, loading: false, error });
      throw error;
    }
  }, [asyncFn]);
  useEffect(() => { if (immediate) execute(); }, []);
  return { ...state, execute };
}

export default {
  useLocalStorage, useDebounce, useFetch, useToggle,
  useClickOutside, useWindowSize, usePrevious,
  useCounter, useMediaQuery, useCopyToClipboard, useAsync,
};
