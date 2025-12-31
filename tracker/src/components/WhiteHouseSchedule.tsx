"use client";

import { useState, useEffect } from "react";

interface ScheduleEvent {
  id: string;
  time: string;
  title: string;
  location?: string;
  type: "briefing" | "meeting" | "travel" | "event" | "call";
}

// Sample schedule data - in production this would come from an API
const sampleSchedule: ScheduleEvent[] = [
  {
    id: "1",
    time: "9:00 AM",
    title: "Daily Intelligence Briefing",
    location: "Oval Office",
    type: "briefing",
  },
  {
    id: "2",
    time: "10:30 AM",
    title: "Cabinet Meeting",
    location: "Cabinet Room",
    type: "meeting",
  },
  {
    id: "3",
    time: "12:00 PM",
    title: "Press Briefing",
    location: "James S. Brady Press Briefing Room",
    type: "briefing",
  },
  {
    id: "4",
    time: "2:00 PM",
    title: "Bilateral Meeting",
    location: "Oval Office",
    type: "meeting",
  },
];

const typeStyles: Record<ScheduleEvent["type"], string> = {
  briefing: "bg-ink text-paper",
  meeting: "border border-ink text-ink",
  travel: "bg-faint text-paper",
  event: "border border-faint text-muted",
  call: "border border-faint text-faint",
};

const typeLabels: Record<ScheduleEvent["type"], string> = {
  briefing: "Briefing",
  meeting: "Meeting",
  travel: "Travel",
  event: "Event",
  call: "Call",
};

function formatToday(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function WhiteHouseSchedule() {
  const [schedule] = useState<ScheduleEvent[]>(sampleSchedule);
  const [today, setToday] = useState("");

  useEffect(() => {
    setToday(formatToday());
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="label">Daily Schedule</p>
        <a
          href="https://www.whitehouse.gov/live/"
          target="_blank"
          rel="noreferrer"
          className="text-[0.65rem] text-faint underline hover:text-ink"
        >
          whitehouse.gov
        </a>
      </div>

      <p className="text-xs text-muted">{today}</p>

      <div className="space-y-2">
        {schedule.map((event) => (
          <div
            key={event.id}
            className="flex gap-3 rounded border border-faint p-3 transition-colors hover:border-ink"
          >
            <div className="w-16 shrink-0">
              <p className="text-xs font-mono text-faint">{event.time}</p>
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className={`rounded px-1.5 py-0.5 text-[0.55rem] font-mono ${
                    typeStyles[event.type]
                  }`}
                >
                  {typeLabels[event.type]}
                </span>
              </div>
              <p className="text-sm font-medium leading-snug">{event.title}</p>
              {event.location && (
                <p className="text-xs text-faint">{event.location}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 pt-2">
        <a
          href="https://www.whitehouse.gov/briefing-room/"
          target="_blank"
          rel="noreferrer"
          className="flex-1 rounded border border-faint px-3 py-2 text-center text-xs text-muted transition-colors hover:border-ink hover:text-ink"
        >
          Briefing Room
        </a>
        <a
          href="https://www.whitehouse.gov/live/"
          target="_blank"
          rel="noreferrer"
          className="flex-1 rounded border border-ink bg-ink px-3 py-2 text-center text-xs text-paper transition-colors hover:bg-transparent hover:text-ink"
        >
          Watch Live
        </a>
      </div>
    </div>
  );
}
