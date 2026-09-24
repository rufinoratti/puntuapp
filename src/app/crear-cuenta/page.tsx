import { redirect } from "next/navigation";

type SignUpAliasPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function SignUpAliasPage({ searchParams }: SignUpAliasPageProps) {
  const { next } = await searchParams;
  redirect(next ? `/registro?next=${encodeURIComponent(next)}` : "/registro");
}
