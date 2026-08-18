import { colors } from '../../styles/colors';

export function FilledCircle() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="7.3" fill="#454B60" />
      <path
        d="M4.8 8.2L6.8 10.2L11.2 5.6"
        stroke={colors.white}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HollowCircle() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="8"
        cy="8"
        r="7.3"
        stroke="rgba(69, 75, 96, 0.4)"
        strokeWidth="1.3"
      />
    </svg>
  );
}
