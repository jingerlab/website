import React, { useState } from 'react';
import { Lock, Unlock, KeyRound, Rocket, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// SHA-256 hash of normalized lowercase passphrase: ""
const PASSPHRASE_HASH = 'f1deea8f7ec542897ca750d35505750548079253cdf5d7a5239d4593dd048ef9';

async function hashPassphrase(phrase: string): Promise<string> {
	const normalized = phrase.trim().toLowerCase().replace(/\s+/g, ' ');
	const data = new TextEncoder().encode(normalized);
	const hashBuffer = await crypto.subtle.digest('SHA-256', data);
	return Array.from(new Uint8Array(hashBuffer))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
}

export function LibraryGate({ onUnlock }: { onUnlock: () => void }) {
	const [passphrase, setPassphrase] = useState('');
	const [error, setError] = useState(false);
	const [shakeKey, setShakeKey] = useState(0);
	const [isLaunching, setIsLaunching] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (isLaunching) return;

		const hashed = await hashPassphrase(passphrase);
		if (hashed === PASSPHRASE_HASH) {
			setError(false);
			setIsLaunching(true);
			// Let the rocket liftoff & orbital pulse play before revealing the shelf
			setTimeout(() => {
				onUnlock();
			}, 950);
		} else {
			setError(true);
			setShakeKey((k) => k + 1);
			setPassphrase('');
		}
	};

	return (
		<div className="relative flex items-center justify-center h-full min-h-[420px] overflow-hidden">
			{/* Launch Sequence Overlay */}
			{isLaunching && (
				<div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
					{/* Concentric orbital shockwave rings */}
					<div className="absolute w-44 h-44 rounded-full border-2 border-primary/50 animate-shockwave" />
					<div
						className="absolute w-44 h-44 rounded-full border border-amber-500/50 animate-shockwave"
						style={{ animationDelay: '120ms' }}
					/>
					<div
						className="absolute w-44 h-44 rounded-full border border-emerald-500/40 animate-shockwave"
						style={{ animationDelay: '240ms' }}
					/>

					{/* Glowing vertical thruster exhaust */}
					<div className="absolute bottom-1/2 w-1.5 h-32 rounded-full bg-gradient-to-t from-transparent via-amber-500 to-primary animate-exhaust-trail" />

					{/* Ascending Rocket */}
					<div className="relative flex flex-col items-center animate-rocket-liftoff">
						<div className="p-3 rounded-full bg-background border border-primary/40 shadow-lg text-primary">
							<Rocket className="w-7 h-7 -rotate-45 fill-primary/15" />
						</div>
					</div>
				</div>
			)}

			{/* Vault Card */}
			<div
				key={shakeKey}
				className={`w-full max-w-sm p-6 rounded-xl border bg-background shadow-sm space-y-4 transition-colors ${isLaunching
					? 'animate-vault-dissolve border-emerald-500/60 shadow-lg'
					: error
						? 'animate-vault-shake border-destructive/60'
						: ''
					}`}
			>
				<div className="flex items-center gap-3">
					<div
						className={`p-2.5 rounded-lg transition-all duration-300 ${isLaunching
							? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 scale-110 -rotate-12'
							: error
								? 'bg-destructive/10 text-destructive'
								: 'bg-primary/10 text-primary'
							}`}
					>
						{isLaunching ? (
							<Sparkles className="w-4 h-4 animate-spin" />
						) : (
							<Lock className="w-4 h-4 transition-transform duration-300 hover:rotate-12" />
						)}
					</div>
					<div>
						<h3 className="font-semibold text-sm">
							{isLaunching ? 'तत् त्वम् असि · Unlocked' : 'Restricted Reference Library'}
						</h3>
						<p className="text-xs text-muted-foreground">
							{isLaunching
								? 'Initializing personal & student shelf...'
								: 'Speak the lab passphrase to enter.'}
						</p>
					</div>
				</div>

				<form onSubmit={handleSubmit} className="space-y-3">
					<div className="relative">
						<KeyRound className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
						<Input
							type="password"
							placeholder="Enter passphrase..."
							value={passphrase}
							disabled={isLaunching}
							onChange={(e) => {
								setPassphrase(e.target.value);
								if (error) setError(false);
							}}
							className="pl-8 h-9 text-sm"
							autoFocus
						/>
					</div>
					{error && (
						<p className="text-xs text-destructive font-mono">
							Passphrase unrecognized. Try again.
						</p>
					)}
					<Button
						type="submit"
						disabled={isLaunching}
						className={`w-full h-9 text-xs group transition-all active:scale-[0.98] ${isLaunching ? 'bg-emerald-600 text-white hover:bg-emerald-600' : ''
							}`}
					>
						<Unlock className="w-3.5 h-3.5 mr-1.5 transition-transform duration-200 group-hover:-rotate-12" />
						{isLaunching ? 'Liftoff...' : 'Unlock Library'}
					</Button>
				</form>
			</div>
		</div>
	);
}
