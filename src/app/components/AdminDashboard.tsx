import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard, ClipboardCheck, Users, Calendar, CreditCard, FileBarChart, Settings, LogOut, Download, FileText,
  Bell, Search, Plus, Scan, TrendingUp, TrendingDown, CheckCircle2, X, MoreHorizontal, ChevronRight, UserCheck, UserX,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Tooltip, CartesianGrid,
} from "recharts";
import { Logo } from "./Logo";
import { QRScanner } from "./QRScanner";
import { initialMembers, initialEvents, initialScans, pendingSignups, type Member, type Event, type ScanLog } from "./mockData";

type Tab = "dashboard" | "attendance" | "members" | "events" | "approvals" | "reports" | "settings";

/**
 * Main admin dashboard for PHISMETS officers.
 * Manages members, events, attendance scans, pending approvals, and reports.
 * @param onLogout - Callback function to handle officer logout
 */

export function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [scans, setScans] = useState<ScanLog[]>(initialScans);
  const [pending, setPending] = useState(pendingSignups);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scannerEvent, setScannerEvent] = useState("General Assembly");
  const [memberModal, setMemberModal] = useState<{ open: boolean; member: Member | null }>({ open: false, member: null });
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [addEventOpen, setAddEventOpen] = useState(false);

  const active = members.filter((m) => m.status === "Active").length;
  const inactive = members.length - active;
  const upcoming = events.filter((e) => e.status === "Upcoming").length;
  const todayAttendees = events.find((e) => e.status === "Ongoing")?.attendees ?? 0;
  const pendingPayments = members.filter((m) => m.payment === "UNPAID").length;

  const handleScanLog = (memberId: string, type: "IN" | "OUT") => {
    const m = members.find((x) => x.id === memberId);
    if (!m) return;
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    const log: ScanLog = { id: `S${Date.now()}`, memberId, name: m.name, time, type, event: scannerEvent };
    setScans((s) => [log, ...s].slice(0, 30));
    setEvents((evs) => evs.map((e) => (e.name === scannerEvent && type === "IN" ? { ...e, attendees: e.attendees + 1 } : e)));
  };

  return (
    <div className="min-h-screen w-full flex" style={{ background: "#F3F4F6", fontFamily: "Inter" }}>
      {/* Sidebar */}
      <aside className="w-[240px] shrink-0 text-white flex flex-col" style={{ background: "linear-gradient(180deg, #145E32 0%, #083026 100%)" }}>
        <div className="p-5 flex items-center gap-3">
          <Logo size={38} />
          <div>
            <div style={{ fontFamily: "Poppins", fontWeight: 700, letterSpacing: "0.18em" }} className="text-[13px]">PHISMETS</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-[#22C55E]/80">Admin</div>
          </div>
        </div>
        <nav className="px-3 mt-3 space-y-0.5 flex-1">
          {[
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            { id: "attendance", label: "Attendance", icon: ClipboardCheck },
            { id: "members", label: "Members", icon: Users },
            { id: "events", label: "Events", icon: Calendar },
            { id: "approvals", label: "Approvals", icon: UserCheck, badge: pending.length },
            { id: "reports", label: "Reports", icon: FileBarChart },
            { id: "settings", label: "Settings", icon: Settings },
          ].map((item) => {
            const active = tab === item.id;
            return (
              <button key={item.id} onClick={() => setTab(item.id as Tab)}
                className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${active ? "bg-white text-[#083026]" : "text-white/75 hover:bg-white/10 hover:text-white"}`}>
                <item.icon className="w-[18px] h-[18px]" />
                <span>{item.label}</span>
                {item.badge ? <span className="ml-auto text-[10px] bg-[#EF4444] text-white px-1.5 py-0.5 rounded-full">{item.badge}</span> : null}
              </button>
            );
          })}
        </nav>
        <button onClick={onLogout} className="m-3 flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:bg-white/10 hover:text-white">
          <LogOut className="w-[18px] h-[18px]" /> Logout
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        {/* Topbar */}
        <header className="bg-white border-b border-[#E5E7EB] px-8 py-4 flex items-center justify-between">
          <div>
            <h1 style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: "22px" }} className="text-[#083026]">{tabLabel(tab)}</h1>
            <p className="text-xs text-[#687280] mt-0.5">Welcome back, Officer · {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#687280]" />
              <input placeholder="Search members, events…" className="bg-[#F3F4F6] rounded-lg pl-9 pr-4 py-2 text-sm outline-none w-[280px] focus:ring-2 focus:ring-[#145E32]/30" />
            </div>
            <button className="relative w-10 h-10 rounded-lg bg-[#F3F4F6] grid place-items-center hover:bg-[#EBF5E9]">
              <Bell className="w-4 h-4 text-[#083026]" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#EF4444] rounded-full" />
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-[#E5E7EB]">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#145E32] to-[#083026] grid place-items-center text-white text-xs font-medium">OF</div>
              <div className="text-right">
                <div className="text-xs font-medium text-[#083026]">Officer</div>
                <div className="text-[10px] text-[#687280]">President</div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-[1400px]">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              {tab === "dashboard" && (
                <DashboardView
                  members={members} events={events} scans={scans}
                  stats={{ total: members.length, active, inactive, today: todayAttendees, upcoming, pendingPayments }}
                  openScanner={() => { setScannerEvent(events.find((e) => e.status === "Ongoing")?.name ?? events[0].name); setScannerOpen(true); }}
                />
              )}
              {tab === "attendance" && (
                <AttendanceView events={events} scans={scans} openScanner={(name) => { setScannerEvent(name); setScannerOpen(true); }} />
              )}
              {tab === "members" && (
                <MembersView
                  members={members}
                  onOpen={(m) => setMemberModal({ open: true, member: m })}
                  onAdd={() => setAddMemberOpen(true)}
                  onToggle={(id) => setMembers((ms) => ms.map((x) => x.id === id ? { ...x, status: x.status === "Active" ? "Inactive" : "Active" } : x))}
                />
              )}
              {tab === "events" && <EventsView events={events} onAdd={() => setAddEventOpen(true)} openScanner={(name) => { setScannerEvent(name); setScannerOpen(true); }} />}
              {tab === "approvals" && (
                <ApprovalsView
                  pending={pending}
                  onApprove={(id) => setPending((p) => p.filter((x) => x.id !== id))}
                  onReject={(id) => setPending((p) => p.filter((x) => x.id !== id))}
                />
              )}
              {tab === "reports" && <ReportsView events={events} members={members} />}
              {tab === "settings" && <SettingsView />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <QRScanner open={scannerOpen} onClose={() => setScannerOpen(false)} members={members} eventName={scannerEvent} onLog={handleScanLog} />

      <MemberModal data={memberModal} onClose={() => setMemberModal({ open: false, member: null })}
        onUpdate={(updated) => setMembers((ms) => ms.map((x) => x.id === updated.id ? updated : x))} />

      <AddMemberDialog open={addMemberOpen} onClose={() => setAddMemberOpen(false)} onAdd={(m) => setMembers((ms) => [m, ...ms])} />
      <AddEventDialog open={addEventOpen} onClose={() => setAddEventOpen(false)} onAdd={(e) => setEvents((es) => [e, ...es])} />
    </div>
  );
}

function tabLabel(t: Tab) {
  return ({ dashboard: "Dashboard", attendance: "Attendance", members: "Members", events: "Events", approvals: "Officer Approvals", reports: "Reports", settings: "Settings" } as const)[t];
}

/* ──────────── Dashboard ──────────── */
function DashboardView({ members, events, scans, stats, openScanner }: any) {
  const eventChartData = events
    .filter((e: Event) => e.status !== "Upcoming")
    .slice(0, 6)
    .map((e: Event) => ({ name: e.name, attendees: e.attendees }));
  const pieData = [
    { name: "Active", value: stats.active, color: "#22C55E" },
    { name: "Inactive", value: stats.inactive, color: "#EF4444" },
  ];
  const weeklyAttendance = [
    { d: "Mon", v: 42 }, { d: "Tue", v: 58 }, { d: "Wed", v: 49 }, { d: "Thu", v: 71 }, { d: "Fri", v: 64 }, { d: "Sat", v: 92 }, { d: "Sun", v: 78 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Total Members" value={stats.total} delta="+12 this month" trend="up" />
        <StatCard label="Today's Attendance" value={stats.today} delta={`${Math.round((stats.today / Math.max(stats.total, 1)) * 100)}% of members`} trend="up" />
        <StatCard label="Events" value={stats.upcoming} delta="Upcoming events" />
        <StatCard label="Pending Payments" value={stats.pendingPayments} delta="Requires follow-up" trend="down" highlight />
      </div>

      {/* primary action strip */}
      <div className="rounded-2xl p-5 flex items-center justify-between text-white shadow-lg"
        style={{ background: "linear-gradient(120deg, #083026 0%, #145E32 60%, #22C55E 130%)" }}>
        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-[#22C55E]">Now Live</div>
          <div style={{ fontFamily: "Poppins", fontWeight: 600 }} className="text-xl mt-1">General Assembly · Attendance Open</div>
          <p className="text-sm text-white/70 mt-1">Scan member QR codes or enter Student IDs manually.</p>
        </div>
        <button onClick={openScanner} className="bg-white text-[#083026] px-5 py-3 rounded-xl text-sm font-medium hover:bg-[#EBF5E9] transition flex items-center gap-2">
          <Scan className="w-4 h-4" /> Open Scanner
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Bar chart */}
        <div className="col-span-2 bg-white rounded-2xl p-6 border border-[#E5E7EB]">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h3 style={{ fontFamily: "Poppins", fontWeight: 600 }} className="text-[#083026]">Events & Attendees</h3>
              <p className="text-xs text-[#687280]">Total members per event</p>
            </div>
            <select className="text-xs bg-[#F3F4F6] rounded-lg px-3 py-1.5 outline-none">
              <option>Last 6 months</option><option>This year</option>
            </select>
          </div>
          <div className="h-[260px] mt-4">
            <ResponsiveContainer>
              <BarChart data={eventChartData} margin={{ top: 16, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22C55E" />
                    <stop offset="100%" stopColor="#145E32" />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#687280" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#687280" }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: "#EBF5E9" }} contentStyle={{ borderRadius: 10, border: "1px solid #E5E7EB", fontSize: 12 }} />
                <Bar dataKey="attendees" fill="url(#barGrad)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie chart */}
        <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB]">
          <div>
            <h3 style={{ fontFamily: "Poppins", fontWeight: 600 }} className="text-[#083026]">Membership Status</h3>
            <p className="text-xs text-[#687280]">Active vs inactive</p>
          </div>
          <div className="h-[200px] relative mt-2">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} innerRadius={56} outerRadius={82} dataKey="value" stroke="none" startAngle={90} endAngle={-270}>
                  {pieData.map((p, i) => <Cell key={`cell-${i}`} fill={p.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 grid place-items-center pointer-events-none">
              <div className="text-center">
                <div style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "28px" }} className="text-[#083026]">{Math.round((stats.active / stats.total) * 100)}%</div>
                <div className="text-[10px] uppercase tracking-wider text-[#687280]">Active</div>
              </div>
            </div>
          </div>
          <div className="space-y-2 mt-2">
            {pieData.map((p) => (
              <div key={p.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: p.color }} /> {p.name}</span>
                <span className="font-medium text-[#083026]">{p.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Weekly line */}
        <div className="col-span-2 bg-white rounded-2xl p-6 border border-[#E5E7EB]">
          <div className="flex items-center justify-between">
            <div>
              <h3 style={{ fontFamily: "Poppins", fontWeight: 600 }} className="text-[#083026]">Attendance Overview (This Week)</h3>
              <p className="text-xs text-[#687280]">Daily check-ins across all events</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-[#22C55E]/15 text-[#22C55E] font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +18.2%
            </span>
          </div>
          <div className="h-[200px] mt-4">
            <ResponsiveContainer>
              <LineChart data={weeklyAttendance}>
                <CartesianGrid stroke="#F3F4F6" vertical={false} />
                <XAxis dataKey="d" tick={{ fontSize: 11, fill: "#687280" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#687280" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #E5E7EB", fontSize: 12 }} />
                <Line type="monotone" dataKey="v" stroke="#145E32" strokeWidth={2.5} dot={{ fill: "#22C55E", r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent scans */}
        <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB]">
          <div className="flex items-center justify-between">
            <h3 style={{ fontFamily: "Poppins", fontWeight: 600 }} className="text-[#083026]">Recent Scans</h3>
            <button className="text-xs text-[#22C55E] hover:underline">View All</button>
          </div>
          <div className="mt-3 space-y-2 max-h-[240px] overflow-y-auto pr-1">
            {scans.slice(0, 6).map((s: ScanLog) => (
              <div key={s.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#F3F4F6]">
                <div className="w-8 h-8 rounded-full bg-[#22C55E]/15 grid place-items-center">
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-[#083026] truncate">{s.name}</div>
                  <div className="text-[10px] text-[#687280]">{s.event} · Time {s.type}</div>
                </div>
                <div className="text-[10px] text-[#687280] tabular-nums">{s.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Events */}
      <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB]">
        <div className="flex items-center justify-between mb-3">
          <h3 style={{ fontFamily: "Poppins", fontWeight: 600 }} className="text-[#083026]">Recent Events</h3>
          <button className="text-xs text-[#22C55E] hover:underline">View All</button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {events.slice(0, 3).map((e: Event) => (
            <div key={e.id} className="rounded-xl border border-[#E5E7EB] p-4 hover:border-[#22C55E]/40 transition cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${e.status === "Upcoming" ? "bg-[#EBF5E9] text-[#145E32]" : e.status === "Ongoing" ? "bg-[#22C55E]/20 text-[#22C55E]" : "bg-[#F3F4F6] text-[#687280]"}`}>{e.status}</span>
                <MoreHorizontal className="w-4 h-4 text-[#687280]" />
              </div>
              <div style={{ fontFamily: "Poppins", fontWeight: 600 }} className="text-[#083026]">{e.name}</div>
              <div className="text-xs text-[#687280] mt-0.5">{e.date}</div>
              <div className="text-xs text-[#145E32] mt-3">{e.attendees} attendees</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, delta, trend, highlight }: { label: string; value: number | string; delta: string; trend?: "up" | "down"; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl p-5 border ${highlight ? "border-[#EF4444]/20 bg-gradient-to-br from-white to-[#FEE2E2]/40" : "border-[#E5E7EB] bg-white"}`}>
      <div className="text-xs text-[#687280] uppercase tracking-wider">{label}</div>
      <div style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "32px" }} className="text-[#083026] mt-1">{value}</div>
      <div className={`text-[11px] mt-1 flex items-center gap-1 ${trend === "down" ? "text-[#EF4444]" : trend === "up" ? "text-[#22C55E]" : "text-[#687280]"}`}>
        {trend === "up" && <TrendingUp className="w-3 h-3" />}
        {trend === "down" && <TrendingDown className="w-3 h-3" />}
        {delta}
      </div>
    </div>
  );
}

/* ──────────── Attendance ──────────── */
function AttendanceView({ events, scans, openScanner }: { events: Event[]; scans: ScanLog[]; openScanner: (n: string) => void }) {
  const live = events.find((e) => e.status === "Ongoing") ?? events[0];
  return (
    <div className="space-y-6">
      <div className="rounded-2xl p-6 text-white" style={{ background: "linear-gradient(120deg, #083026, #145E32)" }}>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-[#22C55E] flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" /> Live Event</div>
            <h3 style={{ fontFamily: "Poppins", fontWeight: 600 }} className="text-2xl mt-2">{live.name}</h3>
            <p className="text-white/70 text-sm mt-1">{live.date} · {live.attendees} checked in</p>
          </div>
          <button onClick={() => openScanner(live.name)} className="bg-[#22C55E] hover:bg-[#16A34A] text-[#04150F] px-5 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
            <Scan className="w-4 h-4" /> Scan QR / Manual Entry
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
        <div className="p-5 border-b border-[#E5E7EB]">
          <h3 style={{ fontFamily: "Poppins", fontWeight: 600 }} className="text-[#083026]">Scan Log</h3>
          <p className="text-xs text-[#687280]">All time in/out records for this event</p>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-[#F3F4F6] text-[#687280]">
            <tr className="text-left text-[11px] uppercase tracking-wider">
              <th className="px-5 py-3">Student ID</th><th className="py-3">Name</th><th className="py-3">Event</th><th className="py-3">Type</th><th className="py-3 text-right pr-5">Time</th>
            </tr>
          </thead>
          <tbody>
            {scans.map((s) => (
              <tr key={s.id} className="border-t border-[#F3F4F6] hover:bg-[#EBF5E9]/40">
                <td className="px-5 py-3 font-mono text-xs text-[#083026]">{s.memberId}</td>
                <td className="py-3 text-[#083026]">{s.name}</td>
                <td className="py-3 text-[#687280]">{s.event}</td>
                <td className="py-3"><span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${s.type === "IN" ? "bg-[#22C55E]/15 text-[#22C55E]" : "bg-[#687280]/15 text-[#687280]"}`}>TIME {s.type}</span></td>
                <td className="py-3 text-right pr-5 text-[#687280] tabular-nums">{s.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ──────────── Members ──────────── */
function MembersView({ members, onOpen, onAdd, onToggle }: { members: Member[]; onOpen: (m: Member) => void; onAdd: () => void; onToggle: (id: string) => void }) {
  const [filter, setFilter] = useState<"All" | "Active" | "Inactive">("All");
  const [q, setQ] = useState("");
  const filtered = members.filter((m) => (filter === "All" || m.status === filter) && (m.name.toLowerCase().includes(q.toLowerCase()) || m.id.includes(q)));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {(["All", "Active", "Inactive"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-sm transition ${filter === f ? "bg-[#083026] text-white" : "bg-white text-[#687280] border border-[#E5E7EB] hover:border-[#145E32]"}`}>{f}<span className="ml-2 text-[10px] opacity-70">{f === "All" ? members.length : members.filter((m) => m.status === f).length}</span></button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or ID…" className="px-4 py-2 rounded-lg text-sm bg-white border border-[#E5E7EB] outline-none w-[260px] focus:border-[#145E32]" />
          <button onClick={onAdd} className="bg-[#083026] hover:bg-[#145E32] text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> Add Member</button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[#F3F4F6] text-[#687280] text-[11px] uppercase tracking-wider text-left">
            <tr><th className="px-5 py-3">Member</th><th className="py-3">Student ID</th><th className="py-3">Course</th><th className="py-3">Attendance</th><th className="py-3">Payment</th><th className="py-3">Status</th><th className="py-3 pr-5"></th></tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr key={m.id} className="border-t border-[#F3F4F6] hover:bg-[#EBF5E9]/30">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#22C55E] to-[#145E32] grid place-items-center text-white text-xs font-medium">{m.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}</div>
                    <div>
                      <div className="text-[#083026] font-medium">{m.name}</div>
                      <div className="text-[11px] text-[#687280]">{m.year}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 font-mono text-xs text-[#083026]">{m.id}</td>
                <td className="py-3 text-[#687280]">{m.course}</td>
                <td className="py-3"><span className="text-[#22C55E] font-medium">{m.attended}</span><span className="text-[#687280]"> / </span><span className="text-[#EF4444]">{m.missed}</span></td>
                <td className="py-3"><span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${m.payment === "PAID" ? "bg-[#22C55E]/15 text-[#22C55E]" : "bg-[#EF4444]/15 text-[#EF4444]"}`}>{m.payment}</span></td>
                <td className="py-3">
                  <button onClick={() => onToggle(m.id)} className={`text-[10px] font-medium px-2.5 py-1 rounded-full transition ${m.status === "Active" ? "bg-[#EBF5E9] text-[#145E32] hover:bg-[#22C55E]/20" : "bg-[#F3F4F6] text-[#687280] hover:bg-[#EF4444]/15 hover:text-[#EF4444]"}`}>
                    {m.status === "Active" ? "● Active" : "○ Inactive"}
                  </button>
                </td>
                <td className="py-3 pr-5 text-right">
                  <button onClick={() => onOpen(m)} className="text-[#687280] hover:text-[#145E32]"><ChevronRight className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ──────────── Events ──────────── */
function EventsView({ events, onAdd, openScanner }: { events: Event[]; onAdd: () => void; openScanner: (n: string) => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#687280]">Plan events, track attendance, manage QR check-ins.</p>
        <button onClick={onAdd} className="bg-[#083026] hover:bg-[#145E32] text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"><Plus className="w-4 h-4" /> Create Event</button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {events.map((e) => (
          <div key={e.id} className="bg-white rounded-2xl p-5 border border-[#E5E7EB] hover:border-[#22C55E]/40 transition group">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${e.status === "Upcoming" ? "bg-[#EBF5E9] text-[#145E32]" : e.status === "Ongoing" ? "bg-[#22C55E]/20 text-[#22C55E]" : "bg-[#F3F4F6] text-[#687280]"}`}>{e.status}</span>
              <Calendar className="w-4 h-4 text-[#22C55E]" />
            </div>
            <div style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: "18px" }} className="text-[#083026]">{e.name}</div>
            <div className="text-xs text-[#687280] mt-0.5">{e.date}</div>
            <div className="mt-4 flex items-end justify-between">
              <div>
                <div style={{ fontFamily: "Poppins", fontWeight: 700, fontSize: "22px" }} className="text-[#145E32]">{e.attendees}</div>
                <div className="text-[10px] uppercase tracking-wider text-[#687280]">Attendees</div>
              </div>
              {e.status !== "Completed" && (
                <button onClick={() => openScanner(e.name)} className="opacity-0 group-hover:opacity-100 transition bg-[#083026] hover:bg-[#145E32] text-white text-xs px-3 py-2 rounded-lg flex items-center gap-1.5">
                  <Scan className="w-3.5 h-3.5" /> Scan
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ──────────── Approvals ──────────── */
function ApprovalsView({ pending, onApprove, onReject }: { pending: typeof pendingSignups; onApprove: (id: string) => void; onReject: (id: string) => void }) {
  if (pending.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 border border-[#E5E7EB] text-center">
        <CheckCircle2 className="w-12 h-12 text-[#22C55E] mx-auto" />
        <p className="mt-3 text-[#083026] font-medium">All caught up</p>
        <p className="text-sm text-[#687280]">No pending officer signups.</p>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      <p className="text-sm text-[#687280]">New officer signups awaiting your approval.</p>
      {pending.map((p) => (
        <div key={p.id} className="bg-white rounded-2xl p-5 border border-[#E5E7EB] flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#22C55E] to-[#145E32] grid place-items-center text-white font-medium">{p.name.split(" ").map((x) => x[0]).join("")}</div>
          <div className="flex-1">
            <div className="font-medium text-[#083026]">{p.name}</div>
            <div className="text-xs text-[#687280]">{p.email} · Requested as {p.position}</div>
            <div className="text-[11px] text-[#687280] mt-0.5">Submitted {p.requested}</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => onReject(p.id)} className="px-3 py-2 rounded-lg text-sm border border-[#E5E7EB] text-[#687280] hover:border-[#EF4444] hover:text-[#EF4444] flex items-center gap-1.5"><UserX className="w-4 h-4" /> Reject</button>
            <button onClick={() => onApprove(p.id)} className="px-4 py-2 rounded-lg text-sm bg-[#083026] hover:bg-[#145E32] text-white flex items-center gap-1.5"><UserCheck className="w-4 h-4" /> Approve</button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ──────────── Reports & Settings ──────────── */
function ReportsView({ events, members }: { events: Event[]; members: Member[] }) {
  const [kind, setKind] = useState<"attendance" | "members" | "payments">("attendance");
  const [preview, setPreview] = useState<{ title: string; rows: string[][]; headers: string[] } | null>(null);

  const buildReport = () => {
    if (kind === "attendance") {
      return {
        title: "Event Attendance Report",
        headers: ["Event", "Date", "Status", "Attendees"],
        rows: events.map((e) => [e.name, e.date, e.status, String(e.attendees)]),
      };
    }
    if (kind === "members") {
      return {
        title: "Member Roster Report",
        headers: ["Student ID", "Name", "Year", "Course", "Status", "Attended", "Missed"],
        rows: members.map((m) => [m.id, m.name, m.year, m.course, m.status, String(m.attended), String(m.missed)]),
      };
    }
    return {
      title: "Payment Status Report",
      headers: ["Student ID", "Name", "Status", "Payment"],
      rows: members.map((m) => [m.id, m.name, m.status, m.payment]),
    };
  };

  const generate = () => setPreview(buildReport());

  const download = () => {
    const r = preview ?? buildReport();
    const csv = [r.headers, ...r.rows].map((row) => row.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `PHISMETS-${kind}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-5 border border-[#E5E7EB] flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#145E32]" />
          <span className="text-sm font-medium text-[#083026]">Generate Report</span>
        </div>
        <select value={kind} onChange={(e) => { setKind(e.target.value as any); setPreview(null); }}
          className="text-sm bg-[#F3F4F6] rounded-lg px-3 py-2 outline-none border border-transparent focus:border-[#145E32]">
          <option value="attendance">Event Attendance</option>
          <option value="members">Member Roster</option>
          <option value="payments">Payment Status</option>
        </select>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={generate} className="bg-[#083026] hover:bg-[#145E32] text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2">
            <FileBarChart className="w-4 h-4" /> Generate Report
          </button>
          <button onClick={download} className="bg-[#22C55E] hover:bg-[#16A34A] text-[#04150F] px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
            <Download className="w-4 h-4" /> Download CSV
          </button>
        </div>
      </div>

      {preview && (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
          <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between">
            <div>
              <h3 style={{ fontFamily: "Poppins", fontWeight: 600 }} className="text-[#083026]">{preview.title}</h3>
              <p className="text-xs text-[#687280]">Generated {new Date().toLocaleString()} · {preview.rows.length} rows</p>
            </div>
            <button onClick={() => setPreview(null)} className="text-xs text-[#687280] hover:text-[#145E32]">Clear</button>
          </div>
          <div className="max-h-[320px] overflow-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#F3F4F6] text-[#687280] text-[11px] uppercase tracking-wider text-left sticky top-0">
                <tr>{preview.headers.map((h) => <th key={h} className="px-5 py-3">{h}</th>)}</tr>
              </thead>
              <tbody>
                {preview.rows.map((row, i) => (
                  <tr key={i} className="border-t border-[#F3F4F6] hover:bg-[#EBF5E9]/30">
                    {row.map((c, j) => <td key={j} className="px-5 py-2.5 text-[#083026]">{c}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
      <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB]">
        <h3 style={{ fontFamily: "Poppins", fontWeight: 600 }} className="text-[#083026]">Event Attendance Report</h3>
        <p className="text-xs text-[#687280]">Aggregate attendance per event</p>
        <div className="mt-4 space-y-2">
          {events.filter((e) => e.attendees > 0).map((e) => (
            <div key={e.id}>
              <div className="flex justify-between text-xs mb-1"><span className="text-[#083026]">{e.name}</span><span className="text-[#687280] tabular-nums">{e.attendees}</span></div>
              <div className="h-2 rounded-full bg-[#F3F4F6] overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${(e.attendees / 200) * 100}%`, background: "linear-gradient(90deg, #22C55E, #145E32)" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB]">
        <h3 style={{ fontFamily: "Poppins", fontWeight: 600 }} className="text-[#083026]">Member Engagement</h3>
        <p className="text-xs text-[#687280]">Most active members this semester</p>
        <div className="mt-4 space-y-3">
          {[...members].sort((a, b) => b.attended - a.attended).slice(0, 5).map((m, i) => (
            <div key={m.id} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-[#EBF5E9] grid place-items-center text-xs font-medium text-[#145E32]">{i + 1}</div>
              <div className="flex-1">
                <div className="text-sm text-[#083026]">{m.name}</div>
                <div className="text-[10px] text-[#687280]">{m.course}</div>
              </div>
              <div className="text-sm text-[#22C55E] font-medium">{m.attended} events</div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}

function SettingsView() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E5E7EB] max-w-2xl">
      <h3 style={{ fontFamily: "Poppins", fontWeight: 600 }} className="text-[#083026]">Organization Settings</h3>
      <p className="text-xs text-[#687280] mt-1">Manage PHISMETS preferences</p>
      <div className="mt-5 space-y-4">
        {[
          ["Organization Name", "PHISMETS"],
          ["Academic Year", "2025-2026"],
          ["Officer Email Domain", "@phs.edu.ph"],
          ["Default Payment Amount", "₱150.00"],
        ].map(([k, v]) => (
          <div key={k} className="flex items-center justify-between border-b border-[#F3F4F6] pb-3">
            <span className="text-sm text-[#687280]">{k}</span>
            <span className="text-sm text-[#083026] font-medium">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ──────────── Modals ──────────── */
function MemberModal({ data, onClose, onUpdate }: { data: { open: boolean; member: Member | null }; onClose: () => void; onUpdate: (m: Member) => void }) {
  if (!data.open || !data.member) return null;
  const m = data.member;
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-[#04150F]/60 backdrop-blur-sm z-50 grid place-items-center p-4" onClick={onClose}>
        <motion.div initial={{ scale: 0.96 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-[480px] bg-white rounded-3xl overflow-hidden">
          <div className="p-6 text-white" style={{ background: "linear-gradient(120deg, #083026, #145E32)" }}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-white/15 grid place-items-center text-lg font-medium">{m.name.split(" ").map((x) => x[0]).slice(0, 2).join("")}</div>
                <div>
                  <div style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: "20px" }}>{m.name}</div>
                  <div className="text-xs text-white/70 font-mono">{m.id}</div>
                </div>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 grid place-items-center"><X className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="p-6 space-y-3 text-sm">
            <Row label="Course" value={m.course} />
            <Row label="Year" value={m.year} />
            <Row label="Email" value={m.email} />
            <Row label="Contact" value={m.contact} />
            <Row label="Attended" value={`${m.attended} events`} />
            <Row label="Missed" value={`${m.missed} events`} />
            <div className="pt-4 grid grid-cols-2 gap-2">
              <button onClick={() => onUpdate({ ...m, status: m.status === "Active" ? "Inactive" : "Active" })}
                className="py-2.5 rounded-lg border border-[#E5E7EB] text-sm hover:border-[#145E32] hover:text-[#145E32]">Toggle Status</button>
              <button onClick={() => onUpdate({ ...m, payment: m.payment === "PAID" ? "UNPAID" : "PAID" })}
                className="py-2.5 rounded-lg bg-[#083026] hover:bg-[#145E32] text-white text-sm">Toggle Payment</button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[#687280]">{label}</span>
      <span className="text-[#083026] font-medium text-right">{value}</span>
    </div>
  );
}

function AddMemberDialog({ open, onClose, onAdd }: { open: boolean; onClose: () => void; onAdd: (m: Member) => void }) {
  const [form, setForm] = useState({ name: "", id: "", course: "BS Medical Technology", year: "1st Year", email: "", contact: "" });
  if (!open) return null;
  const submit = () => {
    if (!form.name || !form.id) return;
    onAdd({ ...form, status: "Active", payment: "UNPAID", attended: 0, missed: 0 } as Member);
    setForm({ name: "", id: "", course: "BS Medical Technology", year: "1st Year", email: "", contact: "" });
    onClose();
  };
  return <DialogShell title="Add Member" subtitle="Register a new PHISMETS member" onClose={onClose} onSubmit={submit} submitLabel="Add member">
    <DField label="Full Name"><DInput value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Juan Dela Cruz" /></DField>
    <DField label="Student ID"><DInput value={form.id} onChange={(v) => setForm({ ...form, id: v })} placeholder="2025-00101" /></DField>
    <div className="grid grid-cols-2 gap-3">
      <DField label="Course"><DInput value={form.course} onChange={(v) => setForm({ ...form, course: v })} /></DField>
      <DField label="Year"><DInput value={form.year} onChange={(v) => setForm({ ...form, year: v })} /></DField>
    </div>
    <DField label="Email"><DInput value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="name@phs.edu.ph" /></DField>
    <DField label="Contact"><DInput value={form.contact} onChange={(v) => setForm({ ...form, contact: v })} placeholder="0912 345 6789" /></DField>
  </DialogShell>;
}

function AddEventDialog({ open, onClose, onAdd }: { open: boolean; onClose: () => void; onAdd: (e: Event) => void }) {
  const [form, setForm] = useState({ name: "", date: "" });
  if (!open) return null;
  const submit = () => {
    if (!form.name) return;
    onAdd({ id: `E${Date.now()}`, name: form.name, date: form.date || "TBD", attendees: 0, status: "Upcoming" });
    setForm({ name: "", date: "" });
    onClose();
  };
  return <DialogShell title="Create Event" subtitle="Schedule a new PHISMETS event" onClose={onClose} onSubmit={submit} submitLabel="Create event">
    <DField label="Event Name"><DInput value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="e.g. Medical Symposium" /></DField>
    <DField label="Date"><DInput value={form.date} onChange={(v) => setForm({ ...form, date: v })} placeholder="June 15, 2026" /></DField>
  </DialogShell>;
}

function DialogShell({ title, subtitle, onClose, onSubmit, submitLabel, children }: { title: string; subtitle: string; onClose: () => void; onSubmit: () => void; submitLabel: string; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-50 bg-[#04150F]/60 backdrop-blur-sm grid place-items-center p-4">
        <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-3xl w-full max-w-[460px] p-7">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 style={{ fontFamily: "Poppins", fontWeight: 600, fontSize: "20px" }} className="text-[#083026]">{title}</h3>
              <p className="text-xs text-[#687280] mt-1">{subtitle}</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#F3F4F6] grid place-items-center"><X className="w-4 h-4 text-[#687280]" /></button>
          </div>
          <div className="space-y-3">{children}</div>
          <button onClick={onSubmit} className="mt-6 w-full py-3 rounded-xl bg-[#083026] hover:bg-[#145E32] text-white text-sm">{submitLabel}</button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function DField({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block space-y-1.5"><span className="text-xs font-medium text-[#083026]">{label}</span>{children}</label>;
}
function DInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#145E32] focus:ring-4 focus:ring-[#145E32]/10" />;
}
