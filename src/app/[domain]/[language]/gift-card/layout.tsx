// GC listing page doesn't need any static params
// but we still need to define generateStaticParams function return [] array
// otherwise, the gift-card/[id] page's generateStaticParams function will not received the domain params
export async function generateStaticParams(options: {
  params: { domain: string };
}) {
  console.log("gc listing generateStaticParams", options);
  return [];
}

export const dynamicParams = true;
export default function GiftCardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
