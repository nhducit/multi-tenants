"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode, useState } from "react";

type ReactQueryProviderProps = {
	children: ReactNode;
};

export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
	const [client] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 60_000,
						refetchOnWindowFocus: false,
					},
				},
			}),
	);

	return (
		<QueryClientProvider client={client}>
			{children}
			{process.env.NODE_ENV === "development" ? (
				<ReactQueryDevtools initialIsOpen={true} />
			) : null}
		</QueryClientProvider>
	);
}
