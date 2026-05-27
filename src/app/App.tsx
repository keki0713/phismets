import { useState } from "react";
import { AuthScreens } from "./components/AuthScreens";
import { AdminDashboard } from "./components/AdminDashboard";
import { MemberPortal } from "./components/MemberPortal";

type View = { kind: "auth" } | { kind: "admin" } | { kind: "member"; id: string };

export default function App() {
  const [view, setView] = useState<View>({ kind: "auth" });

  if (view.kind === "admin") return <AdminDashboard onLogout={() => setView({ kind: "auth" })} />;
  if (view.kind === "member") return <MemberPortal memberId={view.id} onLogout={() => setView({ kind: "auth" })} />;
  return <AuthScreens onAdminLogin={() => setView({ kind: "admin" })} onMemberLogin={(id) => setView({ kind: "member", id })} />;
}
