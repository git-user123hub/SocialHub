import ProfilePagePostArea from "@/app/_components/ProfilePagePostArea";
import ProfileUserInfo from "@/app/_components/ProfileUserInfo";
import Spinner from "@/app/_components/Spinner";
import {
  getFollowers,
  getFollowing,
  getProfile,
  serverDB,
} from "@/app/_lib/inServer-services";
import { Suspense } from "react";
import { redirect } from "next/navigation";

export const metadata = {
  title: {
    template: "User - %s | SocialHub",
    default: "User - Posts",
  },
};

export default async function AccountLayout({ children, modal, params }) {
  const supabase = serverDB();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user || authError) {
    redirect("/auth/login");
  }

  if (!params?.profileId) return;

  const userProfile = await getProfile(params.profileId);

  const { followers, followersCount } = await getFollowers(params.profileId);

  const { following, followingCount } = await getFollowing(params.profileId);

  let { data: followingData, error } = await supabase
    .from("follow_sys")
    .select("*")
    .eq("user_to_follow", params.profileId)
    .eq("user_following", user.id);

  if (!followingData) return;

  let isFollowing = false;

  if (followingData.length === 1) {
    isFollowing = true;
  }

  const isUserItself = user?.id === params?.profileId;

  return (
    <div className="relative w-full h-full flex justify-center min-h-[calc(100dvh+100px)]">
      <div className="flex flex-col gap-16 min-[500px]:gap-28  w-full items-center">
        <Suspense fallback={null}>
          <ProfileUserInfo
            data={userProfile}
            followersData={followers}
            followingData={following}
            followersCountData={followersCount}
            followingCountData={followingCount}
            isUserItself={isUserItself}
            isFollowing={isFollowing}
          />
        </Suspense>

        <div className="flex-grow w-full flex flex-col items-center">
          <ProfilePagePostArea
            profileId={params.profileId}
            isUserItself={isUserItself}
          />

          <Suspense fallback={<Spinner />}>{children}</Suspense>
        </div>
      </div>
      {modal}
    </div>
  );
}
