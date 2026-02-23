import type { Metadata } from "next";
import { ProfileView } from "@/components/github/ProfileView";

interface PageProps {
  params: Promise<{ username: string }>;
}

/**
 * Dynamic metadata so each profile page gets a meaningful <title> and
 * description — demonstrates the Next.js App Router `generateMetadata` API.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `@${username}`,
    description: `Explore ${username}'s public GitHub repositories, stars, and activity.`,
  };
}

/**
 * Server component — awaits the dynamic route params (Next.js 15+ API)
 * then renders the interactive ProfileView client component.
 *
 * Splitting server / client this way lets us:
 *  ✓ Use async/await for params and generateMetadata (server)
 *  ✓ Keep Apollo's useQuery, skeleton states, and fetchMore in the client
 */
export default async function ProfilePage({ params }: PageProps) {
  const { username } = await params;
  return <ProfileView username={username} />;
}
