import React from 'react';
import type { LabItem } from '../data/registry';

export function CardPreview({ item }: { item: LabItem }) {
	// 1. Workbench: Live scaled-down viewport preview
	if (item.category === 'workbench') {
		return (
			<div className="relative w-full h-24 bg-muted/40 border-b overflow-hidden select-none">
				{item.appUrl && (
					<div className="w-full h-full relative bg-white dark:bg-zinc-950 overflow-hidden">
						<iframe
							src={item.appUrl}
							title={`${item.title} preview`}
							loading="lazy"
							tabIndex={-1}
							className="pointer-events-none w-[1080px] h-[540px] border-0 origin-top-left scale-[0.23] transition-transform duration-500 ease-out group-hover:scale-[0.245]"
						/>
						<div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity duration-300" />
					</div>
				)}

				<span className="absolute bottom-1.5 right-2 z-10 text-[9px] font-mono px-1.5 py-0.5 rounded bg-background/90 backdrop-blur-xs border text-foreground shadow-2xs transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary">
					LAUNCH ↗
				</span>
			</div>
		);
	}

	// 2. Published Papers: Compact Alegreya manuscript header lift
	if (item.category === 'papers') {
		return (
			<div className="relative w-full h-24 bg-muted/45 border-b px-3.5 pt-2.5 flex justify-center overflow-hidden select-none">
				<div className="w-full h-28 bg-background border rounded-t-md shadow-xs px-3 py-2 space-y-1 transition-all duration-300 ease-out group-hover:-translate-y-1.5 group-hover:-rotate-1 group-hover:shadow-md group-hover:border-primary/40">
					<div className="flex items-center justify-between border-b pb-1">
						<span className="text-[8px] font-mono uppercase tracking-wider text-primary truncate max-w-[140px]">
							{item.venue || 'Preprint'}
						</span>
						<span className="text-[8px] font-mono text-muted-foreground">{item.year}</span>
					</div>
					<p className="font-serif text-[11px] font-bold leading-tight line-clamp-1">
						{item.title}
					</p>
					<p className="font-serif text-[8.5px] text-muted-foreground leading-snug line-clamp-2">
						{item.abstract || item.subtitle}
					</p>
				</div>
			</div>
		);
	}

	// 3. Ongoing Research: Compact ASCII progress & live log
	if (item.category === 'ongoing') {
		const pct = item.completion ?? 65;
		const filledBlocks = Math.round(pct / 10);
		const barText = '█'.repeat(filledBlocks) + '░'.repeat(10 - filledBlocks);

		return (
			<div className="relative w-full h-24 bg-muted/35 border-b px-3 py-2.5 flex flex-col justify-between font-mono select-none overflow-hidden">
				<div className="flex items-center justify-between text-[9px] text-muted-foreground">
					<span className="truncate pr-2">{item.progress || 'ACTIVE'}</span>
					<span className="flex items-center gap-1 shrink-0 text-amber-600 dark:text-amber-400">
						<span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
						WIP
					</span>
				</div>

				<div className="flex items-center justify-between text-[10px]">
					<span className="text-primary tracking-tighter transition-transform duration-300 origin-left group-hover:scale-x-105">
						[{barText}]
					</span>
					<span className="font-semibold">{pct}%</span>
				</div>

				<div className="text-[9px] text-muted-foreground flex items-center gap-1">
					<span className="text-primary">&gt;</span>
					<span className="truncate">{item.id}.log</span>
					<span className="inline-block w-1 h-2.5 bg-primary animate-pulse" />
				</div>
			</div>
		);
	}

	// 4. Library: Compact book spine slide-out
	return (
		<div className="relative w-full h-24 bg-muted/35 border-b px-3 py-2.5 flex items-center gap-3 overflow-hidden select-none">
			<div className="h-[74px] w-13 shrink-0 rounded-r-sm rounded-l-xs border-l-4 border-l-primary border bg-background p-1.5 flex flex-col justify-between shadow-xs transition-all duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:-rotate-3 group-hover:shadow-md">
				<span className="text-[7px] font-mono uppercase text-muted-foreground leading-none">
					{item.year}
				</span>
				<span className="font-display text-sm leading-none text-primary">
					{item.title.charAt(0)}
				</span>
				<span className="font-serif text-[7.5px] font-bold leading-tight line-clamp-2">
					{item.title}
				</span>
			</div>

			<div className="min-w-0 space-y-1 transition-transform duration-300 group-hover:translate-x-0.5">
				<p className="text-[10px] font-mono text-primary truncate">
					{item.author || 'Reference Text'}
				</p>
				<p className="font-serif text-[11px] text-muted-foreground line-clamp-2 leading-snug">
					{item.notesPreview || item.subtitle}
				</p>
			</div>
		</div>
	);
}
