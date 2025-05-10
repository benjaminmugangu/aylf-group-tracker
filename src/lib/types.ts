export type Role = "national_coordinator" | "site_coordinator" | "small_group_leader" | "guest";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  siteId?: string;
  smallGroupId?: string;
}

export interface Site {
  id: string;
  name:string;
  coordinatorId: string;
}

export interface SmallGroup {
  id: string;
  name: string;
  siteId: string;
  leaderId: string;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  date: string; // ISO date string
  status: "planned" | "executed" | "cancelled";
  level: "national" | "site" | "small_group";
  siteId?: string;
  smallGroupId?: string;
  participantsCount?: number;
}

export interface Member {
  id: string;
  name: string;
  type: "student" | "non-student";
  siteId?: string;
  smallGroupId?: string;
  joinDate: string; // ISO date string
}

export interface Report {
  id: string;
  title: string;
  submittedBy: string; // User ID
  submissionDate: string; // ISO date string
  level: "national" | "site" | "small_group";
  siteId?: string;
  smallGroupId?: string;
  content: string; // Text content of the report
  images?: Array<{ name: string; url: string }>; // Mocked image data
  financialSummary?: string;
}

export interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  allowedRoles: Role[];
  children?: NavItem[];
}

export interface StatCardData {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
  href?: string; // Added href for clickability
}

