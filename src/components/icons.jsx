import { colors } from '../styles/colors';

export function FoodIcon({ size = 20, color = colors.body }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 2.5V9a1.5 1.5 0 0 1-3 0V2.5"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.5 2.5V17.5"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M13.5 2.5c-1.4 1.1-2.2 3-2.2 5s.8 3.9 2.2 5v5"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CarIcon({ size = 20, color = colors.body }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3.5 12V9.5a1.5 1.5 0 0 1 1-1.42l1-2.7a1.5 1.5 0 0 1 1.4-1H13a1.5 1.5 0 0 1 1.4 1l1 2.7a1.5 1.5 0 0 1 1 1.42V12"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.5 12h15v3a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-1h-9v1a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-3Z"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 9.5h9"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SparkleIcon({ size = 20, color = colors.body }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M10 2.5c.4 2.6 1.2 4 3.9 4.4-2.7.4-3.5 1.8-3.9 4.4-.4-2.6-1.2-4-3.9-4.4 2.7-.4 3.5-1.8 3.9-4.4Z"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.2 11c.24 1.5.7 2.3 2.3 2.5-1.6.24-2.06 1-2.3 2.5-.24-1.5-.7-2.26-2.3-2.5 1.6-.2 2.06-1 2.3-2.5Z"
        stroke={color}
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronRightIcon({ size = 16, color = colors.label }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 3.5L10.5 8L6 12.5"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
