export const dynamic = "force-dynamic";
export const revalidate = 3600;

import Article from "@/app/_components/Article";
import SuggestionsBar from "@/app/_components/SuggestionsBar";
import { getProfile, serverDB } from "../_lib/inServer-services";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import Loading from "./loading";
import Spinner from "../_components/Spinner";
import ScrollTrackerWrapper from "../_components/ScrollTrackerWrapper";

export default async function Home({ searchParams }) {
  const supabase = serverDB();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user || authError) {
    redirect("/auth/login");
  }

  const userProfile = await getProfile(user?.id);

  const currentLimit = Number(searchParams?.limit) || 5;

  let { data: posts = [], error: postsErr } = await supabase
    .from("user_posts")
    .select("*")
    .order("created_at", { ascending: false })
    .range(0, currentLimit - 1);

  if (!posts) return <Loading />;

  return (
    <>
      <div className="flex justify-center max-[499px]:w-full mb-12">
        <div
          className="flex flex-col max-[499px]:w-full"
          id="feedHomePageTrackingId"
        >
          <div className="flex w-full min-[500px]:w-[470px] flex-col self-end items-center mb-10 md:mb-[10px] mt-3">
            <Suspense fallback={<Spinner />}>
              {posts.map((post, index) => (
                <Article key={post.id} post={post} loggedInUserId={user?.id} />
              ))}
            </Suspense>
          </div>

          <ScrollTrackerWrapper currentLimit={currentLimit} />
        </div>

        <div className="hidden min-[1080px]:block">
          <div className="flex justify-center w-[470px] h-[calc(100dvh+150px)] pl-36 mt-7">
            <Suspense fallback={null}>
              <SuggestionsBar
                curUserProfile={userProfile}
                loggedInUserId={user.id}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
