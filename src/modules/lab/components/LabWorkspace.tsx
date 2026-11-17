import React, { useState, useEffect } from 'react';
import {
	Wrench,
	FileText,
	FlaskConical,
	BookMarked,
	Lock,
	Unlock,
	ArrowLeft,
	Terminal,
	Copy,
	Check,
	PanelLeftClose,
	PanelLeftOpen,
	ArrowUpRight,
	Loader2,
	Maximize2,
	Minimize2,
	RotateCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
	const [isLibraryUnlocked, setIsLibraryUnlocked] = useState(false);
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [copiedBib, setCopiedBib] = useState(false);
	const [isFrameLoading, setIsFrameLoading] = useState(false);
	const [reloadKey, setReloadKey] = useState(0);

	// Allow pressing Escape to exit fullscreen mode
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isFullscreen) {
				setIsFullscreen(false);
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [isFullscreen]);

	// Prevent background page scrolling while WebWindow is fullscreen
	useEffect(() => {
		if (isFullscreen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	}, [isFullscreen]);

	const handleSelectItem = (item: LabItem) => {
		setActiveItem(item);
		setReloadKey(0);
		if (item.appUrl) {
			setIsFrameLoading(true);
		}
	};

	const handleReloadFrame = () => {
		if (!activeItem?.appUrl) return;
		setIsFrameLoading(true);
		setReloadKey((k) => k + 1);
	};

	const handleCloseWindow = () => {
		setIsFullscreen(false);
		setActiveItem(null);
	};

	const handleLockLibrary = () => {
		setIsLibraryUnlocked(false);
		if (activeItem?.category === 'library') {
			setIsFullscreen(false);
			setActiveItem(null);
		}
	};

	const handleCardMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
		const rect = e.currentTarget.getBoundingClientRect();
		e.currentTarget.style.setProperty('--mx', `${e.clientX - rect.left}px`);
		e.currentTarget.style.setProperty('--my', `${e.clientY - rect.top}px`);
	};

	const sectionItems = LAB_ITEMS.filter((item) => item.category === activeCategory);
	const isLockedView = activeCategory === 'library' && !isLibraryUnlocked;

	const resolvedAppUrl = activeItem?.appUrl
		? activeItem.appUrl.endsWith('/')
			? activeItem.appUrl
			: `${activeItem.appUrl}/`
		: undefined;

	return (
		<div
			className={`grid grid-cols-1 gap-6 min-h-[calc(100vh-9rem)] transition-[grid-template-columns] duration-300 ease-out ${isCollapsed ? 'md:grid-cols-[56px_1fr]' : 'md:grid-cols-[230px_1fr]'
				}`}
		>
			{/* Collapsible Left Sidebar */}
			<aside className="flex flex-col gap-3 md:border-r md:pr-3">
				<div
					className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-2'
						}`}
				>
					{!isCollapsed && (
						<span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
							Directory
						</span>
					)}
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setIsCollapsed(!isCollapsed)}
						title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
						className="h-7 w-7 text-muted-foreground hover:text-foreground transition-transform duration-200 active:scale-90"
					>
						{isCollapsed ? (
							<PanelLeftOpen className="w-4 h-4" />
						) : (
							<PanelLeftClose className="w-4 h-4" />
						)}
					</Button>
				</div>

				{/* Category Navigation */}
				<nav className="space-y-1">
					{SECTIONS.map(({ id, label, icon: Icon, locked }) => {
						const count = LAB_ITEMS.filter((i) => i.category === id).length;
						const isSelected = activeCategory === id;
						return (
							<button
								key={id}
								title={label}
								onClick={() => {
									setActiveCategory(id);
									setIsFullscreen(false);
									setActiveItem(null);
								}}
								className={`group/nav w-full flex items-center rounded-md text-sm transition-all duration-200 active:scale-[0.97] ${isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'
									} ${isSelected
										? 'bg-primary text-primary-foreground font-medium shadow-xs'
										: 'hover:bg-muted text-muted-foreground hover:text-foreground'
									}`}
							>
								<span className="flex items-center gap-2.5 truncate">
									<Icon
										className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isSelected ? 'scale-105' : 'group-hover/nav:scale-110 group-hover/nav:-rotate-6'
											}`}
									/>
									{!isCollapsed && <span className="truncate">{label}</span>}
								</span>

								{!isCollapsed && (
									<span className="flex items-center gap-1.5 text-xs font-mono opacity-80 shrink-0">
										{locked &&
											(isLibraryUnlocked ? (
												<Unlock className="w-3 h-3 text-emerald-500" />
											) : (
												<Lock className="w-3 h-3" />
											))}
										{!locked || isLibraryUnlocked ? count : ''}
									</span>
								)}
							</button>
						);
					})}
				</nav>

				{/* Quick-launch items in active section */}
				{!isCollapsed && !isLockedView && (
					<div key={activeCategory} className="pt-3 border-t animate-window-pop">
						<div className="flex items-center justify-between mb-2 px-2">
							<p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
								In {activeCategory}
							</p>
							{activeCategory === 'library' && isLibraryUnlocked && (
								<button
									onClick={handleLockLibrary}
									className="text-[10px] font-mono text-muted-foreground hover:text-foreground underline transition-colors"
								>
									Lock
								</button>
							)}
						</div>
						<div className="space-y-1">
							{sectionItems.map((item) => (
								<button
									key={item.id}
									onClick={() => handleSelectItem(item)}
									className={`w-full text-left px-2.5 py-1.5 rounded text-xs truncate transition-all duration-150 ${activeItem?.id === item.id
											? 'bg-accent text-accent-foreground font-medium translate-x-1'
											: 'text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:translate-x-1'
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
					<div className="animate-window-pop h-full">
						<LibraryGate onUnlock={() => setIsLibraryUnlocked(true)} />
					</div>
				) : activeItem ? (
					/* Spring-Animated WebWindow Viewport (Supports In-Site Fullscreen) */
					<div
						key={activeItem.id}
						className={`animate-window-pop flex flex-col bg-background text-foreground overflow-hidden transition-all duration-300 ${isFullscreen
								? 'fixed inset-0 z-50 w-screen h-screen rounded-none border-0'
								: 'h-[78vh] min-h-[580px] rounded-xl border shadow-sm'
							}`}
					>
						{/* Window Titlebar */}
						<div className="flex items-center justify-between px-4 py-2 border-b bg-muted/40 shrink-0">
							<div className="flex items-center gap-3 min-w-0">
								<Button
									variant="ghost"
									size="sm"
									onClick={handleCloseWindow}
									className="h-7 px-2 text-xs group/back shrink-0"
								>
									<ArrowLeft className="w-3.5 h-3.5 mr-1 transition-transform duration-150 group-hover/back:-translate-x-1" />
									Grid
								</Button>
								<div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground bg-background px-2.5 py-1 rounded border truncate">
									<Terminal className="w-3 h-3 text-primary shrink-0" />
									<span className="truncate">
										jingerlab://{activeItem.category}/{activeItem.id}
									</span>
								</div>
							</div>

							<div className="flex items-center gap-2 shrink-0">
								<span className="hidden sm:inline-block text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-primary/10 text-primary">
									{activeItem.status}
								</span>
								{resolvedAppUrl && (
									<Button
										variant="ghost"
										size="icon"
										onClick={handleReloadFrame}
										title="Reload app"
										className="h-7 w-7 text-muted-foreground hover:text-foreground transition-transform active:scale-90"
									>
										<RotateCw
											className={`w-3.5 h-3.5 ${isFrameLoading ? 'animate-spin text-primary' : ''}`}
										/>
									</Button>
								)}
								<Button
									variant="outline"
									size="sm"
									onClick={() => setIsFullscreen(!isFullscreen)}
									title={isFullscreen ? 'Exit fullscreen (Esc)' : 'Enter fullscreen'}
									className="h-7 px-2.5 text-xs font-mono gap-1.5 transition-transform active:scale-95"
								>
									{isFullscreen ? (
										<>
											<Minimize2 className="w-3.5 h-3.5" />
											<span>Exit Fullscreen</span>
										</>
									) : (
										<>
											<Maximize2 className="w-3.5 h-3.5" />
											<span>Fullscreen</span>
										</>
									)}
								</Button>
							</div>
						</div>

						{/* Viewport Content */}
						{resolvedAppUrl ? (
							<div className="flex-1 w-full min-h-[520px] bg-white dark:bg-zinc-950 relative">
								{isFrameLoading && (
									<div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/80 backdrop-blur-xs z-10 text-xs font-mono text-muted-foreground">
										<Loader2 className="w-5 h-5 animate-spin text-primary" />
										<span>Mounting {activeItem.title}...</span>
									</div>
								)}
								<iframe
									key={`${activeItem.id}-${reloadKey}`}
									src={resolvedAppUrl}
									title={activeItem.title}
									onLoad={() => setIsFrameLoading(false)}
									className="w-full h-full min-h-[520px] border-0 block"
									allow="clipboard-read; clipboard-write; fullscreen"
								/>
							</div>
						) : (
							<div className="flex-1 overflow-y-auto p-6 space-y-5">
								<div className={isFullscreen ? 'max-w-4xl mx-auto space-y-5' : 'space-y-5'}>
									<div>
										<h2 className="text-2xl font-semibold tracking-tight">{activeItem.title}</h2>
										<p className="text-sm text-muted-foreground mt-1">{activeItem.subtitle}</p>
									</div>

									{activeItem.abstract && (
										<div className="p-4 rounded-md border bg-muted/20 space-y-1.5">
											<p className="text-xs font-mono uppercase text-muted-foreground">Abstract</p>
											<p className="font-serif text-sm leading-relaxed">{activeItem.abstract}</p>
										</div>
									)}

									{activeItem.bibtex && (
										<div className="space-y-1.5">
											<div className="flex items-center justify-between">
												<span className="text-xs font-mono uppercase text-muted-foreground">
													BibTeX Citation
												</span>
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
													{copiedBib ? (
														<Check className="w-3.5 h-3.5 mr-1 text-emerald-500" />
													) : (
														<Copy className="w-3.5 h-3.5 mr-1" />
													)}
													{copiedBib ? 'Copied' : 'Copy'}
												</Button>
											</div>
											<pre className="p-3 rounded-md border bg-muted/40 text-xs font-mono overflow-x-auto">
												{activeItem.bibtex}
											</pre>
										</div>
									)}
								</div>
							</div>
						)}
					</div>
				) : (
					/* Compact, Uniform Cards Grid */
					<div
						key={activeCategory}
						className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 items-stretch"
					>
						{sectionItems.map((item, idx) => (
							<button
								key={item.id}
								onClick={() => handleSelectItem(item)}
								onMouseMove={handleCardMouseMove}
								style={{ animationDelay: `${idx * 50}ms` }}
								className="animate-card-enter group relative text-left h-full rounded-lg border bg-background hover:border-primary/50 hover:-translate-y-1 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_24px_-6px_rgba(0,0,0,0.14),0_4px_10px_-4px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.65)] active:scale-[0.985] transition-all duration-200 ease-out flex flex-col justify-between overflow-hidden"
							>
								{/* Cursor-following radial tint */}
								<div
									className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
									style={{
										background:
											'radial-gradient(220px circle at var(--mx, 50%) var(--my, 50%), color-mix(in srgb, var(--color-primary) 9%, transparent), transparent 70%)',
									}}
								/>

								{/* Compact h-24 Visual Preview */}
								<CardPreview item={item} />

								{/* Compact Card Body */}
								<div className="p-3 flex-1 flex flex-col justify-between gap-2.5 w-full">
									<div className="space-y-1">
										<div className="flex items-start justify-between gap-1.5">
											<h3 className="font-semibold text-[13px] leading-snug group-hover:text-primary transition-colors line-clamp-1">
												{item.title}
											</h3>
											<ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground shrink-0 opacity-0 -translate-x-1 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:text-primary" />
										</div>
										<p className="text-[11.5px] text-muted-foreground line-clamp-2 leading-snug">
											{item.subtitle}
										</p>
									</div>

									<div className="flex items-center justify-between gap-1.5 pt-1.5 border-t border-border/50">
										<div className="flex flex-wrap gap-1 overflow-hidden max-h-4">
											{item.tags.slice(0, 2).map((tag) => (
												<span
													key={tag}
													className="text-[9.5px] font-mono px-1.5 py-0.2 rounded bg-secondary text-secondary-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary"
												>
													{tag}
												</span>
											))}
										</div>
										<span className="text-[9px] font-mono text-muted-foreground shrink-0">
											{item.status}
										</span>
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
