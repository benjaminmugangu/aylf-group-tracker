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
  imageUrl?: string; // Added for activity image
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
  filterKey?: string; // For filtering views, e.g. activities by status
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
  transactionType: 'transfer' | 'expense' | 'income_source'; // 'transfer' between internal entities, 'expense' to external, 'income_source' from external
  
  senderEntityType: 'national' | 'site' | 'small_group' | 'external_donor';
  senderEntityId: string; 
  senderEntityName?: string; 

  recipientEntityType: 'national' | 'site' | 'small_group' | 'vendor' | 'beneficiary' | 'other';
  recipientEntityId: string; 
  recipientEntityName?: string;

  // For easier filtering and context
  level: 'national' | 'site' | 'small_group'; // The level this transaction is primarily associated with or initiated from
  relatedSiteId?: string; // If related to a specific site (either sender or recipient)
  relatedSmallGroupId?: string; // If related to a specific small group (either sender or recipient)
}

