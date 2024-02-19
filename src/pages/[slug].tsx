import { createServerSideHelpers } from "@trpc/react-query/server";
import Head from "next/head";
import { db } from "~/server/db";

import { api } from "~/utils/api";
import { appRouter } from "~/server/api/root";
import superjson from "superjson";
import type { GetStaticProps, NextPage } from "next";
// import type { RouterOutputs } from "~/utils/api";

const ProfilePage: NextPage<{ slug: string }> = ({
  slug,
}: {
  slug: string;
}) => {
  const { data } = api.profile.getUserByUsername.useQuery({
    username: slug,
  });

  if (!data) return <div>Something wrong</div>;

  console.log(slug);

  return (
    <>
      <Head>
        <title>Profile {data.username}</title>
      </Head>
      <main className="flex min-h-screen justify-center">
        <div>Profile Page</div>
      </main>
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
