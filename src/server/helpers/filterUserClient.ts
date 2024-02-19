import type { User } from "@clerk/nextjs/server";

export const filterUserClient = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    profileImageUrl: user.profileImageUrl,
  };
};
