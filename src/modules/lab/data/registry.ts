export type LabCategory = 'workbench' | 'papers' | 'ongoing' | 'library';

export interface LabItem {
	id: string;
	title: string;
	category: LabCategory;
	subtitle: string;
	tags: string[];
	year: string;
	status: 'LIVE' | 'PUBLISHED' | 'IN PROGRESS' | 'RESTRICTED';
	// Workbench-specific fields
	appUrl?: string;
	// Category-specific metadata
	author?: string;
	venue?: string;
	abstract?: string;
	progress?: string;
	completion?: number;
	notesPreview?: string;
	bibtex?: string;
	repoUrl?: string;
}

export const LAB_ITEMS: LabItem[] = [
	// ========================
	// 1. WORKBENCH
	// ========================
	{
		id: 'evaluator',
		title: 'Evaluator',
		category: 'workbench',
		subtitle:
			'Transforms structured JSON outputs from Gemini and ChatGPT into formatted, detailed evaluation Excel spreadsheets.',
		appUrl: 'https://jingerlab.github.io/grader',
		tags: ['JSON → XLSX', 'Grading', 'Automation'],
		year: '2026',
		status: 'LIVE',
	},
	{
		id: 'marks-calculator',
		title: 'Marks Calculator',
		category: 'workbench',
		subtitle:
			'Comprehensive MCQ scoring engine supporting partial marking, multiple-correct schemes, and custom negative marking rules.',
		appUrl: 'https://jingerlab.github.io/marks_calculator',
		tags: ['Assessment', 'Scoring', 'Client-Side'],
		year: '2026',
		status: 'LIVE',
	},
	{
		id: 'auditor',
		title: 'Auditor',
		category: 'workbench',
		subtitle:
			'Browser-based inspection and verification utility for auditing structured records, submissions, and outputs.',
		appUrl: 'https://jingerlab.github.io/auditor',
		tags: ['Audit', 'Verification', 'Client-Side'],
		year: '2026',
		status: 'LIVE',
	},
	{
		id: 'jingerslides',
		title: 'JingerSlides 3D Studio',
		category: 'workbench',
		subtitle:
			'Browser-based, component-driven 3D presentation studio transforming slides into multi-axis spatial web experiences with single-file HTML exports.',
		appUrl: 'https://jingerlab.github.io/jingerslides',
		tags: ['3D Canvas', 'Presentations', 'Zero-Dep'],
		year: '2026',
		status: 'LIVE',
	},
	{
		id: 'concatenator',
		title: 'Spreadsheet Concatenator',
		category: 'workbench',
		subtitle:
			'Client-side Excel and CSV column processor using SheetJS to extract, rename, prefix, and merge columns with live preview and .xlsx export.',
		appUrl: 'https://jingerlab.github.io/concatenator',
		tags: ['SheetJS', 'Excel / CSV', 'ETL'],
		year: '2026',
		status: 'LIVE',
	},
	{
		id: 'chaos-simulator',
		title: 'Chaos & Iterative Map Simulator',
		category: 'workbench',
		subtitle:
			'Interactive Xₙ₊₁ = f(Xₙ) simulator visualizing perturbed trajectories, cobweb diagrams, and final-state divergence across custom maps.',
		appUrl: 'https://jingerlab.github.io/chaos_simulator',
		tags: ['Chaos Theory', 'Math.js', 'Chart.js'],
		year: '2026',
		status: 'LIVE',
	},

	// ========================
	// 2. PUBLISHED PAPERS
	// ========================
	{
		id: 'forensic-vit-benchmark',
		title: 'Cross-Template Document Forgery Detection',
		category: 'papers',
		subtitle: 'Patch-level linear probing across 23 vision foundation models.',
		abstract:
			'We evaluate cross-template generalization across 23 self-supervised and vision-language backbones under physical recapture and digital tampering regimes.',
		tags: ['Computer Vision', 'Forensics', 'ViT'],
		year: '2026',
		status: 'PUBLISHED',
		venue: 'Preprint / Technical Report',
		bibtex: `@article{jinger2026forgery,\n  title={Cross-Template Document Forgery Detection},\n  author={Jinger, Harsh},\n  year={2026}\n}`,
	},

	// ========================
	// 3. ONGOING RESEARCH
	// ========================
	{
		id: 'railway-cascade-dynamics',
		title: 'Cascade Dynamics in Rail Transit Networks',
		category: 'ongoing',
		subtitle: 'Modeling non-linear delay amplification and empirical recovery thresholds.',
		tags: ['Operations', 'Complex Systems', 'Time Series'],
		year: '2026',
		status: 'IN PROGRESS',
		progress: 'Empirical Calibration',
		completion: 68,
	},

	// ========================
	// 4. LIBRARY (Passphrase-Gated)
	// ========================
	{
		id: 'time-series-shumway',
		title: 'Time Series Analysis and Its Applications',
		category: 'library',
		author: 'Shumway & Stoffer',
		subtitle: 'Annotated chapter notes, state-space derivations, and lab scripts.',
		notesPreview: 'Chapters 1–6: ARIMA, Spectral Density & Kalman Filtering.',
		tags: ['Time Series', 'Reference', 'Course Material'],
		year: '4th Ed.',
		status: 'RESTRICTED',
	},
];
