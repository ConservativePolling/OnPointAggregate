"use client";

import { useState, useEffect } from "react";

type LocationKey = "dc" | "maralago" | "bedminster" | "newyork";

interface Location {
  id: LocationKey;
  name: string;
  shortName: string;
  description: string;
  // Approximate lat/lng converted to percentage positions on US map
  // US bounds roughly: lat 24-49, lng -125 to -66
  lat: number;
  lng: number;
}

const locations: Location[] = [
  {
    id: "dc",
    name: "Washington, D.C.",
    shortName: "White House",
    description: "The White House",
    lat: 38.8977,
    lng: -77.0365,
  },
  {
    id: "maralago",
    name: "Palm Beach, FL",
    shortName: "Mar-a-Lago",
    description: "Winter White House",
    lat: 26.6777,
    lng: -80.0370,
  },
  {
    id: "bedminster",
    name: "Bedminster, NJ",
    shortName: "Bedminster",
    description: "Trump National Golf Club",
    lat: 40.6765,
    lng: -74.6457,
  },
  {
    id: "newyork",
    name: "New York, NY",
    shortName: "Trump Tower",
    description: "Trump Tower",
    lat: 40.7624,
    lng: -73.9738,
  },
];

// Convert lat/lng to SVG coordinates
// US bounds: lat 24.5-49.5 (25 degrees), lng -124.8 to -66.9 (58 degrees)
function geoToSvg(lat: number, lng: number): { x: number; y: number } {
  const minLat = 24.5;
  const maxLat = 49.5;
  const minLng = -124.8;
  const maxLng = -66.9;

  const x = ((lng - minLng) / (maxLng - minLng)) * 960;
  const y = ((maxLat - lat) / (maxLat - minLat)) * 600;

  return { x, y };
}

interface PresidentLocationMapProps {
  currentLocation?: LocationKey;
}

export default function PresidentLocationMap({
  currentLocation = "dc",
}: PresidentLocationMapProps) {
  const [hoveredLocation, setHoveredLocation] = useState<LocationKey | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const current = locations.find((l) => l.id === currentLocation) ?? locations[0];
  const displayLocation = hoveredLocation
    ? locations.find((l) => l.id === hoveredLocation)
    : current;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="label">Current Location</p>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-ink animate-pulse" />
          <span className="text-xs text-faint">Live</span>
        </div>
      </div>

      <div className="relative aspect-[16/10] w-full overflow-hidden rounded border border-faint bg-[#fafafa]">
        <svg
          viewBox="0 0 960 600"
          className="h-full w-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Simplified US mainland path - accurate outline */}
          <path
            d="M158,453L157,450L162,445L164,440L166,437L171,439L180,433L189,432L194,430L204,432L208,426L215,421L221,416L226,413L229,407L232,404L238,401L245,401L253,397L258,390L261,383L264,377L267,370L268,363L271,360L278,356L284,352L288,345L290,338L286,333L283,329L280,324L280,317L285,311L291,306L297,303L303,296L308,289L315,287L321,283L329,280L336,273L345,268L355,262L362,256L370,252L379,247L388,241L397,237L410,232L421,225L432,220L447,213L459,208L471,201L485,194L500,189L513,182L527,176L542,169L556,163L571,159L586,153L601,148L614,143L629,138L644,134L658,130L674,126L688,123L700,120L713,118L726,115L739,113L750,110L762,109L775,106L790,105L803,103L815,102L828,101L838,101L850,102L862,103L871,105L880,108L888,113L895,118L901,126L906,134L909,143L912,152L913,164L915,175L914,186L912,196L909,208L904,219L898,229L891,238L882,248L875,258L866,266L855,274L847,283L837,289L826,296L816,305L806,313L795,320L785,328L772,336L761,343L749,351L738,357L725,363L714,370L702,377L688,383L676,388L663,395L648,400L636,407L621,412L607,417L593,423L580,429L565,433L550,438L536,443L520,449L505,454L489,458L474,461L457,465L440,470L424,473L406,475L390,478L372,481L355,483L336,483L319,484L300,484L283,483L263,482L244,479L227,476L210,472L193,467L177,462L163,456L158,453Z"
            fill="#e8e8e8"
            stroke="#d1d1d1"
            strokeWidth="1.5"
          />

          {/* Florida */}
          <path
            d="M765,454L775,461L782,470L788,481L792,494L794,508L793,522L789,535L782,545L773,553L762,559L751,562L740,561L732,556L727,548L725,538L726,526L729,514L733,502L738,490L744,479L751,468L758,460L765,454Z"
            fill="#e8e8e8"
            stroke="#d1d1d1"
            strokeWidth="1.5"
          />

          {/* State borders - subtle grid */}
          <g stroke="#e0e0e0" strokeWidth="0.5" fill="none" opacity="0.6">
            {/* Vertical lines approximating state borders */}
            <line x1="300" y1="100" x2="300" y2="480" />
            <line x1="400" y1="100" x2="400" y2="475" />
            <line x1="500" y1="100" x2="500" y2="460" />
            <line x1="600" y1="100" x2="620" y2="440" />
            <line x1="700" y1="100" x2="700" y2="400" />
            <line x1="800" y1="100" x2="780" y2="350" />
            {/* Horizontal lines */}
            <line x1="160" y1="200" x2="910" y2="180" />
            <line x1="160" y1="300" x2="900" y2="280" />
            <line x1="200" y1="400" x2="850" y2="380" />
          </g>

          {/* Location markers */}
          {locations.map((loc) => {
            const { x, y } = geoToSvg(loc.lat, loc.lng);
            const isActive = currentLocation === loc.id;
            const isHovered = hoveredLocation === loc.id;

            return (
              <g
                key={loc.id}
                onMouseEnter={() => setHoveredLocation(loc.id)}
                onMouseLeave={() => setHoveredLocation(null)}
                className="cursor-pointer"
                style={{ transform: `translate(${x}px, ${y}px)` }}
              >
                {/* Pulse ring for active location */}
                {isActive && mounted && (
                  <>
                    <circle
                      cx="0"
                      cy="0"
                      r="20"
                      fill="none"
                      stroke="#171717"
                      strokeWidth="1"
                      opacity="0.2"
                      className="animate-ping"
                    />
                    <circle
                      cx="0"
                      cy="0"
                      r="14"
                      fill="none"
                      stroke="#171717"
                      strokeWidth="1.5"
                      opacity="0.3"
                    />
                  </>
                )}

                {/* Pin shadow */}
                <ellipse
                  cx="0"
                  cy="4"
                  rx={isActive ? "6" : "4"}
                  ry={isActive ? "3" : "2"}
                  fill="#000"
                  opacity="0.15"
                />

                {/* Pin marker */}
                <circle
                  cx="0"
                  cy="0"
                  r={isActive ? "8" : isHovered ? "7" : "5"}
                  fill={isActive ? "#171717" : isHovered ? "#404040" : "#737373"}
                  stroke="#fff"
                  strokeWidth={isActive ? "2.5" : "2"}
                  className="transition-all duration-200"
                />

                {/* Inner dot for active */}
                {isActive && (
                  <circle
                    cx="0"
                    cy="0"
                    r="3"
                    fill="#fff"
                  />
                )}

                {/* Label for active or hovered */}
                {(isActive || isHovered) && (
                  <g>
                    <rect
                      x="-40"
                      y="-32"
                      width="80"
                      height="18"
                      rx="3"
                      fill="#171717"
                    />
                    <text
                      x="0"
                      y="-19"
                      textAnchor="middle"
                      fill="#fff"
                      fontSize="10"
                      fontFamily="system-ui, sans-serif"
                      fontWeight="500"
                    >
                      {loc.shortName}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Current location details */}
      <div className="flex items-center justify-between rounded border border-faint bg-ghost px-3 py-2">
        <div>
          <p className="text-sm font-medium">{displayLocation?.name}</p>
          <p className="text-xs text-faint">{displayLocation?.description}</p>
        </div>
        {displayLocation?.id === currentLocation && (
          <span className="rounded bg-ink px-2 py-0.5 text-[0.6rem] font-mono text-paper">
            NOW
          </span>
        )}
      </div>

      {/* Location buttons */}
      <div className="grid grid-cols-2 gap-1.5">
        {locations.map((loc) => {
          const isActive = currentLocation === loc.id;
          return (
            <button
              key={loc.id}
              onMouseEnter={() => setHoveredLocation(loc.id)}
              onMouseLeave={() => setHoveredLocation(null)}
              className={`flex items-center gap-2 rounded px-2.5 py-2 text-left text-xs transition-all ${
                isActive
                  ? "bg-ink text-paper"
                  : "border border-faint text-muted hover:border-ink hover:text-ink"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full shrink-0 ${
                  isActive ? "bg-paper" : "bg-faint"
                }`}
              />
              <span className="truncate">{loc.shortName}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
