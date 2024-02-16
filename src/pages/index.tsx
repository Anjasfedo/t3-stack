import Head from "next/head";

import { api } from "~/utils/api";

import { SignIn, SignInButton, useUser, SignOutButton } from "@clerk/nextjs";

export default function Home() {
  const datas = api.post.getAll.useQuery();

  const user = useUser();

  // console.log(datas);

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div>
          {!user.isSignedIn && (
            <SignInButton>
              <button>Sign in with Clerk</button>
            </SignInButton>
          )}
          {!!user.isSignedIn && (
            <SignOutButton>
              <button>Sign out with Clerk</button>
            </SignOutButton>
          )}
        </div>
        <div>
          {datas.data?.map((val) => <div key={val.id}>{val.content}</div>)}
        </div>
        <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
      </main>
    </>
  );
}
