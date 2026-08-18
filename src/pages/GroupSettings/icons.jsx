import { colors } from '../../styles/colors';

export function TrashIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3.5 5.5H16.5"
        stroke={colors.body}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M7.5 5.5V4a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v1.5"
        stroke={colors.body}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.5 5.5L6.2 16a1 1 0 0 0 1 .9h5.6a1 1 0 0 0 1-.9l.7-10.5"
        stroke={colors.body}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.3 8.5V14"
        stroke={colors.body}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M11.7 8.5V14"
        stroke={colors.body}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function EditIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M11.5 2.5L15.5 6.5L6 16H2V12L11.5 2.5Z"
        stroke={colors.accent}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function XIcon() {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
      <path
        d="M1 1L7 7M7 1L1 7"
        stroke={colors.body}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}
