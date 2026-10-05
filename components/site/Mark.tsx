export function Mark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle cx="32" cy="32" r="32" fill="#f4efe6" />
      <circle cx="32" cy="32" r="28.25" fill="#114236" />
      <circle cx="32" cy="32" r="17.6" fill="#d32622" />
      <path d="M23.2 24.8h11.4L27.2 39.2" fill="none" stroke="#fff" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M37.6 28.4 40.8 24.8v14.4" fill="none" stroke="#fff" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
