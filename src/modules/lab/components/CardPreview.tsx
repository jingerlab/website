import React from 'react';
import type { LabItem } from '../data/registry';

export function CardPreview({ item }: { item: LabItem }) {
	if (item.category === 'workbench') {
		return (
			<div className="h-36 w-full bg-muted/30 border-b flex items-center justify-center p-4 overflow-hidden relative">
				<svg viewBox="0 0 240 80" className="w-full h-full stroke-primary fill-none" strokeWidth="1.75">
					<path d="M 0 40 Q 30 5, 60 40 T 120 40 T 180 40 T 240 40" className="opacity-35" />
					<path d="M 0 45 C 40 10, 70 75, 110 35 S 180 15, 240 50" />
				</svg>
				<span className="absolute bottom-2 right-2.5 text-[10px] font-mono text-muted-foreground bg-background/80 px-1.5 py-0.5 rounded border">
					INTERACTIVE UI
				</span>
			</div>
		);
	}

	if (item.category === 'papers') {
		return (
			<div className="h-36 w-full bg-muted/40 border-b p-3.5 flex justify-center overflow-hidden">
				<div className="w-full max-w-[240px] h-44 bg-background border rounded-t shadow-xs p-3 space-y-2 transition-transform duration-300 group-hover:-translate-y-1">
					<div className="flex items-center justify-between border-b pb-1.5">
						<span className="text-[8px] font-mono uppercase tracking-wider text-primary">
							{item.venue || 'Preprint'}
						</span>
						<span className="text-[8px] font-mono text-muted-foreground">{item.year}</span>
					</div>
					<p className="text-[10px] font-semibold leading-tight line-clamp-2">{item.title}</p>
					<p className="text-[8px] text-muted-foreground leading-relaxed line-clamp-4 font-serif">
						{item.abstract || item.subtitle}
					</p>
				</div>
			</div>
		);
	}

	if (item.category === 'ongoing') {
		return (
			<div className="h-36 w-full bg-muted/30 border-b p-4 flex flex-col justify-between font-mono">
				<div className="flex items-center justify-between text-[10px] text-muted-foreground">
					<span>PHASE // {item.progress || 'ACTIVE'}</span>
					<span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
				</div>
				<div className="space-y-1.5">
					<div className="flex justify-between text-[10px]">
						<span className="text-muted-foreground">Completion</span>
						<span>{item.completion ?? 65}%</span>
					</div>
					<div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
						<div
							className="h-full bg-primary rounded-full transition-all duration-300"
							style={{ width: `${item.completion ?? 65}%` }}
						/>
					</div>
				</div>
				<div className="text-[10px] text-muted-foreground truncate">$ status --track {item.id}</div>
			</div>
		);
	}

	return (
		<div className="h-36 w-full bg-muted/30 border-b p-4 flex items-center gap-3.5">
			<div className="h-24 w-16 shrink-0 rounded-r-md rounded-l-xs border-l-4 border-l-primary border bg-background p-2 flex flex-col justify-between shadow-xs transition-transform duration-300 group-hover:scale-105">
				<span className="text-[7px] font-mono uppercase text-muted-foreground leading-none">{item.year}</span>
				<span className="text-[8px] font-semibold leading-tight line-clamp-3">{item.title}</span>
			</div>
			<div className="min-w-0 space-y-1">
				<p className="text-[11px] font-mono text-primary truncate">{item.author || 'Reference Text'}</p>
				<p className="text-xs text-muted-foreground line-clamp-2">
					{item.notesPreview || 'Annotated notes & problem sets'}
				</p>
			</div>
		</div>
	);
}
