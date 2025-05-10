// src/lib/mockData.ts
import type { User, Activity, Member, Report, Site, SmallGroup, Transaction } from "@/lib/types";
import { ROLES } from "@/lib/constants";

export const mockUsers: User[] = [
  { id: "user_nat_1", name: "Alice National", email: "alice@aylf.org", role: ROLES.NATIONAL_COORDINATOR },
  { id: "user_site_beni", name: "Coordinator Beni", email: "beni@aylf.org", role: ROLES.SITE_COORDINATOR, siteId: "site_beni" },
  { id: "user_sg_beni_alumni", name: "Leader Beni Alumni", email: "beni.alumni@aylf.org", role: ROLES.SMALL_GROUP_LEADER, siteId: "site_beni", smallGroupId: "sg_beni_alumni" },
  { id: "user_site_bukavu", name: "Coordinator Bukavu", email: "bukavu@aylf.org", role: ROLES.SITE_COORDINATOR, siteId: "site_bukavu" },
  { id: "user_sg_bukavu_alumni", name: "Leader Bukavu Alumni", email: "bukavu.alumni@aylf.org", role: ROLES.SMALL_GROUP_LEADER, siteId: "site_bukavu", smallGroupId: "sg_bukavu_alumni" },
  { id: "user_site_bunia", name: "Coordinator Bunia", email: "bunia@aylf.org", role: ROLES.SITE_COORDINATOR, siteId: "site_bunia" },
  { id: "user_sg_bunia_alumni", name: "Leader Bunia Alumni", email: "bunia.alumni@aylf.org", role: ROLES.SMALL_GROUP_LEADER, siteId: "site_bunia", smallGroupId: "sg_bunia_alumni" },
  { id: "user_site_butembo", name: "Coordinator Butembo", email: "butembo@aylf.org", role: ROLES.SITE_COORDINATOR, siteId: "site_butembo" },
  { id: "user_sg_butembo_alumni", name: "Leader Butembo Alumni", email: "butembo.alumni@aylf.org", role: ROLES.SMALL_GROUP_LEADER, siteId: "site_butembo", smallGroupId: "sg_butembo_alumni" },
  { id: "user_site_goma", name: "Coordinator Goma", email: "goma@aylf.org", role: ROLES.SITE_COORDINATOR, siteId: "site_goma" },
  { id: "user_sg_goma_alumni", name: "Leader Goma Alumni", email: "goma.alumni@aylf.org", role: ROLES.SMALL_GROUP_LEADER, siteId: "site_goma", smallGroupId: "sg_goma_alumni" },
  { id: "user_site_kalemie", name: "Coordinator Kalemie", email: "kalemie@aylf.org", role: ROLES.SITE_COORDINATOR, siteId: "site_kalemie" },
  { id: "user_sg_kalemie_alumni", name: "Leader Kalemie Alumni", email: "kalemie.alumni@aylf.org", role: ROLES.SMALL_GROUP_LEADER, siteId: "site_kalemie", smallGroupId: "sg_kalemie_alumni" },
  { id: "user_site_kinshasa", name: "Coordinator Kinshasa", email: "kinshasa@aylf.org", role: ROLES.SITE_COORDINATOR, siteId: "site_kinshasa" },
  { id: "user_sg_kinshasa_alumni", name: "Leader Kinshasa Alumni", email: "kinshasa.alumni@aylf.org", role: ROLES.SMALL_GROUP_LEADER, siteId: "site_kinshasa", smallGroupId: "sg_kinshasa_alumni" },
  { id: "user_site_kisangani", name: "Coordinator Kisangani", email: "kisangani@aylf.org", role: ROLES.SITE_COORDINATOR, siteId: "site_kisangani"},
  { id: "user_sg_kisangani_alumni", name: "Leader Kisangani Alumni", email: "kisangani.alumni@aylf.org", role: ROLES.SMALL_GROUP_LEADER, siteId: "site_kisangani", smallGroupId: "sg_kisangani_alumni" },
  { id: "user_site_kolwezi", name: "Coordinator Kolwezi", email: "kolwezi@aylf.org", role: ROLES.SITE_COORDINATOR, siteId: "site_kolwezi"},
  { id: "user_sg_kolwezi_alumni", name: "Leader Kolwezi Alumni", email: "kolwezi.alumni@aylf.org", role: ROLES.SMALL_GROUP_LEADER, siteId: "site_kolwezi", smallGroupId: "sg_kolwezi_alumni" },
  { id: "user_site_lubumbashi", name: "Coordinator Lubumbashi", email: "lubumbashi@aylf.org", role: ROLES.SITE_COORDINATOR, siteId: "site_lubumbashi" },
  { id: "user_sg_lubumbashi_alumni", name: "Leader Lubumbashi Alumni", email: "lubumbashi.alumni@aylf.org", role: ROLES.SMALL_GROUP_LEADER, siteId: "site_lubumbashi", smallGroupId: "sg_lubumbashi_alumni" },
  { id: "user_site_uvira", name: "Coordinator Uvira", email: "uvira@aylf.org", role: ROLES.SITE_COORDINATOR, siteId: "site_uvira" },
  { id: "user_sg_uvira_alumni", name: "Leader Uvira Alumni", email: "uvira.alumni@aylf.org", role: ROLES.SMALL_GROUP_LEADER, siteId: "site_uvira", smallGroupId: "sg_uvira_alumni" },
];

export const mockSites: Site[] = [
  { id: "site_beni", name: "Beni", coordinatorId: "user_site_beni" },
  { id: "site_bukavu", name: "Bukavu", coordinatorId: "user_site_bukavu" },
  { id: "site_bunia", name: "Bunia", coordinatorId: "user_site_bunia" },
  { id: "site_butembo", name: "Butembo", coordinatorId: "user_site_butembo" },
  { id: "site_goma", name: "Goma", coordinatorId: "user_site_goma" },
  { id: "site_kalemie", name: "Kalemie", coordinatorId: "user_site_kalemie" },
  { id: "site_kinshasa", name: "Kinshasa", coordinatorId: "user_site_kinshasa" },
  { id: "site_kisangani", name: "Kisangani", coordinatorId: "user_site_kisangani"},
  { id: "site_kolwezi", name: "Kolwezi", coordinatorId: "user_site_kolwezi"},
  { id: "site_lubumbashi", name: "Lubumbashi", coordinatorId: "user_site_lubumbashi" },
  { id: "site_uvira", name: "Uvira", coordinatorId: "user_site_uvira" },
];

export const mockSmallGroups: SmallGroup[] = [
  // Beni
  { id: "sg_beni_alumni", name: "ALUMNI", siteId: "site_beni", leaderId: "user_sg_beni_alumni" },
  { id: "sg_beni_isc", name: "ISC", siteId: "site_beni", leaderId: "user_site_beni" },
  { id: "sg_beni_uac", name: "UAC", siteId: "site_beni", leaderId: "user_site_beni" },
  { id: "sg_beni_ucbc", name: "UCBC", siteId: "site_beni", leaderId: "user_site_beni" },
  { id: "sg_beni_uos", name: "UOS", siteId: "site_beni", leaderId: "user_site_beni" },
  // Bukavu
  { id: "sg_bukavu_alumni", name: "ALUMNI", siteId: "site_bukavu", leaderId: "user_sg_bukavu_alumni" },
  { id: "sg_bukavu_isdr", name: "ISDR", siteId: "site_bukavu", leaderId: "user_site_bukavu" },
  { id: "sg_bukavu_isp", name: "ISP", siteId: "site_bukavu", leaderId: "user_site_bukavu" },
  { id: "sg_bukavu_uea", name: "UEA", siteId: "site_bukavu", leaderId: "user_site_bukavu" },
  { id: "sg_bukavu_isecof", name: "ISECOF", siteId: "site_bukavu", leaderId: "user_site_bukavu" },
  { id: "sg_bukavu_uob", name: "UOB", siteId: "site_bukavu", leaderId: "user_site_bukavu" },
  // Bunia
  { id: "sg_bunia_alumni", name: "ALUMNI", siteId: "site_bunia", leaderId: "user_sg_bunia_alumni" },
  { id: "sg_bunia_unibu", name: "UNIBU", siteId: "site_bunia", leaderId: "user_site_bunia" },
  { id: "sg_bunia_unshalom", name: "UN.SHALOM", siteId: "site_bunia", leaderId: "user_site_bunia" },
  // Butembo
  { id: "sg_butembo_alumni", name: "ALUMNI", siteId: "site_butembo", leaderId: "user_sg_butembo_alumni" },
  { id: "sg_butembo_uac", name: "UAC", siteId: "site_butembo", leaderId: "user_site_butembo" },
  { id: "sg_butembo_ucg", name: "UCG", siteId: "site_butembo", leaderId: "user_site_butembo" },
  { id: "sg_butembo_uor", name: "UOR", siteId: "site_butembo", leaderId: "user_site_butembo" },
  // Goma
  { id: "sg_goma_alumni", name: "ALUMNI", siteId: "site_goma", leaderId: "user_sg_goma_alumni" },
  { id: "sg_goma_isig", name: "ISIG", siteId: "site_goma", leaderId: "user_site_goma" },
  { id: "sg_goma_ucs", name: "UCS", siteId: "site_goma", leaderId: "user_site_goma" },
  { id: "sg_goma_ulpgl", name: "ULPGL", siteId: "site_goma", leaderId: "user_site_goma" },
  { id: "sg_goma_unigom", name: "UNIGOM", siteId: "site_goma", leaderId: "user_site_goma" },
  { id: "sg_goma_unim", name: "UNIM", siteId: "site_goma", leaderId: "user_site_goma" },
  // Kalemie
  { id: "sg_kalemie_alumni", name: "ALUMNI", siteId: "site_kalemie", leaderId: "user_sg_kalemie_alumni" },
  { id: "sg_kalemie_isp", name: "ISP", siteId: "site_kalemie", leaderId: "user_site_kalemie" },
  { id: "sg_kalemie_istm", name: "ISTM", siteId: "site_kalemie", leaderId: "user_site_kalemie" },
  { id: "sg_kalemie_isss", name: "ISSS", siteId: "site_kalemie", leaderId: "user_site_kalemie" },
  { id: "sg_kalemie_unikal", name: "UNIKAL", siteId: "site_kalemie", leaderId: "user_site_kalemie" },
  // Kinshasa
  { id: "sg_kinshasa_alumni", name: "ALUMNI", siteId: "site_kinshasa", leaderId: "user_sg_kinshasa_alumni" },
  { id: "sg_kinshasa_unikin", name: "UNIKIN", siteId: "site_kinshasa", leaderId: "user_site_kinshasa" },
  { id: "sg_kinshasa_unimkin", name: "UNIM/Kin", siteId: "site_kinshasa", leaderId: "user_site_kinshasa" },
  // Kisangani
  { id: "sg_kisangani_alumni", name: "ALUMNI", siteId: "site_kisangani", leaderId: "user_sg_kisangani_alumni" },
  { id: "sg_kisangani_unikis", name: "UNIKIS", siteId: "site_kisangani", leaderId: "user_site_kisangani"},
  { id: "sg_kisangani_upc", name: "UPC", siteId: "site_kisangani", leaderId: "user_site_kisangani"},
  // Kolwezi
  { id: "sg_kolwezi_alumni", name: "ALUMNI", siteId: "site_kolwezi", leaderId: "user_sg_kolwezi_alumni" },
  { id: "sg_kolwezi_unikol", name: "UNIKOL", siteId: "site_kolwezi", leaderId: "user_site_kolwezi" },
  // Lubumbashi
  { id: "sg_lubumbashi_alumni", name: "ALUMNI", siteId: "site_lubumbashi", leaderId: "user_sg_lubumbashi_alumni" },
  { id: "sg_lubumbashi_unilu", name: "UNILU", siteId: "site_lubumbashi", leaderId: "user_site_lubumbashi" },
  // Uvira
  { id: "sg_uvira_alumni", name: "ALUMNI", siteId: "site_uvira", leaderId: "user_sg_uvira_alumni" },
  { id: "sg_uvira_isc", name: "ISC", siteId: "site_uvira", leaderId: "user_site_uvira" },
  { id: "sg_uvira_isdr", name: "ISDR", siteId: "site_uvira", leaderId: "user_site_uvira" },
  { id: "sg_uvira_isp", name: "ISP", siteId: "site_uvira", leaderId: "user_site_uvira" },
  { id: "sg_uvira_istm", name: "ISTM", siteId: "site_uvira", leaderId: "user_site_uvira" },
  { id: "sg_uvira_undt", name: "UNDT", siteId: "site_uvira", leaderId: "user_site_uvira" },
];

export const mockActivities: Activity[] = [
  { id: "act_1", name: "Leadership Workshop", description: "National leadership training.", date: "2024-08-15", status: "planned", level: "national", participantsCount: 150 },
  { id: "act_2", name: "Community Outreach", description: "Beni site local community service.", date: "2024-07-20", status: "executed", level: "site", siteId: "site_beni", participantsCount: 45 },
  { id: "act_3", name: "Book Study: 'Purpose Driven Life'", description: "Beni Alumni Group weekly study.", date: "2024-07-28", status: "executed", level: "small_group", smallGroupId: "sg_beni_alumni", participantsCount: 12 },
  { id: "act_4", name: "Mentorship Program Launch", description: "Bukavu site mentorship initiative.", date: "2024-09-01", status: "planned", level: "site", siteId: "site_bukavu", participantsCount: 60 },
  { id: "act_5", name: "Annual Youth Conference", description: "National gathering for all youth.", date: "2023-12-10", status: "executed", level: "national", participantsCount: 500 },
  { id: "act_6", name: "Sports Day", description: "Goma site inter-group sports event.", date: "2023-11-05", status: "executed", level: "site", siteId: "site_goma", participantsCount: 80 },
  { id: "act_7", name: "Prayer Breakfast", description: "Kinshasa UNIKIN Group monthly meeting.", date: "2024-07-10", status: "cancelled", level: "small_group", smallGroupId: "sg_kinshasa_unikin", participantsCount: 8 },
];

export const mockMembers: Member[] = [
  { id: "mem_1", name: "John Doe", type: "student", siteId: "site_beni", smallGroupId: "sg_beni_isc", joinDate: "2023-01-15" },
  { id: "mem_2", name: "Jane Smith", type: "non-student", siteId: "site_bukavu", smallGroupId: "sg_bukavu_alumni", joinDate: "2022-11-20" },
  { id: "mem_3", name: "Mike Brown", type: "student", siteId: "site_goma", smallGroupId: "sg_goma_isig", joinDate: "2023-03-10" },
  { id: "mem_4", name: "Sarah Wilson", type: "student", siteId: "site_uvira", smallGroupId: "sg_uvira_isp", joinDate: "2023-02-01" },
  { id: "mem_5", name: "David Lee", type: "non-student", siteId: "site_kinshasa", smallGroupId: "sg_kinshasa_alumni", joinDate: "2023-05-05" },
  { id: "mem_6", name: "Emily White", type: "student", siteId: "site_butembo", smallGroupId: "sg_butembo_uac", joinDate: "2024-01-10" },
  { id: "mem_7", name: "Chris Green", type: "student", siteId: "site_kalemie", smallGroupId: "sg_kalemie_unikal", joinDate: "2024-03-20" },
];

export const mockReports: Report[] = [
  { 
    id: "rep_1", 
    title: "Q2 Leadership Workshop Summary", 
    submittedBy: "user_nat_1", 
    submissionDate: "2024-07-01", 
    level: "national", 
    content: "The Q2 leadership workshop was a success with high engagement.", 
    images: [{ name: "workshop_group.jpg", url: "https://picsum.photos/seed/workshop1/400/300" }],
    financialSummary: "Total expenses: $500. Income from registration: $200."
  },
  { 
    id: "rep_2", 
    title: "July Community Outreach Report - Beni", 
    submittedBy: "user_site_beni", 
    submissionDate: "2024-07-22", 
    level: "site", 
    siteId: "site_beni", 
    content: "Reached 50 families, distributed food packs. Positive feedback received.",
    images: [
        { name: "outreach_team.jpg", url: "https://picsum.photos/seed/outreach1/400/300" }, 
        { name: "beneficiaries.jpg", url: "https://picsum.photos/seed/beneficiaries1/400/300" }
    ],
    financialSummary: "Donations received: $300. Expenses for supplies: $250."
  },
  { 
    id: "rep_3", 
    title: "Beni Alumni July Book Study Progress", 
    submittedBy: "user_sg_beni_alumni", 
    submissionDate: "2024-07-29", 
    level: "small_group", 
    smallGroupId: "sg_beni_alumni", 
    content: "Completed first 5 chapters. Rich discussions on purpose and identity.",
    images: [{ name: "book_study.jpg", url: "https://picsum.photos/seed/bookstudy/400/300" }],
    financialSummary: "No financial activity this period."
  },
];


export const historicalDataExample = `
Past Activities:
- Annual Youth Conference (Dec 2023): 500 attendees, feedback 4.5/5 stars. Topics: Leadership, Faith, Community. Resources: Guest speakers, workshops.
- Regional Sports Tournament (Oct 2023): 120 participants from 3 sites. Feedback 4.2/5. Resources: Sports equipment, volunteer referees.
- Online Bible Study Series (Q1 2024): Avg 80 participants per session. Feedback 4.0/5. Resources: Zoom, study guides.
- Site Beni - Mentorship Program (Ongoing): 30 mentor-mentee pairs. Feedback 4.8/5. Resources: Training materials for mentors.
- Small Group Beni Alumni - Local Charity Drive (May 2024): 15 members participated. Raised $200 for children's home. Feedback: Highly positive.
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
- Location: Primarily urban and peri-urban settings in Beni, Bukavu, Goma.
`;

export const mockTransactions: Transaction[] = [
  // National Income
  { id: 'txn_nat_inc_1', date: '2024-06-01', amount: 10000, description: 'Grant from XYZ Foundation', transactionType: 'income_source', senderEntityType: 'external_donor', senderEntityId: 'donor_xyz', senderEntityName: 'XYZ Foundation', recipientEntityType: 'national', recipientEntityId: 'aylf_national', recipientEntityName: 'AYLF National', level: 'national' },
  { id: 'txn_nat_inc_2', date: '2024-06-15', amount: 5000, description: 'General Donations Q2', transactionType: 'income_source', senderEntityType: 'external_donor', senderEntityId: 'donors_general', senderEntityName: 'Various Donors', recipientEntityType: 'national', recipientEntityId: 'aylf_national', recipientEntityName: 'AYLF National', level: 'national' },
  
  // National to Site Transfers
  { id: 'txn_nat_site_beni_1', date: '2024-07-01', amount: 2000, description: 'Q3 Budget for Site Beni', transactionType: 'transfer', senderEntityType: 'national', senderEntityId: 'aylf_national', senderEntityName: 'AYLF National', recipientEntityType: 'site', recipientEntityId: 'site_beni', recipientEntityName: 'Site Beni', level: 'national', relatedSiteId: 'site_beni' },
  { id: 'txn_nat_site_bukavu_1', date: '2024-07-01', amount: 1800, description: 'Q3 Budget for Site Bukavu', transactionType: 'transfer', senderEntityType: 'national', senderEntityId: 'aylf_national', senderEntityName: 'AYLF National', recipientEntityType: 'site', recipientEntityId: 'site_bukavu', recipientEntityName: 'Site Bukavu', level: 'national', relatedSiteId: 'site_bukavu' },
  { id: 'txn_nat_site_goma_1', date: '2024-07-02', amount: 2200, description: 'Special Project Funding Goma', transactionType: 'transfer', senderEntityType: 'national', senderEntityId: 'aylf_national', senderEntityName: 'AYLF National', recipientEntityType: 'site', recipientEntityId: 'site_goma', recipientEntityName: 'Site Goma', level: 'national', relatedSiteId: 'site_goma' },

  // National Expenses
  { id: 'txn_nat_exp_1', date: '2024-07-05', amount: 1200, description: 'National Conference Venue Booking', transactionType: 'expense', senderEntityType: 'national', senderEntityId: 'aylf_national', senderEntityName: 'AYLF National', recipientEntityType: 'vendor', recipientEntityId: 'venue_conf_center', recipientEntityName: 'Capital Conference Center', level: 'national' },
  { id: 'txn_nat_exp_2', date: '2024-07-10', amount: 300, description: 'Website Hosting Fees', transactionType: 'expense', senderEntityType: 'national', senderEntityId: 'aylf_national', senderEntityName: 'AYLF National', recipientEntityType: 'vendor', recipientEntityId: 'host_co_123', recipientEntityName: 'Web Services Inc.', level: 'national' },
  
  // Site Beni to Small Group Transfers
  { id: 'txn_site_beni_sg_alumni_1', date: '2024-07-10', amount: 150, description: 'Activity support for Alumni SG', transactionType: 'transfer', senderEntityType: 'site', senderEntityId: 'site_beni', senderEntityName: 'Site Beni', recipientEntityType: 'small_group', recipientEntityId: 'sg_beni_alumni', recipientEntityName: 'Beni Alumni SG', level: 'site', relatedSiteId: 'site_beni', relatedSmallGroupId: 'sg_beni_alumni' },
  { id: 'txn_site_beni_sg_isc_1', date: '2024-07-11', amount: 100, description: 'Materials for ISC SG workshop', transactionType: 'transfer', senderEntityType: 'site', senderEntityId: 'site_beni', senderEntityName: 'Site Beni', recipientEntityType: 'small_group', recipientEntityId: 'sg_beni_isc', recipientEntityName: 'Beni ISC SG', level: 'site', relatedSiteId: 'site_beni', relatedSmallGroupId: 'sg_beni_isc' },

  // Site Beni Expenses
  { id: 'txn_site_beni_exp_1', date: '2024-07-15', amount: 80, description: 'Printing for Site Workshop', transactionType: 'expense', senderEntityType: 'site', senderEntityId: 'site_beni', senderEntityName: 'Site Beni', recipientEntityType: 'vendor', recipientEntityId: 'beni_print_shop', recipientEntityName: 'Beni Print Services', level: 'site', relatedSiteId: 'site_beni' },

  // Site Bukavu to Small Group Transfers
  { id: 'txn_site_bukavu_sg_uea_1', date: '2024-07-12', amount: 200, description: 'UEA SG Outreach Event', transactionType: 'transfer', senderEntityType: 'site', senderEntityId: 'site_bukavu', senderEntityName: 'Site Bukavu', recipientEntityType: 'small_group', recipientEntityId: 'sg_bukavu_uea', recipientEntityName: 'Bukavu UEA SG', level: 'site', relatedSiteId: 'site_bukavu', relatedSmallGroupId: 'sg_bukavu_uea' },
  
  // Site Goma Expenses
  { id: 'txn_site_goma_exp_1', date: '2024-07-18', amount: 120, description: 'Refreshments for Goma Leaders Meeting', transactionType: 'expense', senderEntityType: 'site', senderEntityId: 'site_goma', senderEntityName: 'Site Goma', recipientEntityType: 'vendor', recipientEntityId: 'goma_catering_serv', recipientEntityName: 'Goma Catering', level: 'site', relatedSiteId: 'site_goma' },
];
