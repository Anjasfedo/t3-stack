import { createServerSideHelpers } from "@trpc/react-query/server";
import { db } from "~/server/db";

import { appRouter } from "~/server/api/root";
import superjson from "superjson";

export const ServersideHelper = () =>
  createServerSideHelpers({
    router: appRouter,
    ctx: { db, userId: null },
    transformer: superjson,
  });
