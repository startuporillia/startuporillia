import {
  LEVEL_LABEL,
  STATUS_LABEL,
  TRACK_LABEL,
  TRACK_SHORT_LABEL,
  formatLevelShort,
  levelRange,
  type Workshop,
  type WorkshopLevel,
  type WorkshopStatus,
  type WorkshopTrack,
} from "@/lib/workshops";

const trackClass: Record<WorkshopTrack, string> = {
  ai: "bg-brand-orange/10 text-brand-orange",
  founder: "bg-brand-teal/10 text-brand-teal",
  build: "bg-primary/10 text-primary",
  ops: "bg-purple-500/10 text-purple-700",
};

const statusClass: Record<WorkshopStatus, string> = {
  interest: "bg-secondary text-muted-foreground border-border",
  scheduled: "bg-brand-orange/10 text-brand-orange border-brand-orange/20",
  "sold-out": "bg-primary/10 text-primary border-primary/20",
  past: "bg-muted text-muted-foreground border-border",
};

export const TrackChip = ({
  track,
  short = false,
}: {
  track: WorkshopTrack;
  short?: boolean;
}) => (
  <span
    className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${trackClass[track]}`}
  >
    {short ? TRACK_SHORT_LABEL[track] : TRACK_LABEL[track]}
  </span>
);

export const LevelChip = ({ level }: { level: Workshop["level"] }) => {
  const [lo] = levelRange(level);
  const word = LEVEL_LABEL[lo];
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-card border border-border/60 text-primary">
      <span className="font-semibold">{formatLevelShort(level)}</span>
      <span className="text-muted-foreground">·</span>
      <span>{word}</span>
    </span>
  );
};

export const LevelDots = ({
  level,
  className = "",
}: {
  level: Workshop["level"];
  className?: string;
}) => {
  const [, hi] = levelRange(level);
  return (
    <span
      className={`inline-flex items-center gap-1 ${className}`}
      aria-label={`Level ${hi} of 5`}
    >
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`block w-2 h-2 rounded-full ${
            i <= hi ? "bg-brand-orange" : "bg-border"
          }`}
        />
      ))}
    </span>
  );
};

export const StatusBadge = ({ status }: { status: WorkshopStatus }) => (
  <span
    className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full border ${statusClass[status]}`}
  >
    {STATUS_LABEL[status]}
  </span>
);

/** Format minutes as "1h 30m" / "90m" / "2h". */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
};

/** Format a workshop's ticket price for display. */
export const formatPrice = (workshop: Workshop): string => `$${workshop.price.regular}`;

export type { WorkshopLevel };
