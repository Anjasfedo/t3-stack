import { createServerSideHelpers } from "@trpc/react-query/server";
import Head from "next/head";
import { db } from "~/server/db";

import { api } from "~/utils/api";
import { appRouter } from "~/server/api/root";
import superjson from "superjson";
import type { GetStaticProps, NextPage } from "next";
import Layout from "~/components/Layout";
import Image from "next/image";
import LoadSpinner from "~/components/LoadSpinner";
import { PostItem } from "~/components/PostItem";

const ProfilePosts = ({ userId }: { userId: string }) => {
  const { data, isLoading: isPostLoading } = api.post.getPostsByUserId.useQuery(
    { userId },
  );

  if (isPostLoading) return <LoadSpinner />;

  if (!data || data.length === 0) return <div>User not Posted yet</div>;

  return (
    <div className="flex flex-col">
      {data?.map((postData) => (
        <PostItem {...postData} key={postData.post.id} />
      ))}
    </div>
  );
};

const ProfilePage: NextPage<{ slug: string }> = ({
  slug,
}: {
  slug: string;
}) => {
  const { data } = api.profile.getUserByUsername.useQuery({
    username: slug,
  });

  if (!data) return <div>Something wrong</div>;

  return (
    <>
      <Head>
        <title>Profile {data.username}</title>
      </Head>
      <Layout>
        <div className="relative h-48 border-b border-slate-400 bg-sky-600">
          <Image
            src={data.profileImageUrl}
            className="absolute bottom-0 left-0 -mb-[64px] ml-4 rounded-full border-2 border-black"
            alt={`${data.username} Profile Image`}
            width={128}
            height={128}
          />
        </div>
        <div className="h-[64px]"></div>
        <div className="p-4 text-2xl font-bold">{`@${data.username}`}</div>
        <div className="border-b border-slate-400"></div>
        <ProfilePosts userId={data.id} />
      </Layout>
    </>
  );
};

export default ProfilePage;

export const getStaticProps: GetStaticProps = async (context) => {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: { db, userId: null },
    transformer: superjson,
  });

  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("Invalid slug");

  await helpers.profile.getUserByUsername.prefetch({ username: slug });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      slug,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};
