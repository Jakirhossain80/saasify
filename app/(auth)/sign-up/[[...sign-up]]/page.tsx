// FILE: app/(auth)/sign-up/[[...sign-up]]/page.tsx
"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <h1 className="mb-2 text-center font-poppins text-2xl font-semibold">
            Create your SaaSify account
          </h1>
          <p className="mb-8 text-center font-inter text-sm text-muted-foreground">
            Join or create tenants and start managing projects.
          </p>

          <div className="flex justify-center">
            <SignUp
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
              path="/sign-up"
              signInUrl="/sign-in"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
