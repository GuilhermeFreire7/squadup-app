import { useEffect, useState } from "react";

/** Depois de quanto tempo de espera vale avisar que o servidor pode estar "acordando". */
export const SLOW_REQUEST_HINT_MS = 8_000;

/**
 * `true` quando `active` (ex.: um login em andamento) passa de `delayMs` sem terminar. Volta a
 * `false` assim que `active` vira `false`.
 */
export function useSlowRequestHint(active: boolean, delayMs = SLOW_REQUEST_HINT_MS): boolean {
  const [elapsed, setElapsed] = useState(false);

  useEffect(() => {
    if (!active) return undefined;
    const timer = setTimeout(() => setElapsed(true), delayMs);
    return () => {
      clearTimeout(timer);
      setElapsed(false);
    };
  }, [active, delayMs]);

  return active && elapsed;
}
