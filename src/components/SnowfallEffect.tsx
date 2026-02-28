import { useMemo } from 'react';

interface Snowflake {
  id: number;
  left: string;
  animationDuration: string;
  animationDelay: string;
  size: string;
  opacity: string;
}

export function SnowfallEffect() {
  const snowflakes = useMemo<Snowflake[]>(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${8 + Math.random() * 10}s`,
      animationDelay: `${Math.random() * 10}s`,
      size: `${4 + Math.random() * 8}px`,
      opacity: `${0.3 + Math.random() * 0.7}`,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute text-white animate-snowfall"
          style={{
            left: flake.left,
            animationDuration: flake.animationDuration,
            animationDelay: flake.animationDelay,
            fontSize: flake.size,
            opacity: flake.opacity,
          }}
        >
          ❄
        </div>
      ))}
    </div>
  );
}
