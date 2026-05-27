import { useState } from "react";
import { motion } from "motion/react";
import { Eye, EyeOff, ArrowRight, CheckCircle2, Scan, Clock, FileText, Activity } from "lucide-react";
import { Logo } from "./Logo";

type Mode = "landing" | "login" | "signup" | "member" | "signupSuccess";

export function AuthScreens({
  onAdminLogin,
  onMemberLogin,
}: {
  onAdminLogin: () => void;
  onMemberLogin: (id: string) => void;
}) {
  const [mode, setMode] = useState<Mode>("landing");
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("officer@phismets.org");
  const [pw, setPw] = useState("phismets2026");
  const [memberId, setMemberId] = useState("");
  const [signupName, setSignupName] = useState("");

  return (
    <div className="min-h-screen w-full relative overflow-hidden" style={{ background: "radial-gradient(1200px 600px at 80% -10%, #145E32 0%, #083026 45%, #04150F 100%)" }}>
      {/* atmosphere */}
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #EBF5E9 1px, transparent 0)", backgroundSize: "28px 28px" }} />
      <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full blur-3xl opacity-30" style={{ background: "#22C55E" }} />
      <div className="absolute -bottom-40 -left-20 w-[420px] h-[420px] rounded-full blur-3xl opacity-20" style={{ background: "#145E32" }} />

      <div className="relative z-10 min-h-screen grid lg:grid-cols-2">
        {/* Left brand panel */}
        <div className="hidden lg:flex flex-col justify-between p-12 text-[#EBF5E9]">
          <div className="flex items-center gap-3">
            <Logo size={44} />
            <div>
              <div style={{ fontFamily: "Poppins", fontWeight: 700, letterSpacing: "0.18em" }} className="text-[15px]">PHISMETS</div>
              <div className="text-[11px] uppercase tracking-[0.25em] text-[#22C55E]/80">Officer Portal</div>
            </div>
          </div>

          <div className="space-y-8 max-w-md">
            <div>
              <div className="text-[11px] uppercase tracking-[0.3em] text-[#22C55E]">QR-Based Attendance</div>
              <h1 style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "56px", lineHeight: "1.05" }} className="mt-3">
                Fast.<br />Accurate.<br /><span className="text-[#22C55E]">Organized.</span>
              </h1>
              <p className="mt-5 text-[#EBF5E9]/70 leading-relaxed max-w-sm">
                Building a better way to track every presence across the Philippine Society of Medical Technology Students.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Scan, label: "Smart Scanning" },
                { icon: Clock, label: "Real-time Tracking" },
                { icon: FileText, label: "Accurate Records" },
                { icon: Activity, label: "Live Analytics" },
              ].map((f, i) => (
                <motion.div key={f.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.08 }}
                  className="rounded-xl border border-[#EBF5E9]/10 bg-[#EBF5E9]/[0.03] backdrop-blur-sm p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#22C55E]/15 grid place-items-center"><f.icon className="w-4 h-4 text-[#22C55E]" /></div>
                  <span className="text-sm text-[#EBF5E9]/90">{f.label}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-[#EBF5E9]/40 tracking-wider">© PHISMETS 2026 · Esmaya · Duquesa · Sanchez · Diola · Gause</div>
        </div>

        {/* Right interactive panel */}
        <div className="flex items-center justify-center p-6 lg:p-12">
          <motion.div layout className="w-full max-w-[440px] rounded-3xl bg-white/95 backdrop-blur-xl shadow-[0_30px_80px_-20px_rgba(8,48,38,0.5)] border border-white/40 overflow-hidden">
            <div className="p-8 lg:p-10">
              {mode === "landing" && (
                <Landing onPickAdmin={() => setMode("login")} onPickMember={() => setMode("member")} />
              )}
              {mode === "login" && (
                <Form
                  title="Officer Login"
                  subtitle="Welcome back. Sign in to manage attendance."
                  back={() => setMode("landing")}
                  footer={
                    <>No account?{" "}<button onClick={() => setMode("signup")} className="text-[#145E32] underline underline-offset-4">Request access</button></>
                  }
                  submitLabel="Sign in"
                  onSubmit={onAdminLogin}
                >
                  <Field label="Email">
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="auth-input" placeholder="you@phismets.org" />
                  </Field>
                  <Field label="Password">
                    <div className="relative">
                      <input value={pw} onChange={(e) => setPw(e.target.value)} type={showPw ? "text" : "password"} className="auth-input pr-10" placeholder="••••••••" />
                      <button type="button" onClick={() => setShowPw((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#687280] hover:text-[#145E32]">
                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </Field>
                  <div className="flex justify-between items-center text-xs text-[#687280]">
                    <label className="flex items-center gap-2"><input type="checkbox" className="accent-[#145E32]" defaultChecked /> Remember me</label>
                    <a className="text-[#145E32] hover:underline" href="#">Forgot password?</a>
                  </div>
                </Form>
              )}
              {mode === "signup" && (
                <Form
                  title="Officer Sign Up"
                  subtitle="Submit your details. An admin will approve your access."
                  back={() => setMode("login")}
                  footer={<>Already an officer?{" "}<button onClick={() => setMode("login")} className="text-[#145E32] underline underline-offset-4">Sign in</button></>}
                  submitLabel="Submit for approval"
                  onSubmit={() => setMode("signupSuccess")}
                >
                  <Field label="Full Name">
                    <input value={signupName} onChange={(e) => setSignupName(e.target.value)} className="auth-input" placeholder="e.g. Juan Dela Cruz" />
                  </Field>
                  <Field label="Officer Position">
                    <select className="auth-input">
                      <option>President</option>
                      <option>Vice President</option>
                      <option>Secretary</option>
                      <option>Treasurer</option>
                      <option>Public Relations Officer</option>
                    </select>
                  </Field>
                  <Field label="Email">
                    <input type="email" className="auth-input" placeholder="you@phs.edu.ph" />
                  </Field>
                  <Field label="Password">
                    <input type="password" className="auth-input" placeholder="At least 8 characters" />
                  </Field>
                </Form>
              )}
              {mode === "signupSuccess" && (
                <div className="text-center py-6">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 220 }} className="mx-auto w-16 h-16 rounded-full bg-[#22C55E]/15 grid place-items-center">
                    <CheckCircle2 className="w-9 h-9 text-[#22C55E]" />
                  </motion.div>
                  <h2 style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: "22px" }} className="mt-5 text-[#083026]">Pending Approval</h2>
                  <p className="mt-2 text-sm text-[#687280] leading-relaxed">
                    Your registration has been submitted. An existing officer will review and approve your account shortly. You'll be notified via email.
                  </p>
                  <button onClick={() => setMode("landing")} className="mt-7 w-full rounded-xl bg-[#083026] hover:bg-[#145E32] text-white py-3 transition-colors">Back to home</button>
                </div>
              )}
              {mode === "member" && (
                <Form
                  title="Member Access"
                  subtitle="Enter your Student ID to view your status and events."
                  back={() => setMode("landing")}
                  footer={<>Are you an officer?{" "}<button onClick={() => setMode("login")} className="text-[#145E32] underline underline-offset-4">Sign in here</button></>}
                  submitLabel="View my dashboard"
                  disabled={!memberId.trim()}
                  onSubmit={() => onMemberLogin(memberId.trim() || "2025-00101")}
                >
                  <Field label="Student ID">
                    <input value={memberId} onChange={(e) => setMemberId(e.target.value)} className="auth-input tracking-widest" placeholder="2025-00101" />
                  </Field>
                  <div className="text-[11px] text-[#687280] bg-[#EBF5E9] rounded-lg p-3 leading-relaxed">
                    Try <button onClick={() => setMemberId("2025-00101")} className="font-semibold text-[#145E32] hover:underline">2025-00101</button> for a demo of an active member.
                  </div>
                </Form>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        .auth-input { width: 100%; border: 1.5px solid #E5E7EB; border-radius: 12px; padding: 12px 14px; background: white; outline: none; transition: all .15s; font-family: Inter; font-size: 14px; color: #083026; }
        .auth-input:focus { border-color: #145E32; box-shadow: 0 0 0 4px rgba(20,94,50,0.08); }
      `}</style>
    </div>
  );
}

function Landing({ onPickAdmin, onPickMember }: { onPickAdmin: () => void; onPickMember: () => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 lg:hidden">
        <Logo size={40} />
        <div style={{ fontFamily: "Poppins", fontWeight: 700, letterSpacing: "0.2em" }} className="text-[#083026]">PHISMETS</div>
      </div>
      <div>
        <div className="text-[11px] uppercase tracking-[0.3em] text-[#22C55E]">Choose your role</div>
        <h2 style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: "26px" }} className="mt-2 text-[#083026] leading-tight">Welcome to the attendance system</h2>
        <p className="mt-2 text-sm text-[#687280]">Officers manage events and members. Members check their own status.</p>
      </div>
      <button onClick={onPickAdmin} className="group w-full rounded-2xl bg-[#083026] hover:bg-[#145E32] text-white p-5 text-left transition-all flex items-center justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-[#22C55E]">For Officers</div>
          <div style={{ fontFamily: "Poppins", fontWeight: 600 }} className="text-lg mt-1">Admin Dashboard</div>
          <div className="text-xs text-white/60 mt-1">Login or request access</div>
        </div>
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>
      <button onClick={onPickMember} className="group w-full rounded-2xl bg-[#EBF5E9] hover:bg-[#22C55E]/15 text-[#083026] p-5 text-left transition-all flex items-center justify-between border border-[#22C55E]/20">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-[#145E32]">For Members</div>
          <div style={{ fontFamily: "Poppins", fontWeight: 600 }} className="text-lg mt-1">View My Status</div>
          <div className="text-xs text-[#687280] mt-1">Use your Student ID</div>
        </div>
        <ArrowRight className="w-5 h-5 text-[#145E32] group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium tracking-wide text-[#083026]">{label}</span>
      {children}
    </label>
  );
}

function Form({ title, subtitle, back, children, onSubmit, submitLabel, footer, disabled }: {
  title: string; subtitle: string; back: () => void; children: React.ReactNode; onSubmit: () => void; submitLabel: string; footer?: React.ReactNode; disabled?: boolean;
}) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (!disabled) onSubmit(); }} className="space-y-5">
      <div className="flex items-center gap-3 lg:hidden">
        <Logo size={36} />
        <div style={{ fontFamily: "Poppins", fontWeight: 700, letterSpacing: "0.2em" }} className="text-[#083026] text-sm">PHISMETS</div>
      </div>
      <button type="button" onClick={back} className="text-xs text-[#687280] hover:text-[#145E32]">← Back</button>
      <div>
        <h2 style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: "26px" }} className="text-[#083026] leading-tight">{title}</h2>
        <p className="mt-1.5 text-sm text-[#687280]">{subtitle}</p>
      </div>
      <div className="space-y-4">{children}</div>
      <button type="submit" disabled={disabled} className="w-full rounded-xl bg-[#083026] hover:bg-[#145E32] disabled:opacity-40 disabled:cursor-not-allowed text-white py-3 transition-colors flex items-center justify-center gap-2 group">
        {submitLabel}
        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </button>
      {footer && <div className="text-xs text-center text-[#687280]">{footer}</div>}
    </form>
  );
}
