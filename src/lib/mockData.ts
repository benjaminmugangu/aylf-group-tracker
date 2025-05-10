// src/lib/mockData.ts
import type { User, Activity, Member, Report, Site, SmallGroup } from "@/lib/types";
import { ROLES } from "@/lib/constants";

export const mockUsers: User[] = [
  { id: "user_nat_1", name: "Alice National", email: "alice@aylf.org", role: ROLES.NATIONAL_COORDINATOR },
  { id: "user_site_1", name: "Bob Site", email: "bob@aylf.org", role: ROLES.SITE_COORDINATOR, siteId: "site_1" },
  { id: "user_sg_1", name: "Charlie Group", email: "charlie@aylf.org", role: ROLES.SMALL_GROUP_LEADER, siteId: "site_1", smallGroupId: "sg_1" },
  { id: "user_site_2", name: "Diana SiteLead", email: "diana@aylf.org", role: ROLES.SITE_COORDINATOR, siteId: "site_2" },
  { id: "user_sg_2", name: "Eve GroupLead", email: "eve@aylf.org", role: ROLES.SMALL_GROUP_LEADER, siteId: "site_2", smallGroupId: "sg_3" },
];

export const mockSites: Site[] = [
  { id: "site_1", name: "Nairobi Central Site", coordinatorId: "user_site_1" },
  { id: "site_2", name: "Mombasa Coastal Site", coordinatorId: "user_site_2" },
  { id: "site_3", name: "Kisumu Lakefront Site", coordinatorId: "user_nat_1" }, // National might oversee a site directly too
];

export const mockSmallGroups: SmallGroup[] = [
  { id: "sg_1", name: "Alpha Group", siteId: "site_1", leaderId: "user_sg_1" },
  { id: "sg_2", name: "Beta Group", siteId: "site_1", leaderId: "user_site_1" }, // Site coordinator might lead a group
  { id: "sg_3", name: "Gamma Group", siteId: "site_2", leaderId: "user_sg_2" },
  { id: "sg_4", name: "Delta Group", siteId: "site_2", leaderId: "user_site_2" },
];

export const mockActivities: Activity[] = [
  { id: "act_1", name: "Leadership Workshop", description: "National leadership training.", date: "2024-08-15", status: "planned", level: "national", participantsCount: 150 },
  { id: "act_2", name: "Community Outreach", description: "Site 1 local community service.", date: "2024-07-20", status: "executed", level: "site", siteId: "site_1", participantsCount: 45 },
  { id: "act_3", name: "Book Study: 'Purpose Driven Life'", description: "Alpha Group weekly study.", date: "2024-07-28", status: "executed", level: "small_group", smallGroupId: "sg_1", participantsCount: 12 },
  { id: "act_4", name: "Mentorship Program Launch", description: "Site 2 mentorship initiative.", date: "2024-09-01", status: "planned", level: "site", siteId: "site_2", participantsCount: 60 },
  { id: "act_5", name: "Annual Youth Conference", description: "National gathering for all youth.", date: "2023-12-10", status: "executed", level: "national", participantsCount: 500 },
  { id: "act_6", name: "Sports Day", description: "Site 1 inter-group sports event.", date: "2023-11-05", status: "executed", level: "site", siteId: "site_1", participantsCount: 80 },
  { id: "act_7", name: "Prayer Breakfast", description: "Gamma Group monthly meeting.", date: "2024-07-10", status: "cancelled", level: "small_group", smallGroupId: "sg_3", participantsCount: 8 },
];

export const mockMembers: Member[] = [
  { id: "mem_1", name: "John Doe", type: "student", siteId: "site_1", smallGroupId: "sg_1", joinDate: "2023-01-15" },
  { id: "mem_2", name: "Jane Smith", type: "non-student", siteId: "site_1", smallGroupId: "sg_1", joinDate: "2022-11-20" },
  { id: "mem_3", name: "Mike Brown", type: "student", siteId: "site_1", smallGroupId: "sg_2", joinDate: "2023-03-10" },
  { id: "mem_4", name: "Sarah Wilson", type: "student", siteId: "site_2", smallGroupId: "sg_3", joinDate: "2023-02-01" },
  { id: "mem_5", name: "David Lee", type: "non-student", siteId: "site_2", smallGroupId: "sg_4", joinDate: "2023-05-05" },
  { id: "mem_6", name: "Emily White", type: "student", siteId: "site_2", smallGroupId: "sg_3", joinDate: "2024-01-10" },
  { id: "mem_7", name: "Chris Green", type: "student", siteId: "site_1", smallGroupId: "sg_2", joinDate: "2024-03-20" },
];

export const mockReports: Report[] = [
  { 
    id: "rep_1", 
    title: "Q2 Leadership Workshop Summary", 
    submittedBy: "user_nat_1", 
    submissionDate: "2024-07-01", 
    level: "national", 
    content: "The Q2 leadership workshop was a success with high engagement.", 
    images: [{ name: "workshop_group.jpg", url: "https://picsum.photos/seed/workshop/400/300" }],
    financialSummary: "Total expenses: $500. Income from registration: $200."
  },
  { 
    id: "rep_2", 
    title: "July Community Outreach Report - Site 1", 
    submittedBy: "user_site_1", 
    submissionDate: "2024-07-22", 
    level: "site", 
    siteId: "site_1", 
    content: "Reached 50 families, distributed food packs. Positive feedback received.",
    images: [{ name: "outreach_team.jpg", url: "https://picsum.photos/seed/outreach/400/300" }, { name: "beneficiaries.jpg", url: "https://picsum.photos/seed/beneficiaries/400/300" }],
    financialSummary: "Donations received: $300. Expenses for supplies: $250."
  },
  { 
    id: "rep_3", 
    title: "Alpha Group July Book Study Progress", 
    submittedBy: "user_sg_1", 
    submissionDate: "2024-07-29", 
    level: "small_group", 
    smallGroupId: "sg_1", 
    content: "Completed first 5 chapters. Rich discussions on purpose and identity.",
    financialSummary: "No financial activity this period."
  },
];


export const historicalDataExample = `
Past Activities:
- Annual Youth Conference (Dec 2023): 500 attendees, feedback 4.5/5 stars. Topics: Leadership, Faith, Community. Resources: Guest speakers, workshops.
- Regional Sports Tournament (Oct 2023): 120 participants from 3 sites. Feedback 4.2/5. Resources: Sports equipment, volunteer referees.
- Online Bible Study Series (Q1 2024): Avg 80 participants per session. Feedback 4.0/5. Resources: Zoom, study guides.
- Site A - Mentorship Program (Ongoing): 30 mentor-mentee pairs. Feedback 4.8/5. Resources: Training materials for mentors.
- Small Group Alpha - Local Charity Drive (May 2024): 15 members participated. Raised $200 for children's home. Feedback: Highly positive.
`;

export const currentTrendsExample = `
Current Trends:
- Increased interest in mental health and well-being workshops.
- Popularity of short-form video content for engagement and event promotion.
- Demand for hybrid events (online and in-person components).
- Growing focus on practical skills development (e.g., coding, entrepreneurship, public speaking).
- Gamification in learning and team-building activities.
`;

export const groupPreferencesExample = `
Group Preferences (Optional):
- Target age group: 15-25 years.
- Interests: Spiritual growth, leadership development, community service, technology.
- Constraints: Limited budget for large-scale events. Preference for activities that can be replicated across different sites.
- Location: Primarily urban and peri-urban settings.
`;
