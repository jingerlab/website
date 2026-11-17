import React, { useState, useEffect } from 'react';
import {
	Wrench,
	FileText,
	FlaskConical,
	BookMarked,
	Search,
	Lock,
	Unlock,
	ArrowLeft,
	Terminal,
	Copy,
	Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LAB_ITEMS, type LabCategory, type LabItem } from '../data/registry';
import { CardPreview } from './CardPreview';
import { LibraryGate } from './LibraryGate';

const SECTIONS: { id: LabCategory; label: string; icon: React.ElementType; locked?: boolean }[] = [
	{ id: 'workbench', label: 'Workbench', icon: Wrench },
	{ id: 'papers', label: 'Published Papers', icon: FileText },
	{ id: 'ongoing', label: 'Ongoing Research', icon: FlaskConical },
	{ id: 'library', label: 'Library', icon: BookMarked, locked: true },
];

export function LabWorkspace() {
	const [activeCategory, setActiveCategory] = useState<LabCategory>('workbench');
	const [activeItem, setActiveItem] = useState<LabItem | null>(null);
	const [query, setQuery] = useState('');
	const [isLibraryUnlocked, setIsLibraryUnlocked] = useState(false);
	const [copiedBib, setCopiedBib] = useState(false);

	useEffect(() => {
		if (sessionStorage.getItem('jingerlab_library_unlocked') === 'true') {
			setIsLibraryUnlocked(true);
		}
	}, []);

	const handleLockLibrary = () => {
		sessionStorage.removeItem('jingerlab_library_unlocked');
		setIsLibraryUnlocked(false);
		if (activeItem?.category === 'library') setActiveItem(null);
	};

	const filteredItems = LAB_ITEMS.filter(
		(item) =>
			item.category === activeCategory &&
			(item.title.toLowerCase().includes(query.toLowerCase()) ||
				item.tags.some((t) => t.toLowerCase().includes(query.toLowerCase())))
	);

	const isLockedView = activeCategory === 'library' && !isLibraryUnlocked;

	return (
		<div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6 min-h-[calc(100vh-9rem)]">
			{/* Left Sidebar */}
			<aside className="flex flex-col gap-4 md:border-r md:pr-4">
				<div className="relative">
					<Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
					<Input
						placeholder="Filter lab..."
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						className="pl-8 h-8 text-xs"
					/>
				</div>

				<nav className="space-y-1">
					{SECTIONS.map(({ id, label, icon: Icon, locked }) => {
						const count = LAB_ITEMS.filter((i) => i.category === id).length;
						const isSelected = activeCategory === id;
						return (
							<button
								key={id}
								onClick={() => {
									setActiveCategory(id);
									setActiveItem(null);
								}}
								className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${isSelected
										? 'bg-primary text-primary-foreground font-medium'
										: 'hover:bg-muted text-muted-foreground hover:text-foreground'
									}`}
							>
								<span className="flex items-center gap-2.5">
									<Icon className="w-4 h-4" />
									{label}
								</span>
								<span className="flex items-center gap-1.5 text-xs font-mono opacity-80">
									{locked && (isLibraryUnlocked ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />)}
									{!locked || isLibraryUnlocked ? count : ''}
								</span>
							</button>
						);
					})}
				</nav>

				{/* Quick-launch items in active section */}
				{!isLockedView && (
					<div className="pt-4 border-t">
						<div className="flex items-center justify-between mb-2 px-2">
							<p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
								In {activeCategory}
							</p>
							{activeCategory === 'library' && isLibraryUnlocked && (
								<button
									onClick={handleLockLibrary}
									className="text-[10px] font-mono text-muted-foreground hover:text-foreground underline"
								>
									Lock
								</button>
							)}
						</div>
						<div className="space-y-1">
							{filteredItems.map((item) => (
								<button
									key={item.id}
									onClick={() => setActiveItem(item)}
									className={`w-full text-left px-2.5 py-1.5 rounded text-xs truncate transition-colors ${activeItem?.id === item.id
											? 'bg-accent text-accent-foreground font-medium'
											: 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
										}`}
								>
									{item.title}
								</button>
							))}
						</div>
					</div>
				)}
			</aside>

			{/* Main Right Pane */}
			<main className="min-w-0">
				{isLockedView ? (
					<LibraryGate onUnlock={() => setIsLibraryUnlocked(true)} />
				) : activeItem ? (
					/* WebWindow Viewport */
					<div className="flex flex-col h-full rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
						<div className="flex items-center justify-between px-4 py-2.5 border-b bg-muted/40">
							<div className="flex items-center gap-3">
								<Button variant="ghost" size="sm" onClick={() => setActiveItem(null)} className="h-7 px-2 text-xs">
									<ArrowLeft className="w-3.5 h-3.5 mr-1" />
									Grid
								</Button>
								<div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground bg-background px-2.5 py-1 rounded border">
									<Terminal className="w-3 h-3 text-primary" />
									<span>jingerlab://{activeItem.category}/{activeItem.id}</span>
								</div>
							</div>
							<span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-primary/10 text-primary">
								{activeItem.status}
							</span>
						</div>

						<div className="flex-1 overflow-y-auto p-6 space-y-5">
							<div>
								<h2 className="text-2xl font-semibold tracking-tight">{activeItem.title}</h2>
								<p className="text-sm text-muted-foreground mt-1">{activeItem.subtitle}</p>
							</div>

							{activeItem.abstract && (
								<div className="p-4 rounded-md border bg-muted/20 space-y-1.5">
									<p className="text-xs font-mono uppercase text-muted-foreground">Abstract</p>
									<p className="text-sm leading-relaxed">{activeItem.abstract}</p>
								</div>
							)}

							{activeItem.bibtex && (
								<div className="space-y-1.5">
									<div className="flex items-center justify-between">
										<span className="text-xs font-mono uppercase text-muted-foreground">BibTeX Citation</span>
										<Button
											variant="ghost"
											size="sm"
											className="h-7 text-xs"
											onClick={() => {
												navigator.clipboard.writeText(activeItem.bibtex!);
												setCopiedBib(true);
												setTimeout(() => setCopiedBib(false), 1800);
											}}
										>
											{copiedBib ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
											{copiedBib ? 'Copied' : 'Copy'}
										</Button>
									</div>
									<pre className="p-3 rounded-md border bg-muted/40 text-xs font-mono overflow-x-auto">
										{activeItem.bibtex}
									</pre>
								</div>
							)}

							{activeItem.category === 'workbench' && (
								<div className="p-8 rounded-lg border border-dashed text-center text-sm text-muted-foreground">
									Mount interactive React tool component for <code className="font-mono">{activeItem.id}</code> here.
								</div>
							)}
						</div>
					</div>
				) : (
					/* Rectangular Cards Grid with Visual Previews */
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
						{filteredItems.map((item) => (
							<button
								key={item.id}
								onClick={() => setActiveItem(item)}
								className="group text-left rounded-lg border bg-card hover:border-primary/60 hover:shadow-sm transition-all flex flex-col justify-between overflow-hidden"
							>
								<CardPreview item={item} />

								<div className="p-4 flex-1 flex flex-col justify-between gap-3 w-full">
									<div className="space-y-1">
										<div className="flex items-center justify-between gap-2">
											<h3 className="font-semibold text-sm group-hover:text-primary transition-colors line-clamp-1">
												{item.title}
											</h3>
											<span className="text-[10px] font-mono px-1.5 py-0.5 rounded border bg-muted/50 shrink-0">
												{item.status}
											</span>
										</div>
										<p className="text-xs text-muted-foreground line-clamp-2">{item.subtitle}</p>
									</div>

									<div className="flex flex-wrap gap-1.5">
										{item.tags.map((tag) => (
											<span
												key={tag}
												className="text-[10px] font-mono px-2 py-0.5 rounded bg-secondary text-secondary-foreground"
											>
												{tag}
											</span>
										))}
									</div>
								</div>
							</button>
						))}
					</div>
				)}
			</main>
		</div>
	);
}
