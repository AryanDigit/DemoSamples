export function Logo({ className = "h-11 w-11" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
      role="img"
    >
      <circle cx="32" cy="32" r="31" fill="#002147" />
      <circle cx="32" cy="32" r="27.5" fill="none" stroke="#e8b931" strokeWidth="2.2" />
      <path
        d="M18 40.5c6.5-1.2 9.8-7.4 14-14.8 2.4 5.6 5.6 10.2 10.8 13.4"
        fill="none"
        stroke="#e8b931"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <rect x="18" y="41.5" width="5.2" height="8" rx="1" fill="#f5c84a" />
      <rect x="25.2" y="37.5" width="5.2" height="12" rx="1" fill="#e8b931" />
      <rect x="32.4" y="33" width="5.2" height="16.5" rx="1" fill="#f5c84a" />
      <path
        d="M44.5 24.5c2.6 0 4.2 1.5 4.2 3.6 0 2.4-1.8 3.5-3.7 4.1l3.9 5.6h-3.1l-3.5-5.1h-.8v5.1h-2.8V24.5h5.8zm-2.8 2.2v3.4h2.3c1.1 0 1.8-.6 1.8-1.7s-.7-1.7-1.9-1.7h-2.2z"
        fill="#fffdf8"
      />
    </svg>
  );
}
