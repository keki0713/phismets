import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Zap, CheckCircle2, AlertCircle, Keyboard, Scan } from "lucide-react";
import type { Member } from "./mockData";

/**
 * QR code scanner for event attendance tracking.
 * Handles check-in and check-out by scanning member QR ID codes.
 * Maintains a real-time scan log limited to the last 30 entries.
 */

export function QRScanner({
  open, onClose, members, eventName, onLog,
}: {
  open: boolean;
  onClose: () => void;
  members: Member[];
  eventName: string;
  onLog: (memberId: string, type: "IN" | "OUT") => void;
}) {
  const [mode, setMode] = useState<"scan" | "manual">("scan");
  const [manualId, setManualId] = useState("");
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string; name?: string } | null>(null);
  const [scanType, setScanType] = useState<"IN" | "OUT">("IN");

  useEffect(() => {
    if (!open || mode !== "scan") return;
    const id = setTimeout(() => {
      const random = members[Math.floor(Math.random() * Math.min(5, members.length))];
      onLog(random.id, scanType);
      setFeedback({ ok: true, msg: `Time ${scanType} recorded`, name: random.name });
      setTimeout(() => setFeedback(null), 2200);
    }, 2400);
    return () => clearTimeout(id);
  }, [open, mode, feedback, scanType]);

  const submitManual = () => {
    const m = members.find((x) => x.id.replace(/\s/g, "") === manualId.replace(/\s/g, ""));
    if (m) {
      onLog(m.id, scanType);
      setFeedback({ ok: true, msg: `Time ${scanType} recorded`, name: m.name });
      setManualId("");
    } else {
      setFeedback({ ok: false, msg: "Student ID not found in member list" });
    }
    setTimeout(() => setFeedback(null), 2400);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 grid place-items-center p-4" style={{ background: "rgba(4,21,15,0.85)", backdropFilter: "blur(8px)" }} onClick={onClose}>
          <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[420px] rounded-3xl overflow-hidden shadow-2xl"
            style={{ background: "linear-gradient(180deg, #083026 0%, #04150F 100%)" }}>
            {/* header */}
            <div className="flex items-center justify-between p-5 text-white">
              <div className="flex items-center gap-2">
                <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/15 grid place-items-center"><X className="w-4 h-4" /></button>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.25em] text-[#22C55E]">{eventName}</div>
                  <div style={{ fontFamily: "Poppins", fontWeight: 600 }} className="text-sm">QR Attendance</div>
                </div>
              </div>
              <button className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/15 grid place-items-center"><Zap className="w-4 h-4" /></button>
            </div>

            {/* mode toggle */}
            <div className="px-5 flex gap-2">
              <button onClick={() => setScanType("IN")} className={`flex-1 py-2 rounded-lg text-xs font-medium transition ${scanType === "IN" ? "bg-[#22C55E] text-[#04150F]" : "bg-white/5 text-white/60"}`}>TIME IN</button>
              <button onClick={() => setScanType("OUT")} className={`flex-1 py-2 rounded-lg text-xs font-medium transition ${scanType === "OUT" ? "bg-[#22C55E] text-[#04150F]" : "bg-white/5 text-white/60"}`}>TIME OUT</button>
            </div>

            {/* scanner viewport */}
            {mode === "scan" ? (
              <div className="p-5">
                <div className="relative aspect-square rounded-2xl overflow-hidden" style={{ background: "radial-gradient(circle at 50% 50%, rgba(34,197,94,0.18), transparent 70%), #04150F" }}>
                  {/* mock QR */}
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="w-[55%] aspect-square rounded-xl p-3" style={{ background: "white" }}>
                      <FakeQR />
                    </div>
                  </div>
                  {/* corner brackets */}
                  {[
                    "top-3 left-3 border-l-2 border-t-2",
                    "top-3 right-3 border-r-2 border-t-2",
                    "bottom-3 left-3 border-l-2 border-b-2",
                    "bottom-3 right-3 border-r-2 border-b-2",
                  ].map((c) => (
                    <div key={c} className={`absolute w-10 h-10 ${c}`} style={{ borderColor: "#22C55E" }} />
                  ))}
                  {/* scan line */}
                  <motion.div
                    initial={{ top: "10%" }}
                    animate={{ top: ["10%", "85%", "10%"] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute left-4 right-4 h-[2px]"
                    style={{ background: "linear-gradient(90deg, transparent, #22C55E, transparent)", boxShadow: "0 0 16px #22C55E" }}
                  />
                </div>
                <p className="mt-4 text-center text-xs text-white/60">Point the camera at the member's QR ID</p>
                <p className="mt-1 text-center text-[11px] text-[#22C55E] flex items-center justify-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" /> Scanning will start automatically
                </p>
              </div>
            ) : (
              <div className="p-5 pt-3">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-5 space-y-4">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-white/60">Manual Student ID</label>
                    <input
                      autoFocus
                      value={manualId}
                      onChange={(e) => setManualId(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && submitManual()}
                      placeholder="23-17-00456"
                      className="mt-2 w-full bg-transparent border-b-2 border-white/20 focus:border-[#22C55E] outline-none text-white text-xl tracking-widest py-2 transition-colors"
                      style={{ fontFamily: "Poppins" }}
                    />
                  </div>
                  <button onClick={submitManual} disabled={!manualId.trim()} className="w-full py-3 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] disabled:opacity-30 disabled:cursor-not-allowed text-[#04150F] font-medium">
                    Record Time {scanType}
                  </button>
                  <p className="text-[11px] text-white/50 text-center">Use this when the QR code can't be scanned.</p>
                </div>
              </div>
            )}

            {/* mode switch */}
            <div className="px-5 pb-5">
              <button onClick={() => setMode(mode === "scan" ? "manual" : "scan")} className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm flex items-center justify-center gap-2 transition">
                {mode === "scan" ? <><Keyboard className="w-4 h-4" /> Enter ID manually</> : <><Scan className="w-4 h-4" /> Back to QR scan</>}
              </button>
            </div>

            {/* feedback */}
            <AnimatePresence>
              {feedback && (
                <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
                  className={`absolute left-4 right-4 bottom-4 rounded-xl px-4 py-3 flex items-center gap-3 ${feedback.ok ? "bg-[#22C55E]" : "bg-[#EF4444]"}`}>
                  {feedback.ok ? <CheckCircle2 className="w-5 h-5 text-[#04150F]" /> : <AlertCircle className="w-5 h-5 text-white" />}
                  <div className={feedback.ok ? "text-[#04150F]" : "text-white"}>
                    <div className="text-sm font-medium">{feedback.msg}</div>
                    {feedback.name && <div className="text-xs opacity-80">{feedback.name}</div>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function FakeQR() {
  // deterministic grid pattern
  const cells = Array.from({ length: 21 * 21 }, (_, i) => {
    const r = Math.floor(i / 21), c = i % 21;
    const corner = (r < 7 && c < 7) || (r < 7 && c > 13) || (r > 13 && c < 7);
    if (corner) {
      const inR = r % 7, inC = c % 7;
      const edge = inR === 0 || inR === 6 || (c < 7 ? inC === 0 || inC === 6 : (c - 14) === 0 || (c - 14) === 6);
      const mid = inR >= 2 && inR <= 4 && (c < 7 ? inC >= 2 && inC <= 4 : (c - 14) >= 2 && (c - 14) <= 4);
      return edge || mid;
    }
    return ((r * 7 + c * 13 + r * c) % 5) < 2;
  });
  return (
    <div className="grid w-full h-full" style={{ gridTemplateColumns: "repeat(21, 1fr)", gap: "1px" }}>
      {cells.map((on, i) => <div key={i} style={{ background: on ? "#083026" : "transparent" }} />)}
    </div>
  );
}
