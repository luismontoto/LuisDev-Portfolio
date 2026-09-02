export interface Project {
	id: string;
	title: string;
	description: string;
	tags: string[];
	architecture?: string[];
	status: 'Live' | 'In Progress' | 'Planned';
	link?: string;
	repo?: string;
	year: number;
}

export const projects: Project[] = [
	{
		id: 'psychology-website',
		title: 'Website for Psychology Practice',
		description:
			'Custom website for a psychology practice (Ester Benjumea), built with React + Vite and TypeScript. Features include service presentation (individual therapy, couples therapy, online therapy, personal growth), contact form with WhatsApp integration, Doctoralia booking link, and a design focused on accessibility and approachability. Deployed on Vercel.',
		tags: ['React', 'Vite', 'TypeScript', 'CSS Modules', 'Client Project'],
		status: 'Live',
		link: 'https://web-ester-tau.vercel.app/',
		year: 2026,
	},
	{
		id: 'pomodoro-timer',
		title: 'Pomodoro Timer',
		description:
			'Real-time productivity timer implementing the Pomodoro technique, developed for Lean Mind using Test-Driven Development, with task tracking and pomodoro-per-task counters. Timer state is managed server-side and synced live to the client via WebSockets, ensuring accuracy across tab switches and reconnects. Includes browser notifications and generated audio alerts (Web Audio API) on session completion.',
		tags: ['Node.js', 'Express', 'Socket.io', 'TDD'],
		status: 'Live',
		year: 2026,
	},
	{
		id: 'wh40k-analyzer',
		title: 'WH40k Tournament Analyzer',
		description:
			'Web application for analyzing Warhammer 40k competitive meta using tournament data from Best Coast Pairing. Evaluates army performance, win rates by mission type, and list composition analytics.',
		tags: ['Data Analysis', 'Web App', 'Competitive Gaming', 'Statistics'],
		architecture: [
			'Data ingestion from Best Coast Pairing (win/loss, points, missions, opponents, list composition)',
			'Mission-based role classification: Take and Hold, Purge the Foe, Disruption, Reconnaissance, Priority Assets',
			'Statistical analysis engine for win rates, consistency metrics, and mission-specific performance',
			'Aggregation pipeline for multi-mission tournament data',
			'Adaptive meta-game tracking across balance patches',
		],
		status: 'In Progress',
		year: 2026,
	},
	{
		id: 'luisdev-portfolio',
		title: 'LuisDev Portfolio',
		description:
			'Designed and deployed a personal portfolio site to showcase projects, skills, and background, optimized for performance.',
		tags: ['Astro', 'Tailwind CSS', 'TypeScript', 'Portfolio'],
		status: 'Live',
		link: '/',
		year: 2026,
	},
];

export function getProjectById(id: string): Project | undefined {
	return projects.find((p) => p.id === id);
}

export function getProjectsByStatus(status: Project['status']): Project[] {
	return projects.filter((p) => p.status === status);
}
