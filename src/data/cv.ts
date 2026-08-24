export interface Experience {
	company: string;
	role: string;
	period: string;
	highlights: string[];
	technologies: string[];
}

export interface Education {
	institution: string;
	degree: string;
	period: string;
	description?: string;
}

export interface Skill {
	category: string;
	items: string[];
}

export interface CVData {
	name: string;
	title: string;
	summary: string;
	location: string;
	email: string;
	phone: string;
	experience: Experience[];
	education: Education[];
	skills: Skill[];
	languages: { name: string; level: string }[];
}

export const cv: CVData = {
	name: 'Luis Alfonso Montoto García',
	title: 'Junior Full-Stack Developer',
	summary:
		'Motivated developer transitioning into full-stack web development after a career in 3D animation, bringing strong problem-solving skills, experience working in international, multidisciplinary teams, and a commitment to writing clean, reliable code. Hands-on experience with Java, C++, C#, TypeScript, React, Node.js, Express, MySQL and MongoDB, currently building production projects including a client website and a data-analysis web application.',
	location: 'Sevilla, Spain',
	email: 'luisirk.montoto@gmail.com',
	phone: '(34) 660 74 23 87',
	experience: [
		{
			company: 'Lean Mind (Remote, Canarias)',
			role: 'Software Development Intern',
			period: 'March 2026 – July 2026',
			highlights: [
				'Contributed to a live software project using JavaScript, TypeScript, Java, and MySQL, applying Test-Driven Development (TDD) and writing unit tests before implementation.',
				'Used test doubles — stubs, spies, and mocks — to isolate components and test business logic without external dependencies.',
				'Practiced TDD through coding katas — including Shopping Cart, Password Validator, and Mars Rover — in JavaScript, TypeScript, and Java, to reinforce test-first development habits.',
				'Collaborated remotely with a development team, following code review and pair-programming practices.',
				'Built a real-time Pomodoro Timer (Node.js, Express, Socket.io) as an internship deliverable.',
			],
			technologies: ['JavaScript', 'TypeScript', 'Java', 'MySQL', 'Node.js', 'Express', 'Socket.io'],
		},
		{
			company: 'Bwater, Canarias',
			role: '3D Animator — "Kayara" & "Klinkus"',
			period: '2021 – 2024',
			highlights: [
				'Worked as a 3D animator in a multicultural team on the feature film "Kayara" and the Italian series "Klinkus."',
				'Developed custom tools and scripts for Blender to streamline animation and studio workflows.',
			],
			technologies: ['Blender'],
		},
		{
			company: 'Atlantis Animation, Canarias',
			role: '3D Animator — "Miraculous Ladybug" (Disney)',
			period: '2020 – 2021',
			highlights: [
				'Animated for the Disney Channel series "Miraculous Ladybug" within an international, multidisciplinary team.',
			],
			technologies: [],
		},
		{
			company: 'Informed Plus, Rotterdam (Netherlands)',
			role: '3D Animator & Client Coordinator',
			period: '2020 – 2021',
			highlights: [
				'Produced animation projects for healthcare, hospital, and pharmaceutical clients.',
				'Acted as client-facing coordinator for the animation department, managing feedback and delivery timelines.',
			],
			technologies: [],
		},
		{
			company: 'Bol.com, Tilburg (Netherlands)',
			role: 'Warehouse Operative',
			period: '2019 – 2020',
			highlights: [
				'Worked as a store/warehouse operative in a large retail logistics center.',
			],
			technologies: [],
		},
	],
	education: [
		{
			institution: 'Ilerna, Sevilla',
			degree: 'Higher Vocational Training (FP Grado Superior) in Web Development',
			period: '2024 – 2026',
		},
		{
			institution: 'Animation Mentor, USA (Online)',
			degree: '3D Animation Specialization',
			period: '2020 – 2022',
		},
		{
			institution: 'EUSA, Sevilla',
			degree: 'Higher Vocational Training (FP Grado Superior) in 2D/3D Animation & Interactive Environments',
			period: '2018 – 2020',
		},
		{
			institution: 'Universidad de Sevilla, Sevilla',
			degree: 'Degree in Industrial Design Engineering',
			period: '2012 – 2018',
			description: 'Not finished',
		},
	],
	skills: [
		{
			category: 'Languages',
			items: ['Java', 'C++', 'C#', 'TypeScript', 'JavaScript', 'Python', 'SQL'],
		},
		{
			category: 'Frontend',
			items: ['React', 'Astro', 'Vue', 'Svelte', 'HTML', 'CSS', 'Tailwind CSS'],
		},
		{
			category: 'Backend & Databases',
			items: ['Node.js', 'Express', 'MongoDB', 'MySQL', 'PostgreSQL', 'REST APIs'],
		},
		{
			category: 'Tools',
			items: ['Git', 'GitHub', 'Docker', 'Linux', 'CI/CD'],
		},
		{
			category: 'AI-Assisted Development',
			items: ['Copilot', 'Claude'],
		},
	],
	languages: [
		{ name: 'Spanish', level: 'Native' },
		{ name: 'English', level: 'Fluent' },
	],
};
