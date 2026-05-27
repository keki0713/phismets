export function Logo({ size = 40 }: { size?: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center shrink-0 ring-2 ring-[#22C55E]/30"
      style={{
        width: size,
        height: size,
        background: "radial-gradient(circle at 30% 20%, #145E32, #083026 70%)",
      }}
    >
      <svg viewBox="0 0 24 24" width={size * 0.55} height={size * 0.55} fill="none" stroke="#EBF5E9" strokeWidth="1.6">
        <path d="M8 3v6a4 4 0 0 0 8 0V3" />
        <path d="M12 13v6" />
        <circle cx="12" cy="21" r="1.5" fill="#EBF5E9" />
        <path d="M5 8c0 5 3 8 7 8s7-3 7-8" opacity="0.4" />
      </svg>
    </div>
  );
}
