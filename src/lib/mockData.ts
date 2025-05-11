// src/lib/mockData.ts
import type { User, Activity, Member, Report, Site, SmallGroup, Transaction } from "@/lib/types";
import { ROLES } from "@/lib/constants";
import { getYear, subYears, formatISO, startOfYear, endOfYear } from 'date-fns';

const currentYear = getYear(new Date());
const lastYear = currentYear - 1;

export const mockUsers: User[] = [
  { id: "user_nat_1", name: "Alice National", email: "alice@aylf.org", role: ROLES.NATIONAL_COORDINATOR, mandateStartDate: "2020-01-01", status: "active" },
  { id: "user_site_beni_coord", name: "Coordinator Beni", email: "beni.coord@aylf.org", role: ROLES.SITE_COORDINATOR, siteId: "site_beni", mandateStartDate: "2022-01-01", status: "active" },
  { id: "user_sg_beni_alumni_leader", name: "Leader Beni Alumni", email: "beni.alumni.leader@aylf.org", role: ROLES.SMALL_GROUP_LEADER, siteId: "site_beni", smallGroupId: "sg_beni_alumni", mandateStartDate: formatISO(startOfYear(subYears(new Date(),1))), mandateEndDate: formatISO(endOfYear(subYears(new Date(),1))), status: "inactive" },
  { id: "user_site_bukavu_coord", name: "Coordinator Bukavu", email: "bukavu.coord@aylf.org", role: ROLES.SITE_COORDINATOR, siteId: "site_bukavu", mandateStartDate: "2021-06-15", status: "active" },
  { id: "user_sg_bukavu_alumni_leader", name: "Leader Bukavu Alumni", email: "bukavu.alumni.leader@aylf.org", role: ROLES.SMALL_GROUP_LEADER, siteId: "site_bukavu", smallGroupId: "sg_bukavu_alumni", mandateStartDate: "2021-08-01", status: "active" },
  { id: "user_site_bunia_coord", name: "Coordinator Bunia", email: "bunia.coord@aylf.org", role: ROLES.SITE_COORDINATOR, siteId: "site_bunia", mandateStartDate: "2022-02-10", mandateEndDate: `${currentYear}-01-10`, status: "inactive" },
  { id: "user_sg_bunia_alumni_leader", name: "Leader Bunia Alumni", email: "bunia.alumni.leader@aylf.org", role: ROLES.SMALL_GROUP_LEADER, siteId: "site_bunia", smallGroupId: "sg_bunia_alumni", mandateStartDate: "2022-04-01", mandateEndDate: `${lastYear}-05-15`, status: "inactive" },
  { id: "user_site_butembo_coord", name: "Coordinator Butembo", email: "butembo.coord@aylf.org", role: ROLES.SITE_COORDINATOR, siteId: "site_butembo", mandateStartDate: "2023-01-20", status: "active" },
  { id: "user_sg_butembo_alumni_leader", name: "Leader Butembo Alumni", email: "butembo.alumni.leader@aylf.org", role: ROLES.SMALL_GROUP_LEADER, siteId: "site_butembo", smallGroupId: "sg_butembo_alumni", mandateStartDate: "2023-03-15", status: "active" },
  { id: "user_site_goma_coord", name: "Coordinator Goma", email: "goma.coord@aylf.org", role: ROLES.SITE_COORDINATOR, siteId: "site_goma", mandateStartDate: "2020-11-01", status: "active" },
  { id: "user_sg_goma_alumni_leader", name: "Leader Goma Alumni", email: "goma.alumni.leader@aylf.org", role: ROLES.SMALL_GROUP_LEADER, siteId: "site_goma", smallGroupId: "sg_goma_alumni", mandateStartDate: "2020-12-01", mandateEndDate: `${currentYear}-03-01`, status: "inactive" },
  { id: "user_site_kalemie_coord", name: "Coordinator Kalemie", email: "kalemie.coord@aylf.org", role: ROLES.SITE_COORDINATOR, siteId: "site_kalemie", mandateStartDate: "2023-05-01", status: "active" },
  { id: "user_sg_kalemie_alumni_leader", name: "Leader Kalemie Alumni", email: "kalemie.alumni.leader@aylf.org", role: ROLES.SMALL_GROUP_LEADER, siteId: "site_kalemie", smallGroupId: "sg_kalemie_alumni", mandateStartDate: "2023-06-10", status: "active" },
  { id: "user_site_kinshasa_coord", name: "Coordinator Kinshasa", email: "kinshasa.coord@aylf.org", role: ROLES.SITE_COORDINATOR, siteId: "site_kinshasa", mandateStartDate: "2019-09-01", status: "active" },
  { id: "user_sg_kinshasa_alumni_leader", name: "Leader Kinshasa Alumni", email: "kinshasa.alumni.leader@aylf.org", role: ROLES.SMALL_GROUP_LEADER, siteId: "site_kinshasa", smallGroupId: "sg_kinshasa_alumni", mandateStartDate: "2019-10-15", status: "active" },
  { id: "user_site_kisangani_coord", name: "Coordinator Kisangani", email: "kisangani.coord@aylf.org", role: ROLES.SITE_COORDINATOR, siteId: "site_kisangani", mandateStartDate: "2022-07-01", status: "active"},
  { id: "user_sg_kisangani_alumni_leader", name: "Leader Kisangani Alumni", email: "kisangani.alumni.leader@aylf.org", role: ROLES.SMALL_GROUP_LEADER, siteId: "site_kisangani", smallGroupId: "sg_kisangani_alumni", mandateStartDate: "2022-08-20", status: "active" },
  { id: "user_site_kolwezi_coord", name: "Coordinator Kolwezi", email: "kolwezi.coord@aylf.org", role: ROLES.SITE_COORDINATOR, siteId: "site_kolwezi", mandateStartDate: "2023-02-01", status: "active"},
  { id: "user_sg_kolwezi_alumni_leader", name: "Leader Kolwezi Alumni", email: "kolwezi.alumni.leader@aylf.org", role: ROLES.SMALL_GROUP_LEADER, siteId: "site_kolwezi", smallGroupId: "sg_kolwezi_alumni", mandateStartDate: "2023-04-11", status: "active" },
  { id: "user_site_lubumbashi_coord", name: "Coordinator Lubumbashi", email: "lubumbashi.coord@aylf.org", role: ROLES.SITE_COORDINATOR, siteId: "site_lubumbashi", mandateStartDate: "2020-05-05", status: "active" },
  { id: "user_sg_lubumbashi_alumni_leader", name: "Leader Lubumbashi Alumni", email: "lubumbashi.alumni.leader@aylf.org", role: ROLES.SMALL_GROUP_LEADER, siteId: "site_lubumbashi", smallGroupId: "sg_lubumbashi_alumni", mandateStartDate: "2020-06-25", status: "active" },
  { id: "user_site_uvira_coord", name: "Coordinator Uvira", email: "uvira.coord@aylf.org", role: ROLES.SITE_COORDINATOR, siteId: "site_uvira", mandateStartDate: "2022-10-01", status: "active" },
  { id: "user_sg_uvira_alumni_leader", name: "Leader Uvira Alumni", email: "uvira.alumni.leader@aylf.org", role: ROLES.SMALL_GROUP_LEADER, siteId: "site_uvira", smallGroupId: "sg_uvira_alumni", mandateStartDate: "2022-11-11", mandateEndDate: `${lastYear}-12-31`, status: "inactive" },
];

export const mockSites: Site[] = [
  { id: "site_beni", name: "Beni", coordinatorId: "Coordinator Beni" },
  { id: "site_bukavu", name: "Bukavu", coordinatorId: "Coordinator Bukavu" },
  { id: "site_bunia", name: "Bunia", coordinatorId: "Coordinator Bunia" }, 
  { id: "site_butembo", name: "Butembo", coordinatorId: "Coordinator Butembo" },
  { id: "site_goma", name: "Goma", coordinatorId: "Coordinator Goma" },
  { id: "site_kalemie", name: "Kalemie", coordinatorId: "Coordinator Kalemie" },
  { id: "site_kinshasa", name: "Kinshasa", coordinatorId: "Coordinator Kinshasa" },
  { id: "site_kisangani", name: "Kisangani", coordinatorId: "Coordinator Kisangani"},
  { id: "site_kolwezi", name: "Kolwezi", coordinatorId: "Coordinator Kolwezi"},
  { id: "site_lubumbashi", name: "Lubumbashi", coordinatorId: "Coordinator Lubumbashi" },
  { id: "site_uvira", name: "Uvira", coordinatorId: "Coordinator Uvira" },
];

export const mockSmallGroups: SmallGroup[] = [
  // Beni
  { id: "sg_beni_alumni", name: "ALUMNI", siteId: "site_beni", leaderId: "user_sg_beni_alumni_leader" }, 
  { id: "sg_beni_isc", name: "ISC", siteId: "site_beni", leaderId: "user_site_beni_coord" }, 
  { id: "sg_beni_uac", name: "UAC", siteId: "site_beni", leaderId: "user_site_beni_coord" },
  { id: "sg_beni_ucbc", name: "UCBC", siteId: "site_beni", leaderId: "user_site_beni_coord" },
  { id: "sg_beni_uos", name: "UOS", siteId: "site_beni", leaderId: "user_site_beni_coord" },
  // Bukavu
  { id: "sg_bukavu_alumni", name: "ALUMNI", siteId: "site_bukavu", leaderId: "user_sg_bukavu_alumni_leader" },
  { id: "sg_bukavu_isdr", name: "ISDR", siteId: "site_bukavu", leaderId: "user_site_bukavu_coord" },
  { id: "sg_bukavu_isp", name: "ISP", siteId: "site_bukavu", leaderId: "user_site_bukavu_coord" },
  { id: "sg_bukavu_uea", name: "UEA", siteId: "site_bukavu", leaderId: "user_site_bukavu_coord" },
  { id: "sg_bukavu_isecof", name: "ISECOF", siteId: "site_bukavu", leaderId: "user_site_bukavu_coord" },
  { id: "sg_bukavu_uob", name: "UOB", siteId: "site_bukavu", leaderId: "user_site_bukavu_coord" },
  // Bunia
  { id: "sg_bunia_alumni", name: "ALUMNI", siteId: "site_bunia", leaderId: "user_sg_bunia_alumni_leader" },
  { id: "sg_bunia_unibu", name: "UNIBU", siteId: "site_bunia", leaderId: "user_site_bunia_coord" }, 
  { id: "sg_bunia_unshalom", name: "UN.SHALOM", siteId: "site_bunia", leaderId: "user_site_bunia_coord" }, 
  // Butembo
  { id: "sg_butembo_alumni", name: "ALUMNI", siteId: "site_butembo", leaderId: "user_sg_butembo_alumni_leader" },
  { id: "sg_butembo_uac", name: "UAC", siteId: "site_butembo", leaderId: "user_site_butembo_coord" },
  { id: "sg_butembo_ucg", name: "UCG", siteId: "site_butembo", leaderId: "user_site_butembo_coord" },
  { id: "sg_butembo_uor", name: "UOR", siteId: "site_butembo", leaderId: "user_site_butembo_coord" },
  // Goma
  { id: "sg_goma_alumni", name: "ALUMNI", siteId: "site_goma", leaderId: "user_sg_goma_alumni_leader" },
  { id: "sg_goma_isig", name: "ISIG", siteId: "site_goma", leaderId: "user_site_goma_coord" },
  { id: "sg_goma_ucs", name: "UCS", siteId: "site_goma", leaderId: "user_site_goma_coord" },
  { id: "sg_goma_ulpgl", name: "ULPGL", siteId: "site_goma", leaderId: "user_site_goma_coord" },
  { id: "sg_goma_unigom", name: "UNIGOM", siteId: "site_goma", leaderId: "user_site_goma_coord" },
  { id: "sg_goma_unim", name: "UNIM", siteId: "site_goma", leaderId: "user_site_goma_coord" },
  // Kalemie
  { id: "sg_kalemie_alumni", name: "ALUMNI", siteId: "site_kalemie", leaderId: "user_sg_kalemie_alumni_leader" },
  { id: "sg_kalemie_isp", name: "ISP", siteId: "site_kalemie", leaderId: "user_site_kalemie_coord" },
  { id: "sg_kalemie_istm", name: "ISTM", siteId: "site_kalemie", leaderId: "user_site_kalemie_coord" },
  { id: "sg_kalemie_isss", name: "ISSS", siteId: "site_kalemie", leaderId: "user_site_kalemie_coord" },
  { id: "sg_kalemie_unikal", name: "UNIKAL", siteId: "site_kalemie", leaderId: "user_site_kalemie_coord" },
  // Kinshasa
  { id: "sg_kinshasa_alumni", name: "ALUMNI", siteId: "site_kinshasa", leaderId: "user_sg_kinshasa_alumni_leader" },
  { id: "sg_kinshasa_unikin", name: "UNIKIN", siteId: "site_kinshasa", leaderId: "user_site_kinshasa_coord" },
  { id: "sg_kinshasa_unimkin", name: "UNIM/Kin", siteId: "site_kinshasa", leaderId: "user_site_kinshasa_coord" },
  // Kisangani
  { id: "sg_kisangani_alumni", name: "ALUMNI", siteId: "site_kisangani", leaderId: "user_sg_kisangani_alumni_leader" },
  { id: "sg_kisangani_unikis", name: "UNIKIS", siteId: "site_kisangani", leaderId: "user_site_kisangani_coord"},
  { id: "sg_kisangani_upc", name: "UPC", siteId: "site_kisangani", leaderId: "user_site_kisangani_coord"},
  // Kolwezi
  { id: "sg_kolwezi_alumni", name: "ALUMNI", siteId: "site_kolwezi", leaderId: "user_sg_kolwezi_alumni_leader" },
  { id: "sg_kolwezi_unikol", name: "UNIKOL", siteId: "site_kolwezi", leaderId: "user_site_kolwezi_coord" },
  // Lubumbashi
  { id: "sg_lubumbashi_alumni", name: "ALUMNI", siteId: "site_lubumbashi", leaderId: "user_sg_lubumbashi_alumni_leader" },
  { id: "sg_lubumbashi_unilu", name: "UNILU", siteId: "site_lubumbashi", leaderId: "user_site_lubumbashi_coord" },
  // Uvira
  { id: "sg_uvira_alumni", name: "ALUMNI", siteId: "site_uvira", leaderId: "user_sg_uvira_alumni_leader" },
  { id: "sg_uvira_isc", name: "ISC", siteId: "site_uvira", leaderId: "user_site_uvira_coord" },
  { id: "sg_uvira_isdr", name: "ISDR", siteId: "site_uvira", leaderId: "user_site_uvira_coord" },
  { id: "sg_uvira_isp", name: "ISP", siteId: "site_uvira", leaderId: "user_site_uvira_coord" },
  { id: "sg_uvira_istm", name: "ISTM", siteId: "site_uvira", leaderId: "user_site_uvira_coord" },
  { id: "sg_uvira_undt", name: "UNDT", siteId: "site_uvira", leaderId: "user_site_uvira_coord" },
];

export const mockActivities: Activity[] = [
  { id: "act_1", name: "Leadership Workshop", description: "National leadership training.", date: "2024-08-15", status: "planned", level: "national", participantsCount: 150, imageUrl: "https://picsum.photos/seed/leadershipconf/600/400" },
  { id: "act_2", name: "Community Outreach", description: "Beni site local community service.", date: "2024-07-20", status: "executed", level: "site", siteId: "site_beni", participantsCount: 45, imageUrl: "https://picsum.photos/seed/communityservice/600/400" },
  { id: "act_3", name: "Book Study: 'Purpose Driven Life'", description: "Beni Alumni Group weekly study.", date: "2024-07-28", status: "executed", level: "small_group", smallGroupId: "sg_beni_alumni", participantsCount: 12, imageUrl: "https://picsum.photos/seed/bookstudygroup/600/400" },
  { id: "act_4", name: "Mentorship Program Launch", description: "Bukavu site mentorship initiative.", date: "2024-09-01", status: "planned", level: "site", siteId: "site_bukavu", participantsCount: 60, imageUrl: "https://picsum.photos/seed/mentorshipprogram/600/400" },
  { id: "act_5", name: "Annual Youth Conference", description: "National gathering for all youth.", date: "2023-12-10", status: "executed", level: "national", participantsCount: 500, imageUrl: "https://picsum.photos/seed/youthconference/600/400" },
  { id: "act_6", name: "Sports Day", description: "Goma site inter-group sports event.", date: "2023-11-05", status: "executed", level: "site", siteId: "site_goma", participantsCount: 80, imageUrl: "https://picsum.photos/seed/sportsdayevent/600/400" },
  { id: "act_7", name: "Prayer Breakfast", description: "Kinshasa UNIKIN Group monthly meeting.", date: "2024-07-10", status: "cancelled", level: "small_group", smallGroupId: "sg_kinshasa_unikin", participantsCount: 8 },
  { id: "act_8", name: "Bunia Site Evangelism Training", description: "Training for evangelism in Bunia.", date: "2024-08-10", status: "planned", level: "site", siteId: "site_bunia", participantsCount: 30, imageUrl: "https://picsum.photos/seed/evangelismtraining/600/400" },
  { id: "act_9", name: "Butembo UCG Bible Study", description: "Weekly bible study at UCG Butembo.", date: "2024-07-25", status: "executed", level: "small_group", smallGroupId: "sg_butembo_ucg", participantsCount: 15, imageUrl: "https://picsum.photos/seed/biblestudycircle/600/400" },
  { id: "act_10", name: "Kalemie ISP Leadership Seminar", description: "Leadership seminar for ISP Kalemie students.", date: "2024-09-05", status: "planned", level: "small_group", smallGroupId: "sg_kalemie_isp", participantsCount: 25, imageUrl: "https://picsum.photos/seed/leadershipseminar/600/400" },
  { id: "act_11", name: "Kisangani National Day Celebration", description: "Site event for National Day.", date: "2024-06-30", status: "executed", level: "site", siteId: "site_kisangani", participantsCount: 70, imageUrl: "https://picsum.photos/seed/nationalday/600/400" },
  { id: "act_12", name: "Kolwezi UNIKOL Book Club", description: "Monthly book club at UNIKOL Kolwezi.", date: "2024-07-15", status: "executed", level: "small_group", smallGroupId: "sg_kolwezi_unikol", participantsCount: 10, imageUrl: "https://picsum.photos/seed/bookclubmeeting/600/400" },
  { id: "act_13", name: "Lubumbashi UNILU Career Fair", description: "Career fair for UNILU students.", date: "2024-10-10", status: "planned", level: "small_group", smallGroupId: "sg_lubumbashi_unilu", participantsCount: 100, imageUrl: "https://picsum.photos/seed/careerfair/600/400" },
  { id: "act_14", name: "Uvira Community Cleanup", description: "Community cleanup organized by Uvira site.", date: "2024-08-20", status: "planned", level: "site", siteId: "site_uvira", participantsCount: 50, imageUrl: "https://picsum.photos/seed/communitycleanup/600/400" },
];

export const mockMembers: Member[] = [
  { id: "mem_1", name: "John Doe", type: "student", siteId: "site_beni", smallGroupId: "sg_beni_isc", joinDate: "2023-01-15" },
  { id: "mem_2", name: "Jane Smith", type: "non-student", siteId: "site_bukavu", smallGroupId: "sg_bukavu_alumni", joinDate: "2022-11-20" },
  { id: "mem_3", name: "Mike Brown", type: "student", siteId: "site_goma", smallGroupId: "sg_goma_isig", joinDate: "2023-03-10" },
  { id: "mem_4", name: "Sarah Wilson", type: "student", siteId: "site_uvira", smallGroupId: "sg_uvira_isp", joinDate: "2023-02-01" },
  { id: "mem_5", name: "David Lee", type: "non-student", siteId: "site_kinshasa", smallGroupId: "sg_kinshasa_alumni", joinDate: "2023-05-05" },
  { id: "mem_6", name: "Emily White", type: "student", siteId: "site_butembo", smallGroupId: "sg_butembo_uac", joinDate: "2024-01-10" },
  { id: "mem_7", name: "Chris Green", type: "student", siteId: "site_kalemie", smallGroupId: "sg_kalemie_unikal", joinDate: "2024-03-20" },
  { id: "mem_8", name: "Laura Blue", type: "student", siteId: "site_bunia", smallGroupId: "sg_bunia_unibu", joinDate: "2023-09-01" },
  { id: "mem_9", name: "Kevin Black", type: "non-student", siteId: "site_kisangani", smallGroupId: "sg_kisangani_alumni", joinDate: "2022-07-15" },
  { id: "mem_10", name: "Olivia Yellow", type: "student", siteId: "site_kolwezi", smallGroupId: "sg_kolwezi_unikol", joinDate: "2023-11-05" },
  { id: "mem_11", name: "Daniel Purple", type: "student", siteId: "site_lubumbashi", smallGroupId: "sg_lubumbashi_unilu", joinDate: "2024-02-20" },
  { id: "mem_12", name: "Grace Silver", type: "non-student", siteId: "site_beni", smallGroupId: "sg_beni_alumni", joinDate: "2021-10-10" },
  { id: "mem_13", name: "Tom Gold", type: "student", siteId: "site_goma", smallGroupId: "sg_goma_ulpgl", joinDate: "2023-08-12" },
];

export let mockReports: Report[] = [
  { 
    id: "rep_1", 
    title: "Q2 Leadership Workshop Summary", 
    activityDate: "2024-06-28",
    submittedBy: "user_nat_1", 
    submissionDate: "2024-07-01", 
    level: "national", 
    activityType: "Workshop",
    thematic: "Strategic Planning and Conflict Resolution",
    speaker: "Dr. Jane Goodall (Guest)",
    moderator: "Alice National",
    girlsCount: 60,
    boysCount: 90,
    participantsCountReported: 150,
    amountUsed: 500,
    currency: "USD",
    content: "The Q2 leadership workshop was a success with high engagement from all site coordinators. Key topics included strategic planning and conflict resolution. Breakout sessions were particularly fruitful.", 
    images: [{ name: "workshop_group.jpg", url: "https://picsum.photos/seed/workshop1/400/300" }],
    financialSummary: "Total expenses: $500 for materials and speaker fees. Income from registration: $200.",
    status: "submitted",
  },
  { 
    id: "rep_2", 
    title: "July Community Outreach Report - Beni", 
    activityDate: "2024-07-20",
    submittedBy: "user_site_beni_coord", 
    submissionDate: "2024-07-22", 
    level: "site", 
    siteId: "site_beni", 
    activityType: "Community Service",
    thematic: "Supporting Local Families",
    moderator: "Coordinator Beni",
    girlsCount: 20, 
    boysCount: 15, 
    participantsCountReported: 45, 
    amountUsed: 250,
    currency: "USD",
    content: "Reached 50 families in the local area, distributed food packs and hygiene kits. Positive feedback received from community leaders. AYLF members involved: 10.",
    images: [
        { name: "outreach_team.jpg", url: "https://picsum.photos/seed/outreach1/400/300" }, 
        { name: "beneficiaries.jpg", url: "https://picsum.photos/seed/beneficiaries1/400/300" }
    ],
    financialSummary: "Donations received: $300. Expenses for supplies: $250. Net: $50 surplus.",
    status: "submitted",
  },
  { 
    id: "rep_3", 
    title: "Beni Alumni July Book Study Progress", 
    activityDate: "2024-07-28",
    submittedBy: "user_sg_beni_alumni_leader", 
    submissionDate: "2024-07-29", 
    level: "small_group", 
    smallGroupId: "sg_beni_alumni", 
    siteId: "site_beni", 
    activityType: "Small Group Meeting",
    thematic: "Purpose Driven Life - Chapters 1-5",
    speaker: "N/A",
    moderator: "Leader Beni Alumni",
    girlsCount: 5,
    boysCount: 7,
    participantsCountReported: 12,
    amountUsed: 5,
    currency: "USD",
    content: "Completed first 5 chapters of 'Purpose Driven Life'. Rich discussions on purpose, identity, and service. Average attendance: 12 members.",
    images: [{ name: "book_study.jpg", url: "https://picsum.photos/seed/bookstudy/400/300" }],
    financialSummary: "Refreshments cost $5, self-funded by members.",
    status: "submitted",
  },
  { 
    id: "rep_4", 
    title: "Goma Site Sports Day Recap", 
    activityDate: "2023-11-05",
    submittedBy: "user_site_goma_coord", 
    submissionDate: "2023-11-10", 
    level: "site", 
    siteId: "site_goma", 
    activityType: "Sports Event",
    thematic: "Teamwork and Fellowship",
    moderator: "Coordinator Goma",
    participantsCountReported: 80, 
    amountUsed: 150,
    currency: "USD",
    content: "Successful sports day with over 80 participants. ISIG group won the football tournament. Promoted teamwork and fellowship.",
    images: [{ name: "sports_day_goma.jpg", url: "https://picsum.photos/seed/sportsgoma/400/300" }],
    financialSummary: "Expenses for equipment and refreshments: $150. Covered by site budget.",
    status: "approved",
    reviewNotes: "Great event, well documented!"
  },
   { 
    id: "rep_5", 
    title: "Kinshasa UNIKIN Prayer Breakfast Outcome", 
    activityDate: "2024-06-15",
    submittedBy: "user_sg_kinshasa_alumni_leader", // Assuming Kinshasa Alumni leader might submit for UNIKIN as example
    submissionDate: "2024-06-18", 
    level: "small_group", 
    smallGroupId: "sg_kinshasa_unikin",
    siteId: "site_kinshasa", 
    activityType: "Small Group Meeting",
    thematic: "Prayer for Academic Success",
    speaker: "Pastor John Mark",
    moderator: "Local SG Leader",
    girlsCount: 8,
    boysCount: 7,
    participantsCountReported: 15,
    amountUsed: 30,
    currency: "USD",
    content: "Monthly prayer breakfast held with 15 students. Focus on academic success and spiritual growth. Event was well-received.",
    images: [{ name: "prayer_breakfast.jpg", url: "https://picsum.photos/seed/prayerbreakfast/400/300" }],
    financialSummary: "Cost for breakfast items: $30. Covered by member contributions.",
    status: "submitted",
  },
  {
    id: "rep_goma_ulpgl_1",
    title: "ULPGL SG Meeting Report - April 26",
    activityDate: "2025-04-26",
    submittedBy: "user_sg_goma_alumni_leader", 
    submissionDate: "2025-04-27",
    level: "small_group",
    smallGroupId: "sg_goma_ulpgl",
    siteId: "site_goma",
    activityType: "Small Group Meeting",
    thematic: "Agir avec différence positive dans la bonté et l'humilité au sein d'une societé perverse",
    speaker: "Doyenne Facultaire Semerita Kamundu",
    moderator: "David Ushindi",
    girlsCount: 9,
    boysCount: 17,
    participantsCountReported: 26,
    amountUsed: 11,
    currency: "USD",
    content: "The small group meeting at ULPGL focused on maintaining positive values in a challenging society. Doyenne Semerita Kamundu shared valuable insights, and David Ushindi facilitated the discussion effectively. The session was interactive and well-attended.",
    images: [{ name: "ulpgl_meeting.jpg", url: "https://picsum.photos/seed/ulpglmeeting/400/300" }],
    financialSummary: "Amount used for refreshments and materials: $11.",
    status: "rejected",
    reviewNotes: "Please provide more details on the specific outcomes and action points from the discussion."
  }
];


export const historicalDataExample = `
Past Activities:
- Annual Youth Conference (Dec 2023): 500 attendees, feedback 4.5/5 stars. Topics: Leadership, Faith, Community. Resources: Guest speakers, workshops. Activity Type: Conference. Amount Used: $2000.
- Regional Sports Tournament (Oct 2023): 120 participants from 3 sites. Feedback 4.2/5. Resources: Sports equipment, volunteer referees. Activity Type: Sports Event. Amount Used: $300.
- Online Bible Study Series (Q1 2024): Avg 80 participants per session. Feedback 4.0/5. Resources: Zoom, study guides. Activity Type: Online Meeting. Amount Used: $50 (for premium Zoom).
- Site Beni - Mentorship Program (Ongoing): 30 mentor-mentee pairs. Feedback 4.8/5. Resources: Training materials for mentors. Activity Type: Program. Amount Used: $100 (materials).
- Small Group Beni Alumni - Local Charity Drive (May 2024): 15 members participated. Raised $200 for children's home. Activity Type: Community Service. Amount Used: $50 (transport).
`;

export const currentTrendsExample = `
Current Trends:
- Increased interest in mental health and well-being workshops (target 30-50 participants).
- Popularity of short-form video content for engagement and event promotion (e.g., TikTok challenges, Instagram Reels recap).
- Demand for hybrid events (online and in-person components), especially for larger trainings.
- Growing focus on practical skills development (e.g., coding, entrepreneurship, public speaking) - workshops of 20-40 people.
- Gamification in learning and team-building activities, suitable for small group meetings.
`;

export const groupPreferencesExample = `
Group Preferences (Optional):
- Target age group: 15-25 years.
- Interests: Spiritual growth, leadership development, community service, technology.
- Constraints: Limited budget for large-scale events (max $500 per event, preferably under $100 for SG activities). Preference for activities that can be replicated across different sites.
- Location: Primarily urban and peri-urban settings in Beni, Bukavu, Goma.
- Desired activity types: Workshops, Seminars, Small group discussions, Mentorship sessions.
`;

export const mockTransactions: Transaction[] = [
  // National Income
  { id: 'txn_nat_inc_1', date: '2024-06-01', amount: 10000, description: 'Grant from XYZ Foundation', transactionType: 'income_source', senderEntityType: 'external_donor', senderEntityId: 'donor_xyz', senderEntityName: 'XYZ Foundation', recipientEntityType: 'national', recipientEntityId: 'aylf_national', recipientEntityName: 'AYLF National', level: 'national' },
  { id: 'txn_nat_inc_2', date: '2024-06-15', amount: 5000, description: 'General Donations Q2', transactionType: 'income_source', senderEntityType: 'external_donor', senderEntityId: 'donors_general', senderEntityName: 'Various Donors', recipientEntityType: 'national', recipientEntityId: 'aylf_national', recipientEntityName: 'AYLF National', level: 'national' },
  { id: 'txn_nat_inc_3', date: '2024-07-05', amount: 7500, description: 'Partnership Contribution - ABC Corp', transactionType: 'income_source', senderEntityType: 'external_donor', senderEntityId: 'donor_abc_corp', senderEntityName: 'ABC Corporation', recipientEntityType: 'national', recipientEntityId: 'aylf_national', recipientEntityName: 'AYLF National', level: 'national' },
  
  // National to Site Transfers
  { id: 'txn_nat_site_beni_1', date: '2024-07-01', amount: 2000, description: 'Q3 Budget for Site Beni', transactionType: 'transfer', senderEntityType: 'national', senderEntityId: 'aylf_national', recipientEntityType: 'site', recipientEntityId: 'site_beni', level: 'national', relatedSiteId: 'site_beni' },
  { id: 'txn_nat_site_bukavu_1', date: '2024-07-01', amount: 1800, description: 'Q3 Budget for Site Bukavu', transactionType: 'transfer', senderEntityType: 'national', senderEntityId: 'aylf_national', recipientEntityType: 'site', recipientEntityId: 'site_bukavu', level: 'national', relatedSiteId: 'site_bukavu' },
  { id: "txn_nat_site_bunia_1", date: "2024-07-02", amount: 1500, description: "Q3 Budget for Site Bunia", transactionType: "transfer", senderEntityType: "national", senderEntityId: "aylf_national", recipientEntityType: "site", recipientEntityId: "site_bunia", level: "national", relatedSiteId: "site_bunia" },
  { id: "txn_nat_site_butembo_1", date: "2024-07-02", amount: 1600, description: "Q3 Budget for Site Butembo", transactionType: "transfer", senderEntityType: "national", senderEntityId: "aylf_national", recipientEntityType: "site", recipientEntityId: "site_butembo", level: "national", relatedSiteId: "site_butembo" },
  { id: 'txn_nat_site_goma_1', date: '2024-07-02', amount: 2200, description: 'Special Project Funding Goma', transactionType: 'transfer', senderEntityType: 'national', senderEntityId: 'aylf_national', recipientEntityType: 'site', recipientEntityId: 'site_goma', level: 'national', relatedSiteId: 'site_goma' },
  { id: "txn_nat_site_kalemie_1", date: "2024-07-03", amount: 1400, description: "Q3 Budget for Site Kalemie", transactionType: "transfer", senderEntityType: "national", senderEntityId: "aylf_national", recipientEntityType: "site", recipientEntityId: "site_kalemie", level: "national", relatedSiteId: "site_kalemie" },
  { id: "txn_nat_site_kinshasa_1", date: "2024-07-03", amount: 2500, description: "Q3 Budget for Site Kinshasa", transactionType: "transfer", senderEntityType: "national", senderEntityId: "aylf_national", recipientEntityType: "site", recipientEntityId: "site_kinshasa", level: "national", relatedSiteId: "site_kinshasa" },
  { id: "txn_nat_site_kisangani_1", date: "2024-07-04", amount: 1700, description: "Q3 Budget for Site Kisangani", transactionType: "transfer", senderEntityType: "national", senderEntityId: "aylf_national", recipientEntityType: "site", recipientEntityId: "site_kisangani", level: "national", relatedSiteId: "site_kisangani" },
  { id: "txn_nat_site_kolwezi_1", date: "2024-07-04", amount: 1300, description: "Q3 Budget for Site Kolwezi", transactionType: "transfer", senderEntityType: "national", senderEntityId: "aylf_national", recipientEntityType: "site", recipientEntityId: "site_kolwezi", level: "national", relatedSiteId: "site_kolwezi" },
  { id: "txn_nat_site_lubumbashi_1", date: "2024-07-05", amount: 2300, description: "Q3 Budget for Site Lubumbashi", transactionType: "transfer", senderEntityType: "national", senderEntityId: "aylf_national", recipientEntityType: "site", recipientEntityId: "site_lubumbashi", level: "national", relatedSiteId: "site_lubumbashi" },
  { id: "txn_nat_site_uvira_1", date: "2024-07-05", amount: 1200, description: "Q3 Budget for Site Uvira", transactionType: "transfer", senderEntityType: "national", senderEntityId: "aylf_national", recipientEntityType: "site", recipientEntityId: "site_uvira", level: "national", relatedSiteId: "site_uvira" },

  // National Expenses
  { id: 'txn_nat_exp_1', date: '2024-07-05', amount: 1200, description: 'National Conference Venue Booking', transactionType: 'expense', senderEntityType: 'national', senderEntityId: 'aylf_national', recipientEntityType: 'vendor', recipientEntityId: 'venue_conf_center', recipientEntityName: 'Capital Conference Center', level: 'national' },
  { id: 'txn_nat_exp_2', date: '2024-07-10', amount: 300, description: 'Website Hosting Fees', transactionType: 'expense', senderEntityType: 'national', senderEntityId: 'aylf_national', recipientEntityType: 'vendor', recipientEntityId: 'host_co_123', recipientEntityName: 'Web Services Inc.', level: 'national' },
  { id: 'txn_nat_exp_3', date: '2024-07-18', amount: 450, description: 'Travel Expenses - National Coordinator', transactionType: 'expense', senderEntityType: 'national', senderEntityId: 'aylf_national', recipientEntityType: 'other', recipientEntityId: 'travel_agency_A1', recipientEntityName: 'Express Travel', level: 'national' },
  
  // Site Beni to Small Group Transfers
  { id: 'txn_site_beni_sg_alumni_1', date: '2024-07-10', amount: 150, description: 'Activity support for Alumni SG', transactionType: 'transfer', senderEntityType: 'site', senderEntityId: 'site_beni', recipientEntityType: 'small_group', recipientEntityId: 'sg_beni_alumni', level: 'site', relatedSiteId: 'site_beni', relatedSmallGroupId: 'sg_beni_alumni' },
  { id: 'txn_site_beni_sg_isc_1', date: '2024-07-11', amount: 100, description: 'Materials for ISC SG workshop', transactionType: 'transfer', senderEntityType: 'site', senderEntityId: 'site_beni', recipientEntityType: 'small_group', recipientEntityId: 'sg_beni_isc', level: 'site', relatedSiteId: 'site_beni', relatedSmallGroupId: 'sg_beni_isc' },
  { id: 'txn_site_beni_sg_uac_1', date: '2024-07-12', amount: 120, description: 'Refreshments for UAC SG meeting', transactionType: 'transfer', senderEntityType: 'site', senderEntityId: 'site_beni', recipientEntityType: 'small_group', recipientEntityId: 'sg_beni_uac', level: 'site', relatedSiteId: 'site_beni', relatedSmallGroupId: 'sg_beni_uac' },

  // Site Beni Expenses
  { id: 'txn_site_beni_exp_1', date: '2024-07-15', amount: 80, description: 'Printing for Site Workshop', transactionType: 'expense', senderEntityType: 'site', senderEntityId: 'site_beni', recipientEntityType: 'vendor', recipientEntityId: 'beni_print_shop', recipientEntityName: 'Beni Print Services', level: 'site', relatedSiteId: 'site_beni' },
  { id: 'txn_site_beni_exp_2', date: '2024-07-20', amount: 50, description: 'Local Transport for Site Coordinator', transactionType: 'expense', senderEntityType: 'site', senderEntityId: 'site_beni', recipientEntityType: 'other', recipientEntityId: 'local_transport_beni', recipientEntityName: 'Beni Transport', level: 'site', relatedSiteId: 'site_beni' },

  // Site Bukavu to Small Group Transfers
  { id: 'txn_site_bukavu_sg_uea_1', date: '2024-07-12', amount: 200, description: 'UEA SG Outreach Event', transactionType: 'transfer', senderEntityType: 'site', senderEntityId: 'site_bukavu', recipientEntityType: 'small_group', recipientEntityId: 'sg_bukavu_uea', level: 'site', relatedSiteId: 'site_bukavu', relatedSmallGroupId: 'sg_bukavu_uea' },
  { id: 'txn_site_bukavu_sg_isp_1', date: '2024-07-13', amount: 130, description: 'ISP SG Guest Speaker Honorarium', transactionType: 'transfer', senderEntityType: 'site', senderEntityId: 'site_bukavu', recipientEntityType: 'small_group', recipientEntityId: 'sg_bukavu_isp', level: 'site', relatedSiteId: 'site_bukavu', relatedSmallGroupId: 'sg_bukavu_isp' },

  // Site Bukavu Expenses
  { id: 'txn_site_bukavu_exp_1', date: '2024-07-18', amount: 70, description: 'Office Supplies for Bukavu Site', transactionType: 'expense', senderEntityType: 'site', senderEntityId: 'site_bukavu', recipientEntityType: 'vendor', recipientEntityId: 'bukavu_stationery', recipientEntityName: 'Bukavu Stationery Shop', level: 'site', relatedSiteId: 'site_bukavu' },
  { id: 'txn_site_bukavu_exp_2', date: '2024-07-22', amount: 90, description: 'Venue Rental for Site Meeting', transactionType: 'expense', senderEntityType: 'site', senderEntityId: 'site_bukavu', recipientEntityType: 'vendor', recipientEntityId: 'bukavu_hall_rental', recipientEntityName: 'Umoja Hall Bukavu', level: 'site', relatedSiteId: 'site_bukavu' },

  // Site Goma to Small Group Transfers
  { id: 'txn_site_goma_sg_isig_1', date: '2024-07-14', amount: 180, description: 'ISIG SG Project Materials', transactionType: 'transfer', senderEntityType: 'site', senderEntityId: 'site_goma', recipientEntityType: 'small_group', recipientEntityId: 'sg_goma_isig', level: 'site', relatedSiteId: 'site_goma', relatedSmallGroupId: 'sg_goma_isig' },
  { id: 'txn_site_goma_sg_ulpgl_1', date: '2024-07-15', amount: 140, description: 'ULPGL SG Community Service Day', transactionType: 'transfer', senderEntityType: 'site', senderEntityId: 'site_goma', recipientEntityType: 'small_group', recipientEntityId: 'sg_goma_ulpgl', level: 'site', relatedSiteId: 'site_goma', relatedSmallGroupId: 'sg_goma_ulpgl' },

  // Site Goma Expenses
  { id: 'txn_site_goma_exp_1', date: '2024-07-18', amount: 120, description: 'Refreshments for Goma Leaders Meeting', transactionType: 'expense', senderEntityType: 'site', senderEntityId: 'site_goma', recipientEntityType: 'vendor', recipientEntityId: 'goma_catering_serv', recipientEntityName: 'Goma Catering', level: 'site', relatedSiteId: 'site_goma' },
  { id: 'txn_site_goma_exp_2', date: '2024-07-25', amount: 60, description: 'Internet Subscription - Goma Site Office', transactionType: 'expense', senderEntityType: 'site', senderEntityId: 'site_goma', recipientEntityType: 'vendor', recipientEntityId: 'goma_isp_provider', recipientEntityName: 'GomaNet ISP', level: 'site', relatedSiteId: 'site_goma' },

  // Site Kinshasa to Small Group Transfers
  { id: 'txn_site_kin_sg_unikin_1', date: '2024-07-16', amount: 250, description: 'UNIKIN SG Seminar Resources', transactionType: 'transfer', senderEntityType: 'site', senderEntityId: 'site_kinshasa', recipientEntityType: 'small_group', recipientEntityId: 'sg_kinshasa_unikin', level: 'site', relatedSiteId: 'site_kinshasa', relatedSmallGroupId: 'sg_kinshasa_unikin' },
  { id: 'txn_site_kin_sg_alumni_1', date: '2024-07-17', amount: 200, description: 'Kinshasa Alumni Networking Event', transactionType: 'transfer', senderEntityType: 'site', senderEntityId: 'site_kinshasa', recipientEntityType: 'small_group', recipientEntityId: 'sg_kinshasa_alumni', level: 'site', relatedSiteId: 'site_kinshasa', relatedSmallGroupId: 'sg_kinshasa_alumni' },
  
  // Site Kinshasa Expenses
  { id: 'txn_site_kin_exp_1', date: '2024-07-20', amount: 150, description: 'Office Rent - Kinshasa Site', transactionType: 'expense', senderEntityType: 'site', senderEntityId: 'site_kinshasa', recipientEntityType: 'vendor', recipientEntityId: 'kin_office_space', recipientEntityName: 'Kin Spaces Ltd', level: 'site', relatedSiteId: 'site_kinshasa' },
  { id: 'txn_site_kin_exp_2', date: '2024-07-28', amount: 100, description: 'Communication Allowance - Kinshasa Coordinator', transactionType: 'expense', senderEntityType: 'site', senderEntityId: 'site_kinshasa', recipientEntityType: 'other', recipientEntityId: 'comm_allow_kin', recipientEntityName: 'Coordinator Communication', level: 'site', relatedSiteId: 'site_kinshasa' },

  // Site Lubumbashi to Small Group Transfers
  { id: 'txn_site_lub_sg_unilu_1', date: '2024-07-18', amount: 220, description: 'UNILU SG Leadership Training', transactionType: 'transfer', senderEntityType: 'site', senderEntityId: 'site_lubumbashi', recipientEntityType: 'small_group', recipientEntityId: 'sg_lubumbashi_unilu', level: 'site', relatedSiteId: 'site_lubumbashi', relatedSmallGroupId: 'sg_lubumbashi_unilu' },
  { id: 'txn_site_lub_sg_alumni_1', date: '2024-07-19', amount: 180, description: 'Lubumbashi Alumni Mentorship Program', transactionType: 'transfer', senderEntityType: 'site', senderEntityId: 'site_lubumbashi', recipientEntityType: 'small_group', recipientEntityId: 'sg_lubumbashi_alumni', level: 'site', relatedSiteId: 'site_lubumbashi', relatedSmallGroupId: 'sg_lubumbashi_alumni' },

  // Site Lubumbashi Expenses
  { id: 'txn_site_lub_exp_1', date: '2024-07-22', amount: 130, description: 'Event Banners and Materials - Lubumbashi', transactionType: 'expense', senderEntityType: 'site', senderEntityId: 'site_lubumbashi', recipientEntityType: 'vendor', recipientEntityId: 'lub_print_co', recipientEntityName: 'Lubumbashi Print Co', level: 'site', relatedSiteId: 'site_lubumbashi' },
  { id: 'txn_site_lub_exp_2', date: '2024-07-29', amount: 90, description: 'Utility Bills - Lubumbashi Site Office', transactionType: 'expense', senderEntityType: 'site', senderEntityId: 'site_lubumbashi', recipientEntityType: 'vendor', recipientEntityId: 'lub_utility_serv', recipientEntityName: 'Lubumbashi Utilities', level: 'site', relatedSiteId: 'site_lubumbashi' },

  // Transfers and Expenses for other sites (simplified, one per category)
  // Bunia
  { id: 'txn_site_bunia_sg_unibu_1', date: '2024-07-20', amount: 100, description: 'UNIBU SG Study Materials', transactionType: 'transfer', senderEntityType: 'site', senderEntityId: 'site_bunia', recipientEntityType: 'small_group', recipientEntityId: 'sg_bunia_unibu', level: 'site', relatedSiteId: 'site_bunia', relatedSmallGroupId: 'sg_bunia_unibu' },
  { id: 'txn_site_bunia_exp_1', date: '2024-07-25', amount: 50, description: 'Refreshments for Bunia Site Meeting', transactionType: 'expense', senderEntityType: 'site', senderEntityId: 'site_bunia', recipientEntityType: 'vendor', recipientEntityId: 'bunia_refresh', recipientEntityName: 'Bunia Refreshments', level: 'site', relatedSiteId: 'site_bunia' },
  // Butembo
  { id: 'txn_site_butembo_sg_ucg_1', date: '2024-07-21', amount: 110, description: 'UCG SG Outreach Support', transactionType: 'transfer', senderEntityType: 'site', senderEntityId: 'site_butembo', recipientEntityType: 'small_group', recipientEntityId: 'sg_butembo_ucg', level: 'site', relatedSiteId: 'site_butembo', relatedSmallGroupId: 'sg_butembo_ucg' },
  { id: 'txn_site_butembo_exp_1', date: '2024-07-26', amount: 60, description: 'Transport for Butembo Site Visit', transactionType: 'expense', senderEntityType: 'site', senderEntityId: 'site_butembo', recipientEntityType: 'other', recipientEntityId: 'butembo_transport', recipientEntityName: 'Butembo Transport Co', level: 'site', relatedSiteId: 'site_butembo' },
  // Kalemie
  { id: 'txn_site_kalemie_sg_isp_1', date: '2024-07-22', amount: 90, description: 'ISP SG Event Support', transactionType: 'transfer', senderEntityType: 'site', senderEntityId: 'site_kalemie', recipientEntityType: 'small_group', recipientEntityId: 'sg_kalemie_isp', level: 'site', relatedSiteId: 'site_kalemie', relatedSmallGroupId: 'sg_kalemie_isp' },
  { id: 'txn_site_kalemie_exp_1', date: '2024-07-27', amount: 40, description: 'Stationery for Kalemie Site', transactionType: 'expense', senderEntityType: 'site', senderEntityId: 'site_kalemie', recipientEntityType: 'vendor', recipientEntityId: 'kalemie_stationery', recipientEntityName: 'Kalemie Supplies', level: 'site', relatedSiteId: 'site_kalemie' },
  // Kisangani
  { id: 'txn_site_kisangani_sg_unikis_1', date: '2024-07-23', amount: 120, description: 'UNIKIS SG Workshop Materials', transactionType: 'transfer', senderEntityType: 'site', senderEntityId: 'site_kisangani', recipientEntityType: 'small_group', recipientEntityId: 'sg_kisangani_unikis', level: 'site', relatedSiteId: 'site_kisangani', relatedSmallGroupId: 'sg_kisangani_unikis' },
  { id: 'txn_site_kisangani_exp_1', date: '2024-07-28', amount: 70, description: 'Kisangani Site Meeting Room Rental', transactionType: 'expense', senderEntityType: 'site', senderEntityId: 'site_kisangani', recipientEntityType: 'vendor', recipientEntityId: 'kisangani_venue', recipientEntityName: 'Kisangani Halls', level: 'site', relatedSiteId: 'site_kisangani' },
  // Kolwezi
  { id: 'txn_site_kolwezi_sg_unikol_1', date: '2024-07-24', amount: 80, description: 'UNIKOL SG Book Purchase', transactionType: 'transfer', senderEntityType: 'site', senderEntityId: 'site_kolwezi', recipientEntityType: 'small_group', recipientEntityId: 'sg_kolwezi_unikol', level: 'site', relatedSiteId: 'site_kolwezi', relatedSmallGroupId: 'sg_kolwezi_unikol' },
  { id: 'txn_site_kolwezi_exp_1', date: '2024-07-29', amount: 30, description: 'Printing - Kolwezi Site', transactionType: 'expense', senderEntityType: 'site', senderEntityId: 'site_kolwezi', recipientEntityType: 'vendor', recipientEntityId: 'kolwezi_prints', recipientEntityName: 'Kolwezi Print Shop', level: 'site', relatedSiteId: 'site_kolwezi' },
  // Uvira
  { id: 'txn_site_uvira_sg_isdr_1', date: '2024-07-25', amount: 70, description: 'ISDR SG Activity Support', transactionType: 'transfer', senderEntityType: 'site', senderEntityId: 'site_uvira', recipientEntityType: 'small_group', recipientEntityId: 'sg_uvira_isdr', level: 'site', relatedSiteId: 'site_uvira', relatedSmallGroupId: 'sg_uvira_isdr' },
  { id: 'txn_site_uvira_exp_1', date: '2024-07-30', amount: 45, description: 'Refreshments Uvira Site Leaders Mtg', transactionType: 'expense', senderEntityType: 'site', senderEntityId: 'site_uvira', recipientEntityType: 'vendor', recipientEntityId: 'uvira_catering', recipientEntityName: 'Uvira Eats', level: 'site', relatedSiteId: 'site_uvira' },
];

// Ensure all mock transactions have sender/recipient names if not defined
mockTransactions.forEach(t => {
    if (!t.senderEntityName && t.senderEntityType !== 'external_donor' && t.senderEntityType !== 'vendor' && t.senderEntityType !== 'beneficiary' && t.senderEntityType !== 'other') {
        if(t.senderEntityType === 'national') t.senderEntityName = "AYLF National";
        else if (t.senderEntityType === 'site') t.senderEntityName = mockSites.find(s => s.id === t.senderEntityId)?.name;
        else if (t.senderEntityType === 'small_group') t.senderEntityName = mockSmallGroups.find(sg => sg.id === t.senderEntityId)?.name;
    }
    if (!t.recipientEntityName && t.recipientEntityType !== 'external_donor' && t.recipientEntityType !== 'vendor' && t.recipientEntityType !== 'beneficiary' && t.recipientEntityType !== 'other') {
        if(t.recipientEntityType === 'national') t.recipientEntityName = "AYLF National";
        else if (t.recipientEntityType === 'site') t.recipientEntityName = mockSites.find(s => s.id === t.recipientEntityId)?.name;
        else if (t.recipientEntityType === 'small_group') t.recipientEntityName = mockSmallGroups.find(sg => sg.id === t.recipientEntityId)?.name;
    }
});

// Populate participantsCountReported for mock reports
mockReports.forEach(report => {
  if (report.girlsCount !== undefined && report.boysCount !== undefined) {
    report.participantsCountReported = report.girlsCount + report.boysCount;
  } else if (report.girlsCount !== undefined) {
    report.participantsCountReported = report.girlsCount;
  } else if (report.boysCount !== undefined) {
    report.participantsCountReported = report.boysCount;
  }
  // If neither is defined, participantsCountReported remains as potentially manually set or undefined.
});

// Ensure activities have participant counts if related reports have them
mockActivities.forEach(activity => {
  if (activity.participantsCount === undefined) {
    const relatedReport = mockReports.find(
      report => 
        (report.level === activity.level && 
        ((activity.level === 'national') || 
         (activity.level === 'site' && report.siteId === activity.siteId) ||
         (activity.level === 'small_group' && report.smallGroupId === activity.smallGroupId)) &&
         report.title.toLowerCase().includes(activity.name.toLowerCase().substring(0,10))) // Basic matching
    );
    if (relatedReport && relatedReport.participantsCountReported !== undefined) {
      activity.participantsCount = relatedReport.participantsCountReported;
    }
  }
});
