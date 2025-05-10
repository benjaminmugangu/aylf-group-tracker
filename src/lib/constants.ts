import type { NavItem, Role } from "@/lib/types";
import { LayoutDashboard, Activity, Users, FileText, Lightbulb, Building, Settings, UsersRound, Briefcase } from "lucide-react";

export const ROLES: Record<string, Role> = {
  NATIONAL_COORDINATOR: "national_coordinator",
  SITE_COORDINATOR: "site_coordinator",
  SMALL_GROUP_LEADER: "small_group_leader",
  GUEST: "guest",
};

export const NAVIGATION_LINKS: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    allowedRoles: [ROLES.NATIONAL_COORDINATOR, ROLES.SITE_COORDINATOR, ROLES.SMALL_GROUP_LEADER],
  },
  {
    href: "/dashboard/activities",
    label: "Activities",
    icon: Activity,
    allowedRoles: [ROLES.NATIONAL_COORDINATOR, ROLES.SITE_COORDINATOR, ROLES.SMALL_GROUP_LEADER],
  },
  {
    href: "/dashboard/members",
    label: "Members",
    icon: Users,
    allowedRoles: [ROLES.NATIONAL_COORDINATOR, ROLES.SITE_COORDINATOR, ROLES.SMALL_GROUP_LEADER],
  },
  {
    label: "Reports",
    icon: FileText,
    allowedRoles: [ROLES.NATIONAL_COORDINATOR, ROLES.SITE_COORDINATOR, ROLES.SMALL_GROUP_LEADER],
    href: "/dashboard/reports", // Main href for parent item, can be first child's href or a dedicated overview
    children: [
      {
        href: "/dashboard/reports/submit",
        label: "Submit Report",
        icon: FileText, 
        allowedRoles: [ROLES.NATIONAL_COORDINATOR, ROLES.SITE_COORDINATOR, ROLES.SMALL_GROUP_LEADER],
      },
      {
        href: "/dashboard/reports/view",
        label: "View Reports",
        icon: FileText, 
        allowedRoles: [ROLES.NATIONAL_COORDINATOR, ROLES.SITE_COORDINATOR, ROLES.SMALL_GROUP_LEADER],
      },
    ],
  },
  {
    href: "/dashboard/suggestions",
    label: "AI Suggestions",
    icon: Lightbulb,
    allowedRoles: [ROLES.NATIONAL_COORDINATOR], 
  },
  {
    href: "/dashboard/sites",
    label: "Manage Sites", // This will now list sites, and clicking a site goes to its details (including SGs)
    icon: Building,
    allowedRoles: [ROLES.NATIONAL_COORDINATOR, ROLES.SITE_COORDINATOR], // Site coordinators might see their own site details
  },
  {
    href: "/dashboard/users",
    label: "Manage Users",
    icon: UsersRound,
    allowedRoles: [ROLES.NATIONAL_COORDINATOR],
  },
   {
    href: "/dashboard/finances",
    label: "Finances",
    icon: Briefcase, 
    allowedRoles: [ROLES.NATIONAL_COORDINATOR],
  },
];

export const APP_NAME = "AYLF Small Group Tracker";
