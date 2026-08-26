"use client";

/**
 * Live local time in a given IANA timezone — defaults to the site's own
 * real location (Lahore — Asia/Karachi), not the visitor's own timezone.
 * Renders nothing until mount so the server-rendered HTML never disagrees
 * with the client's first tick, per REBUILD-SPEC.md's Hero layout note
 * (applies equally here in Footer). Shared by Footer, Hero, and Clients
 * Worldwide (each client's real local time, per REBUILD-SPEC.md 4a)
 * rather than duplicated — a new Intl.DateTimeFormat per timezone is
 * cheap enough to build per-instance rather than pooling formatters.
 */

import { useEffect, useState } from "react";

const DEFAULT_TIME_ZONE = "Asia/Karachi";

interface LiveClockProps {
  className?: string;
  /** IANA timezone name — defaults to the site's own (Asia/Karachi). */
  timeZone?: string;
}

export function LiveClock({ className, timeZone = DEFAULT_TIME_ZONE }: LiveClockProps) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    setTime(formatter.format(new Date()));
    const interval = setInterval(() => {
      setTime(formatter.format(new Date()));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeZone]);

  if (time === null) return null;

  return <span className={className}>{time}</span>;
}
