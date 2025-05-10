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
  participantsCount?: number; // Expected or actual participants if directly tied to activity record
  imageUrl?: string; 
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
  activityDate: string; // Date of the activity itself
  submittedBy: string; // User ID
  submissionDate: string; // ISO date string
  level: "national" | "site" | "small_group";
  siteId?: string;
  smallGroupId?: string;
  activityType: string; // e.g., "Small Group Meeting", "Workshop", "Conference"
  thematic: string;
  speaker?: string; 
  moderator?: string;
  girlsCount?: number;
  boysCount?: number;
  participantsCountReported?: number; // Derived from girlsCount + boysCount for this specific report
  amountUsed?: number;
  currency?: string; // e.g., "USD", "CDF"
  content: string; // Main narrative/description of the report
  images?: Array<{ name: string; url: string }>; 
  financialSummary?: string; // Optional: for more detailed financial notes beyond amountUsed
}

export interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  allowedRoles: Role[];
  children?: NavItem[];
  filterKey?: string; 
  filterValue?: string;
}

export interface StatCardData {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
  href?: string;
  filterKey?: string; 
  filterValue?: string;
}

export interface Transaction {
  id: string;
  date: string; // ISO date string
  amount: number; // Always positive
  description: string;
  transactionType: 'transfer' | 'expense' | 'income_source'; 
  
  senderEntityType: 'national' | 'site' | 'small_group' | 'external_donor';
  senderEntityId: string; 
  senderEntityName?: string; 

  recipientEntityType: 'national' | 'site' | 'small_group' | 'vendor' | 'beneficiary' | 'other';
  recipientEntityId: string; 
  recipientEntityName?: string;

  level: 'national' | 'site' | 'small_group'; 
  relatedSiteId?: string; 
  relatedSmallGroupId?: string; 
}
