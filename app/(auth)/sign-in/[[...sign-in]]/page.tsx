// FILE: app/(auth)/sign-in/[[...sign-in]]/page.tsx
"use client";

import { SignedIn, SignedOut, SignIn } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

function RedirectAfterSignIn() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/t/select-tenant");
  }, [router]);

  return null;
}

export default function SignInPage() {
  return (
    <>
      <SignedIn>
        <RedirectAfterSignIn />
      </SignedIn>

      <SignedOut>
        <main className="min-h-screen bg-background text-foreground">
          <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
              <h1 className="mb-2 text-center font-poppins text-2xl font-semibold">
                Sign in to SaaSify
              </h1>
              <p className="mb-8 text-center font-inter text-sm text-muted-foreground">
                Access your platform and tenant workspaces securely.
              </p>

              <div className="flex justify-center">
                <SignIn
                  appearance={{
                    elements: {
                      card: "shadow-none border rounded-2xl bg-card",
                      headerTitle: "font-poppins",
                      headerSubtitle: "font-inter text-muted-foreground",
                      formButtonPrimary:
                        "bg-indigo-600 hover:bg-indigo-700 text-white rounded-full",
                      footerActionLink: "text-indigo-600 hover:text-indigo-700",
                    },
                  }}
                  routing="path"
                  path="/sign-in"
                  signUpUrl="/sign-up"
                />
              </div>
            </div>
          </div>
        </main>
      </SignedOut>
    </>
  );
}
