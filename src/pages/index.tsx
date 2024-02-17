import Head from "next/head";

import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";

import { SignInButton, useUser } from "@clerk/nextjs";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  const { user } = useUser();

  console.log(user);

  if (!user) return null;

  return (
    <div className="flex w-full gap-3">
      <img
        className="h-16 w-16 rounded-full"
        src={user.profileImageUrl}
        alt="Profile Image"
      />
      <input
        type="text"
        placeholder="Type some post"
        className="grow bg-transparent outline-none"
        name=""
        id=""
      />
    </div>
  );
};

type PostWithUserT = RouterOutputs["post"]["getAll"][number];

const PostItem = ({ post, author }: PostWithUserT) => {
  return (
    <div className="flex gap-3 border-b border-slate-400 p-4">
      <img
        src={author.profileImageUrl}
        className="h-16 w-16 rounded-full"
        alt="Profile Image"
      />
      <div className="flex flex-col">
        <div className="flex gap-1 text-slate-300">
          <span>{`@${author.username}`}</span>
          <span>{`${dayjs(post.createdAt).fromNow()}`}</span>
        </div>
        <span>{post.content}</span>
      </div>
    </div>
  );
};

export default function Home() {
  const user = useUser();

  const { data, isLoading } = api.post.getAll.useQuery();

  if (isLoading) return <div>Loading</div>;

  if (!data) return <div>Something wrong</div>;

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen justify-center">
        <div className="w-full border-x border-slate-400 md:max-w-2xl">
          <div className="flex justify-center border-b border-slate-400 p-4">
            {!user.isSignedIn && (
              <SignInButton>
                <button>Sign in with Clerk</button>
              </SignInButton>
            )}
            {!!user.isSignedIn && (
              <>
                <CreatePostWizard />
                {/* <SignOutButton>
                  <button>Sign out with Clerk</button>
                </SignOutButton> */}
              </>
            )}
          </div>
          <div>
            <div className="flex flex-col">
              {data?.map((postData) => (
                <PostItem {...postData} key={postData.post.id} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
