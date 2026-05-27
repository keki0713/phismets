export type Member = {
  id: string;
  name: string;
  year: string;
  course: string;
  email: string;
  contact: string;
  status: "Active" | "Inactive";
  payment: "PAID" | "UNPAID";
  attended: number;
  missed: number;
};

export type Event = {
  id: string;
  name: string;
  date: string;
  attendees: number;
  status: "Upcoming" | "Ongoing" | "Completed";
};

export type ScanLog = {
  id: string;
  memberId: string;
  name: string;
  time: string;
  type: "IN" | "OUT";
  event: string;
};

export const initialMembers: Member[] = [
  { id: "2025-00101", name: "Juan Dela Cruz", year: "2nd Year", course: "BS Medical Technology", email: "juandelacruz@phs.edu.ph", contact: "0912 345 6789", status: "Active", payment: "PAID", attended: 12, missed: 1 },
  { id: "2025-00102", name: "Maria Santos", year: "3rd Year", course: "BS Medical Technology", email: "msantos@phs.edu.ph", contact: "0917 222 3344", status: "Active", payment: "PAID", attended: 11, missed: 2 },
  { id: "2025-00103", name: "Kyle Villanueva", year: "2nd Year", course: "BS Medical Technology", email: "kylev@phs.edu.ph", contact: "0998 765 4321", status: "Active", payment: "PAID", attended: 10, missed: 3 },
  { id: "2025-00104", name: "Anne Reyes", year: "4th Year", course: "BS Medical Technology", email: "areyes@phs.edu.ph", contact: "0915 111 2222", status: "Inactive", payment: "UNPAID", attended: 4, missed: 9 },
  { id: "2025-00105", name: "John Lorenz", year: "1st Year", course: "BS Medical Technology", email: "jlorenz@phs.edu.ph", contact: "0922 333 4455", status: "Active", payment: "PAID", attended: 9, missed: 4 },
  { id: "2025-00106", name: "Bea Aquino", year: "3rd Year", course: "BS Medical Technology", email: "baquino@phs.edu.ph", contact: "0933 444 5566", status: "Inactive", payment: "UNPAID", attended: 3, missed: 10 },
  { id: "2025-00107", name: "Mark Tan", year: "2nd Year", course: "BS Medical Technology", email: "mtan@phs.edu.ph", contact: "0945 666 7788", status: "Active", payment: "PAID", attended: 8, missed: 5 },
];

export const initialEvents: Event[] = [
  { id: "E001", name: "General Assembly", date: "May 26, 2026", attendees: 156, status: "Ongoing" },
  { id: "E002", name: "Leadership Training", date: "May 30, 2026", attendees: 0, status: "Upcoming" },
  { id: "E003", name: "Outreach Program", date: "Jun 05, 2026", attendees: 0, status: "Upcoming" },
  { id: "E004", name: "Medical Mission", date: "Apr 20, 2026", attendees: 134, status: "Completed" },
  { id: "E005", name: "Blood Donation Drive", date: "Apr 05, 2026", attendees: 98, status: "Completed" },
  { id: "E006", name: "Health Symposium", date: "Mar 15, 2026", attendees: 142, status: "Completed" },
];

export const initialScans: ScanLog[] = [
  { id: "S1", memberId: "2025-00101", name: "Juan Dela Cruz", time: "9:15 AM", type: "IN", event: "General Assembly" },
  { id: "S2", memberId: "2025-00102", name: "Maria Santos", time: "9:14 AM", type: "IN", event: "General Assembly" },
  { id: "S3", memberId: "2025-00103", name: "Kyle Villanueva", time: "9:13 AM", type: "IN", event: "General Assembly" },
  { id: "S4", memberId: "2025-00104", name: "Anne Reyes", time: "9:12 AM", type: "IN", event: "General Assembly" },
  { id: "S5", memberId: "2025-00105", name: "John Lorenz", time: "9:10 AM", type: "IN", event: "General Assembly" },
];

export const pendingSignups = [
  { id: "P1", name: "Diana Cruz", email: "dcruz@phs.edu.ph", position: "Secretary", requested: "May 24, 2026" },
  { id: "P2", name: "Paolo Mendoza", email: "pmendoza@phs.edu.ph", position: "Treasurer", requested: "May 25, 2026" },
];
