import React, { useState } from 'react';
import { Lock, Unlock, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Generate your SHA-256 hash in PowerShell:
// [BitConverter]::ToString([Security.Cryptography.SHA256]::Create().ComputeHash([Text.Encoding]::UTF8.GetBytes("YOUR_PASSCODE"))).Replace("-","").ToLower()
const PASSCODE_HASH = 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f'; // default: "password123" — replace with yours

async function hashPasscode(code: string): Promise<string> {
	const data = new TextEncoder().encode(code.trim());
	const hashBuffer = await crypto.subtle.digest('SHA-256', data);
	return Array.from(new Uint8Array(hashBuffer))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
}

export function LibraryGate({ onUnlock }: { onUnlock: () => void }) {
	const [passcode, setPasscode] = useState('');
	const [error, setError] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const hashed = await hashPasscode(passcode);
		if (hashed === PASSCODE_HASH) {
			sessionStorage.setItem('jingerlab_library_unlocked', 'true');
			setError(false);
			onUnlock();
		} else {
			setError(true);
			setPasscode('');
		}
	};

	return (
		<div className="flex items-center justify-center h-full min-h-[420px]">
			<div className="w-full max-w-sm p-6 rounded-lg border bg-card shadow-sm space-y-4">
				<div className="flex items-center gap-2.5">
					<div className="p-2 rounded-md bg-primary/10 text-primary">
						<Lock className="w-4 h-4" />
					</div>
					<div>
						<h3 className="font-semibold text-sm">Restricted Reference Library</h3>
						<p className="text-xs text-muted-foreground">
							Enter lab passcode for personal &amp; student access.
						</p>
					</div>
				</div>

				<form onSubmit={handleSubmit} className="space-y-3">
					<div className="relative">
						<KeyRound className="w-3.5 h-3.5 absolute left-3 top-2.5 text-muted-foreground" />
						<Input
							type="password"
							placeholder="Enter passcode..."
							value={passcode}
							onChange={(e) => {
								setPasscode(e.target.value);
								if (error) setError(false);
							}}
							className="pl-8 h-9 text-sm font-mono"
							autoFocus
						/>
					</div>
					{error && <p className="text-xs text-destructive font-mono">Invalid passcode. Access denied.</p>}
					<Button type="submit" className="w-full h-9 text-xs">
						<Unlock className="w-3.5 h-3.5 mr-1.5" />
						Unlock Library
					</Button>
				</form>
			</div>
		</div>
	);
}
