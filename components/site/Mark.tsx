export function Mark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <circle cx="24" cy="24" r="24" fill="#1b7a4d" />
      <circle cx="24" cy="24" r="18.5" fill="none" stroke="#f6f3ee" strokeWidth="1.4" />
      <path d="M24 11.5c1.8 5.2 8.2 7.2 8.2 13.2a8.2 8.2 0 1 1-16.4 0c0-6 6.4-8 8.2-13.2z" fill="#f6f3ee" />
    </svg>
  );
}
