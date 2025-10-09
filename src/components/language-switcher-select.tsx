"use client";

import { useRouter } from "next/navigation";
import { ChangeEvent, useTransition } from "react";

type LanguageOption = {
	code: string;
	label: string;
};

type LanguageSwitcherSelectProps = {
	options: LanguageOption[];
	activeCode: string;
	domain: string;
	className?: string;
};

export function LanguageSwitcherSelect({
	options,
	activeCode,
	domain,
	className,
}: LanguageSwitcherSelectProps) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
		const nextCode = event.target.value;
		if (nextCode === activeCode) {
			return;
		}

		startTransition(() => {
			router.push(`/${nextCode}`);
		});
	};

	return (
		<div className={className}>
			<label
				htmlFor="language-switcher-footer"
				className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-slate-500"
			>
				Language
			</label>
			<select
				id="language-switcher-footer"
				name="language-switcher"
				className="w-52 rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 transition focus:border-sky-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
				value={activeCode}
				onChange={handleChange}
				disabled={isPending}
			>
				{options.map((option) => (
					<option key={option.code} value={option.code}>
						{option.label}
					</option>
				))}
			</select>
		</div>
	);
}
