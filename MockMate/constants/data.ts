import {
	ArrowBigUpDash,
	AudioLines,
	BadgeCheck,
	Banknote,
	ChartSpline,
	Clock,
	Crown,
	Gem,
	GraduationCap,
	HeartPulse,
	List,
	ListTodo,
	Megaphone,
	Package,
	PencilRuler,
	Snowflake,
	SquareTerminal,
	Store
} from "lucide-react-native";

export const status = {
	streaks: 6,
	gems: 450,
	vipStatus: false,
	hasLearnedToday: false,
};

export const weekDaysLabels = {
	monday: { label: "Monday", shortenLabel: "M" },
	tuesday: { label: "Tuesday", shortenLabel: "T" },
	wednesday: { label: "Wednesday", shortenLabel: "W" },
	thursday: { label: "Thursday", shortenLabel: "T" },
	friday: { label: "Friday", shortenLabel: "F" },
	saturday: { label: "Saturday", shortenLabel: "S" },
	sunday: { label: "Sunday", shortenLabel: "S" },
};

export const industriesCategories = [
	{
		title: "All",
		category: "All",
	},
	{
		title: "IT",
		category: "IT",
	},
	{
		title: "Sales",
		category: "Sales",
	},
	{
		title: "Finance",
		category: "Finance",
	},
	{
		title: "Design",
		category: "Design",
	},
	{
		title: "Manager",
		category: "Manager",
	},
	{
		title: "Marketing",
		category: "Marketing",
	},
	{
		title: "HealthCare",
		category: "HealthCare",
	},
	{
		title: "Education",
		category: "Education",
	},
];

export const industries = {
	IT: {
		title: "IT",
		icon: SquareTerminal,
		iconColor: "#059669",
		backgroundColor: "#ECFDF5",
	},
	Sales: {
		title: "Sales",
		icon: Store,
		iconColor: "#EA580C",
		backgroundColor: "#FFEDD5",
	},
	Finance: {
		title: "Finance",
		icon: Banknote,
		iconColor: "#2563EB",
		backgroundColor: "#DBEAFE",
	},
	Design: {
		title: "Design",
		icon: PencilRuler,
		iconColor: "#9333EA",
		backgroundColor: "#F3E8FF",
	},
	Manager: {
		title: "Manager",
		icon: Package,
		iconColor: "#4F46E5",
		backgroundColor: "#EEF2FF",
	},
	Marketing: {
		title: "Marketing",
		icon: Megaphone,
		iconColor: "#DB2777",
		backgroundColor: "#FCE7F3",
	},
	HealthCare: {
		title: "HealthCare",
		icon: HeartPulse,
		iconColor: "#DC2626",
		backgroundColor: "#FEF2F2",
	},
	Education: {
		title: "Education",
		icon: GraduationCap,
		iconColor: "#F59E0B",
		backgroundColor: "#FFFBEB",
	},
};

export const difficulties = {
	Easy: {
		title: "Easy",
		color: "#10B981",
		backgroundColor: "#D1FADF",
	},
	Medium: {
		title: "Medium",
		color: "#F59E0B",
		backgroundColor: "#FFF7D4",
	},
	Hard: {
		title: "Hard",
		color: "#DC2626",
		backgroundColor: "#FEE2E2",
	},
};

export const cardsData = [
	{
		id: 1,
		title: "Senior UX Designer",
		industry: industries.Design.title,
		difficulty: difficulties.Hard.title,
		questions: 6,
		review: 4.8,
		reviewCount: 120,
		focusArea: "User Research & Interaction Design",
		isFavourite: true,
	},
	{
		id: 2,
		title: "Entry-Level Product Manager",
		industry: industries.Manager.title,
		difficulty: difficulties.Easy.title,
		questions: 5,
		review: 4.5,
		reviewCount: 89,
		focusArea: "Product Strategy & Roadmapping",
		isFavourite: false,
	},
	{
		id: 3,
		title: "Intermediate Software Engineer",
		industry: industries.IT.title,
		difficulty: difficulties.Medium.title,
		questions: 7,
		review: 4.7,
		reviewCount: 156,
		focusArea: "Software Development & Architecture",
		isFavourite: false,
	},
	{
		id: 4,
		title: "Junior Data Analyst",
		industry: industries.IT.title,
		difficulty: difficulties.Easy.title,
		questions: 8,
		review: 4.6,
		reviewCount: 95,
		focusArea: "Data Visualization & SQL",
		isFavourite: false,
	},
	{
		id: 5,
		title: "Senior DevOps Engineer",
		industry: industries.IT.title,
		difficulty: difficulties.Hard.title,
		questions: 10,
		review: 4.9,
		reviewCount: 210,
		focusArea: "CI/CD & Cloud Infrastructure",
		isFavourite: false,
	},
	{
		id: 6,
		title: "Mid-Level Marketing Specialist",
		industry: industries.Marketing.title,
		difficulty: difficulties.Medium.title,
		questions: 3,
		review: 4.4,
		reviewCount: 78,
		focusArea: "Digital Marketing & Analytics",
		isFavourite: false,
	},
	{
		id: 7,
		title: "Entry-Level Graphic Designer",
		industry: industries.Design.title,
		difficulty: difficulties.Easy.title,
		questions: 4,
		review: 4.3,
		reviewCount: 67,
		focusArea: "Branding & Visual Design",
		isFavourite: false,
	},
	{
		id: 8,
		title: "Senior Product Owner",
		industry: industries.Manager.title,
		difficulty: difficulties.Hard.title,
		questions: 5,
		review: 4.7,
		reviewCount: 134,
		focusArea: "Agile Practices & Stakeholder Management",
		isFavourite: false,
	},
];

export const featuredCardsData = [
	{
		id: 9,
		title: "Senior UX Designer",
		industry: industries.Design.title,
		difficulty: difficulties.Hard.title,
		questions: 6,
		review: 4.7,
		reviewCount: 120,
		focusArea: "User Research & Interaction Design",
		isFavourite: true,
	},
	{
		id: 10,
		title: "Entry-Level Product Manager",
		industry: industries.Manager.title,
		difficulty: difficulties.Easy.title,
		questions: 5,
		review: 4.5,
		reviewCount: 89,
		focusArea: "Product Strategy & Roadmapping",
		isFavourite: false,
	},
	{
		id: 11,
		title: "Intermediate Software Engineer",
		industry: industries.IT.title,
		difficulty: difficulties.Medium.title,
		questions: 7,
		review: 4.9,
		reviewCount: 156,
		focusArea: "Software Development & Architecture",
		isFavourite: false,
	},
];

export const questType = {
	completeMock: {
		icon: ListTodo,
		iconColor: "#EAB308",
		backgroundColor: "#FEF9C3",
	},
	learnMinutes: {
		icon: AudioLines,
		iconColor: "#EA580C",
		backgroundColor: "#FFEDD5",
	},
	earnEXP: {
		icon: ChartSpline,
		iconColor: "#9333EA",
		backgroundColor: "#F3E8FF",
	},
	earnGems: {
		icon: Gem,
		iconColor: "#2563EB",
		backgroundColor: "#DBEAFE",
	},
};

export const questData = {
	completeMock: {
		title: "Complete Mock Interview",
		description() {
			return `Complete ${this.requirements} Mock Interviews`;
		},
		requirements: Math.floor(Math.random() * 5) + 1,
		progress: 0,
		reward() {
			return this.requirements * 25;
		},
		icon: questType.completeMock.icon,
		iconColor: questType.completeMock.iconColor,
		backgroundColor: questType.completeMock.backgroundColor,
	},
	learnMinutes: {
		title: "Vocal Stamina",
		description() {
			return `Learn ${this.requirements} Minutes`;
		},
		requirements: Math.floor(Math.random() * 26) + 5,
		progress: 3,
		reward() {
			return this.requirements * 25;
		},
		icon: questType.learnMinutes.icon,
		iconColor: questType.learnMinutes.iconColor,
		backgroundColor: questType.learnMinutes.backgroundColor,
	},
	earnEXP: {
		title: "Earn EXP",
		description() {
			return `Earn ${this.requirements} EXP`;
		},
		requirements: Math.floor(Math.random() * 50) + 25,
		progress: 10,
		reward() {
			return this.requirements * 10;
		},
		icon: questType.earnEXP.icon,
		iconColor: questType.earnEXP.iconColor,
		backgroundColor: questType.earnEXP.backgroundColor,
	},
	earnGems: {
		title: "Earn Gems",
		description() {
			return `Earn ${this.requirements} Gems`;
		},
		requirements: Math.floor(Math.random() * 100) + 50,
		progress: 0,
		reward() {
			return this.requirements;
		},
		icon: questType.earnGems.icon,
		iconColor: questType.earnGems.iconColor,
		backgroundColor: questType.earnGems.backgroundColor,
	},
};

export const shopCardData = {
	goPremium: {
		id: 1,
		badgeIcon: BadgeCheck,
		badgeTitle: "Premium",
		badgeBgColor: "#EFF6FF",
		badgeBgStroke: "#FFFFFF",
		title: "Go Premium",
		description: "Get unlimited AI feedback and more features!",
		buttonTitle: "Try Free for 7 Days",
		cardIcon: Crown,
		cardTextColor: "#FFFFFF",
		cardBgColor: "#0D59F2",
	},
	subscribe: {
		id: 2,
		badgeIcon: Clock,
		badgeTitle: "Daily Deal",
		badgeBgColor: "#EFF6FF",
		badgeBgStroke: "#FFFFFF",
		title: "Interview Pack",
		description: "50+ Top tech interview questions.",
		buttonTitle: "Click Now!",
		cardIcon: List,
		cardTextColor: "#FFFFFF",
		cardBgColor: "#6B21A8",
	},
};

export const powerUpsData = {
	streakFreeze: {
		id: 1,
		title: "Streak Freeze",
		description: "Protect your streak for one day.",
		price: 200,
		icon: Snowflake,
		iconColor: "#3B82F6",
		backgroundColor: "#EFF6FF",
	},
	doubleXP: {
		id: 2,
		title: "Double XP",
		description: "Earn double XP for 30 mins.",
		price: 350,
		icon: ArrowBigUpDash,
		iconColor: "#9333EA",
		backgroundColor: "#F5F3FF",
	},
};

export const vipPlanData = {
	Yearly: {
		id: 1,
		title: "Yearly Plan",
		price: (10 * 12),
		priceDiscount: ((10 * 12) / 2),
		priceForEachMonth: (10 / 2),
	},
	Monthly: {
		id: 2,
		title: "Monthly Plan",
		price: 10,
	},
}