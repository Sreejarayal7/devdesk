export default function Logo({ size = 40 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="brainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
      </defs>
      {/* Background circle */}
      <circle cx="50" cy="50" r="48" fill="url(#brainGrad)" opacity="0.15" />
      <circle
        cx="50"
        cy="50"
        r="48"
        stroke="url(#brainGrad)"
        strokeWidth="3"
        fill="none"
      />
      {/* Brain shape */}
      <path
        d="M50 25 C38 25 28 33 28 43 C28 48 30 52 34 55 C30 57 27 61 27 66 C27 73 33 78 41 78 C43 78 45 77.5 47 77 L47 30 C48 27 49 25 50 25Z"
        fill="url(#brainGrad)"
        opacity="0.9"
      />
      <path
        d="M50 25 C62 25 72 33 72 43 C72 48 70 52 66 55 C70 57 73 61 73 66 C73 73 67 78 59 78 C57 78 55 77.5 53 77 L53 30 C52 27 51 25 50 25Z"
        fill="url(#brainGrad)"
        opacity="0.7"
      />
      {/* Center line */}
      <line
        x1="50"
        y1="26"
        x2="50"
        y2="77"
        stroke="white"
        strokeWidth="2"
        opacity="0.6"
      />
      {/* Brain folds left */}
      <path
        d="M35 40 Q30 43 33 48"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M33 55 Q28 58 31 63"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M38 68 Q35 72 39 75"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.7"
      />
      {/* Brain folds right */}
      <path
        d="M65 40 Q70 43 67 48"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M67 55 Q72 58 69 63"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M62 68 Q65 72 61 75"
        stroke="white"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}
