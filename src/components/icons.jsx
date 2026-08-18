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
        d="M4.5 2V8M6.5 2V8M8.5 2V8"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M4.5 8H8.5"
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M7.15 8L7.15 16.3C7.15 17.1 6.9 17.6 6.5 17.6C6.1 17.6 5.85 17.1 5.85 16.3L5.85 8Z"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.5 2C14 2.4 14.8 5.5 14.5 8.2C14.35 9.6 13.3 10.4 12.8 10.4L12.8 16.3C12.8 17.1 12.55 17.6 12.15 17.6C11.75 17.6 11.5 17.1 11.5 16.3Z"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HomeIcon({ size = 20, color = colors.body }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 9.5L10 3.3L17 9.5"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 8.5V16.7H15V8.5"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.3 16.7V12h3.4v4.7"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ActivityIcon({ size = 20, color = colors.body }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="10" cy="4" r="1.6" fill={color} />
      <path
        d="M10 5.6L8 11.5M8 11.5L3 16M8 11.5L12 17M10 7L16 5M9 8L4 9"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BagIcon({ size = 20, color = colors.body }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4.5 7.3H15.5L16.3 17H3.7L4.5 7.3Z"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.7 7.3V6a3.3 3.3 0 0 1 6.6 0V7.3"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.7 10.2H14.3"
        stroke={color}
        strokeWidth="0.9"
        strokeLinecap="round"
      />
      <path
        d="M7.2 10.6V17M12.8 10.6V17"
        stroke={color}
        strokeWidth="0.9"
        strokeLinecap="round"
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
        d="M5 8.5L6.8 4.3H13.2L15 8.5Z"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="2"
        y="8.5"
        width="16"
        height="4.5"
        rx="1.4"
        stroke={color}
        strokeWidth="1.4"
      />
      <path
        d="M6 9.9H14"
        stroke={color}
        strokeWidth="1"
        strokeLinecap="round"
      />
      <circle cx="5.3" cy="14" r="1.8" fill={color} />
      <circle cx="14.7" cy="14" r="1.8" fill={color} />
    </svg>
  );
}

export function EtcIcon({ size = 20, color = colors.body }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M10 3.2V16.8M4.1 6.6L15.9 13.4M15.9 6.6L4.1 13.4"
        stroke={color}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PencilIcon({ size = 18, color = colors.label }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M11.6 2.9L15.1 6.4L6.2 15.3L2.4 15.6L2.7 11.8L11.6 2.9Z"
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 4.5L13.5 8"
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TrashIcon({ size = 18, color = colors.label }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3.3 5.2H14.7"
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M7 5.2V3.4H11V5.2"
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.6 5.2L5.2 15.1H12.8L13.4 5.2"
        stroke={color}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.4 7.8V12.6M10.6 7.8V12.6"
        stroke={color}
        strokeWidth="1.1"
        strokeLinecap="round"
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
