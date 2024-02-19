import Head from "next/head";

import { api } from "~/utils/api";
import type { GetStaticProps, NextPage } from "next";
import Layout from "~/components/Layout";
import { PostItem } from "~/components/PostItem";
import { ServersideHelper } from "~/server/helpers/serversideHelper";

const PostPage: NextPage<{ Id: string }> = ({ Id }: { Id: string }) => {
  const { data } = api.post.getPostById.useQuery({
    Id,
  });

  if (!data) return <div>Something wrong</div>;

  return (
    <>
      <Head>
        <title>
          Post {data.post.content} - {data.author.username}
        </title>
      </Head>
      <Layout>
        <PostItem {...data} />
      </Layout>
    </>
  );
};

export default PostPage;

export const getStaticProps: GetStaticProps = async (context) => {
  const helpers = ServersideHelper();

  const Id = context.params?.id;

  if (typeof Id !== "string") throw new Error("Invalid Id");

  await helpers.post.getPostById.prefetch({ Id });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      Id,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};
