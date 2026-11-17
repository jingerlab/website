export type LabCategory = 'workbench' | 'papers' | 'ongoing' | 'library';

export interface LabItem {
	id: string;
	title: string;
	category: LabCategory;
	subtitle: string;
	tags: string[];
	year: string;
	status: 'LIVE' | 'PUBLISHED' | 'IN PROGRESS' | 'RESTRICTED';
	previewType?: 'waveform';
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
	{
		id: 'non-linear-delay-sim',
		title: 'Non-Linear Delay & Chaos Explorer',
		category: 'workbench',
		subtitle: 'Interactive phase-space and propagation simulator for network delays.',
		tags: ['Econometrics', 'Chaos Theory', 'Interactive'],
		year: '2026',
		status: 'LIVE',
		previewType: 'waveform',
	},
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
