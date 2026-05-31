import { FiStar } from "react-icons/fi";

export function RatingStars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i + 1 <= Math.round(value);
        return (
          <FiStar
            key={i}
            size={size}
            className={
              filled ? "fill-[var(--gold)] text-[var(--gold)]" : "text-muted-foreground/40"
            }
          />
        );
      })}
    </div>
  );
}
