import { motion } from "motion/react";
import { LogOut, Calendar, CheckCircle2, XCircle, ChevronRight, CreditCard, Mail, Phone, GraduationCap } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Logo } from "./Logo";
import { initialMembers, initialEvents } from "./mockData";

export function MemberPortal({ memberId, onLogout }: { memberId: string; onLogout: () => void }) {
  const member = initialMembers.find((m) => m.id === memberId) ?? initialMembers[0];
  const attendanceRate = Math.round((member.attended / (member.attended + member.missed || 1)) * 100);
  const upcoming = initialEvents.filter((e) => e.status === "Upcoming");
  const recent = [
    { name: "General Assembly", date: "May 26, 2026", time: "9:15 AM", status: "Present" },
    { name: "Leadership Training", date: "May 20, 2026", time: "1:30 PM", status: "Present" },
    { name: "Outreach Program", date: "Apr 28, 2026", time: "—", status: "Absent" },
    { name: "Medical Mission", date: "Apr 20, 2026", time: "10:00 AM", status: "Present" },
  ];
  const pie = [
    { name: "Present", value: member.attended, color: "#22C55E" },
    { name: "Absent", value: member.missed, color: "#EF4444" },
  ];

  return (
    <div className="min-h-screen w-full" style={{ background: "#F3F4F6", fontFamily: "Inter" }}>
      {/* Top */}
      <header className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-[1100px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size={38} />
            <div>
              <div style={{ fontFamily: "Poppins", fontWeight: 700, letterSpacing: "0.18em" }} className="text-[13px] text-[#083026]">PHISMETS</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#22C55E]">Member Portal</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-sm font-medium text-[#083026]">{member.name}</div>
              <div className="text-[10px] text-[#687280]">View-only access</div>
            </div>
            <button onClick={onLogout} className="w-10 h-10 rounded-lg bg-[#F3F4F6] hover:bg-[#EBF5E9] grid place-items-center"><LogOut className="w-4 h-4 text-[#083026]" /></button>
          </div>
        </div>
      </header>

      <main className="max-w-[1100px] mx-auto p-6 space-y-6">
        {/* Hero card */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl p-7 text-white relative overflow-hidden"
          style={{ background: "linear-gradient(120deg, #083026 0%, #145E32 60%, #22C55E 130%)" }}>
          <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)", backgroundSize: "24px 24px" }} />
          <div className="relative flex items-start justify-between gap-6">
            <div>
              <div className="text-[11px] uppercase tracking-[0.25em] text-[#22C55E]">My Overview</div>
              <h1 style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: "32px" }} className="mt-1">Hi, {member.name.split(" ")[0]} 👋</h1>
              <p className="text-white/70 text-sm mt-1">Here's your membership status and attendance summary.</p>
              <div className="mt-5 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#22C55E] text-[#04150F]">{member.status} Member</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${member.payment === "PAID" ? "bg-white text-[#145E32]" : "bg-[#EF4444] text-white"}`}>{member.payment}</span>
              </div>
            </div>
            <div className="w-20 h-20 rounded-full bg-white/15 grid place-items-center text-2xl font-medium shrink-0">{member.name.split(" ").map((x) => x[0]).slice(0, 2).join("")}</div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard label="Total Events" value={member.attended + member.missed} sub="This semester" color="#083026" />
          <StatCard label="Attendance Rate" value={`${attendanceRate}%`} sub="Above average" color="#22C55E" />
          <StatCard label="Payment Status" value={member.payment} sub={member.payment === "PAID" ? "₱150.00 received" : "₱150.00 due"} color={member.payment === "PAID" ? "#22C55E" : "#EF4444"} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Attendance pie */}
          <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB]">
            <h3 style={{ fontFamily: "Poppins", fontWeight: 600 }} className="text-[#083026]">Attendance Summary</h3>
            <div className="h-[200px] relative mt-2">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={pie} innerRadius={56} outerRadius={82} dataKey="value" stroke="none" startAngle={90} endAngle={-270}>
                    {pie.map((p, i) => <Cell key={`cell-${i}`} fill={p.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 grid place-items-center pointer-events-none">
                <div className="text-center">
                  <div style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "28px" }} className="text-[#083026]">{attendanceRate}%</div>
                  <div className="text-[10px] uppercase tracking-wider text-[#687280]">Attended</div>
                </div>
              </div>
            </div>
            <div className="space-y-2 mt-3">
              {pie.map((p) => (
                <div key={p.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: p.color }} /> {p.name}</span>
                  <span className="font-medium text-[#083026]">{p.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming events */}
          <div className="col-span-2 bg-white rounded-2xl p-6 border border-[#E5E7EB]">
            <div className="flex items-center justify-between mb-3">
              <h3 style={{ fontFamily: "Poppins", fontWeight: 600 }} className="text-[#083026]">Events to Attend</h3>
              <span className="text-xs text-[#687280]">{upcoming.length} upcoming</span>
            </div>
            <div className="space-y-2">
              {upcoming.map((e) => (
                <div key={e.id} className="flex items-center gap-3 p-3 rounded-xl border border-[#E5E7EB] hover:border-[#22C55E]/40">
                  <div className="w-10 h-10 rounded-lg bg-[#EBF5E9] grid place-items-center"><Calendar className="w-5 h-5 text-[#145E32]" /></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-[#083026]">{e.name}</div>
                    <div className="text-xs text-[#687280]">{e.date}</div>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-[#EBF5E9] text-[#145E32]">Required</span>
                  <ChevronRight className="w-4 h-4 text-[#687280]" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent attendance */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
          <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between">
            <div>
              <h3 style={{ fontFamily: "Poppins", fontWeight: 600 }} className="text-[#083026]">Recent Attendance</h3>
              <p className="text-xs text-[#687280]">Events you attended and missed</p>
            </div>
            <span className="text-[11px] text-[#687280] bg-[#F3F4F6] px-3 py-1.5 rounded-lg">View-only. Contact your officers for changes.</span>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-[#F3F4F6] text-[#687280] text-[11px] uppercase tracking-wider text-left">
              <tr><th className="px-5 py-3">Event</th><th className="py-3">Date</th><th className="py-3">Time</th><th className="py-3 pr-5 text-right">Status</th></tr>
            </thead>
            <tbody>
              {recent.map((r, i) => (
                <tr key={i} className="border-t border-[#F3F4F6]">
                  <td className="px-5 py-3 text-[#083026] font-medium">{r.name}</td>
                  <td className="py-3 text-[#687280]">{r.date}</td>
                  <td className="py-3 text-[#687280] tabular-nums">{r.time}</td>
                  <td className="py-3 pr-5 text-right">
                    {r.status === "Present" ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#22C55E] bg-[#22C55E]/15 px-2.5 py-1 rounded-full"><CheckCircle2 className="w-3 h-3" /> Present</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#EF4444] bg-[#EF4444]/15 px-2.5 py-1 rounded-full"><XCircle className="w-3 h-3" /> Absent</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Profile */}
        <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB]">
          <h3 style={{ fontFamily: "Poppins", fontWeight: 600 }} className="text-[#083026]">My Profile</h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 mt-4 text-sm">
            <InfoRow icon={GraduationCap} label="Course" value={member.course} />
            <InfoRow icon={CreditCard} label="Student ID" value={member.id} mono />
            <InfoRow icon={Mail} label="Email" value={member.email} />
            <InfoRow icon={Phone} label="Contact" value={member.contact} />
          </div>
          <p className="mt-5 text-[11px] text-[#687280] bg-[#EBF5E9] rounded-lg p-3">
            This is a view-only dashboard. For changes, please contact your officers.
          </p>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub: string; color: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB]">
      <div className="text-xs text-[#687280] uppercase tracking-wider">{label}</div>
      <div style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "30px", color }} className="mt-1">{value}</div>
      <div className="text-[11px] text-[#687280] mt-1">{sub}</div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, mono }: { icon: any; label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-[#F3F4F6]">
      <div className="w-8 h-8 rounded-lg bg-[#EBF5E9] grid place-items-center shrink-0"><Icon className="w-4 h-4 text-[#145E32]" /></div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase tracking-wider text-[#687280]">{label}</div>
        <div className={`text-[#083026] truncate ${mono ? "font-mono text-xs" : "text-sm"}`}>{value}</div>
      </div>
    </div>
  );
}
