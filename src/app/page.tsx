import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function Home() {
  // Check if user is logged in
  const user = await currentUser();
  
  // Redirect to dashboard if user is authenticated
  if (user) {
    redirect("/dashboard");
  }
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-zinc-900 dark:text-zinc-50">
            Flash Card
          </h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400">
            Your personal flash card platform
          </p>
        </div>
        
        <div className="flex gap-4 justify-center pt-4">
          <SignInButton mode="modal">
            <Button size="lg" variant="default">
              Sign In
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button size="lg" variant="outline">
              Sign Up
            </Button>
          </SignUpButton>
        </div>
      </div>
    </div>
  );
}
