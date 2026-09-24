import { AuthForm } from "@/components/auth/auth-form";

type SignInPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { next } = await searchParams;
  return <AuthForm mode="sign-in" nextPath={next} />;
}
