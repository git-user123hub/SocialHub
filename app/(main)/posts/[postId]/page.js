import MorePostsFromUser from "@/app/_components/MorePostsFromUser";
import SeparateSinglePost from "@/app/_components/SeparateSinglePost";
import {
  getPostsCount,
  getProfile,
  getSinglePost,
  isFollowingOrNot,
  serverDB,
} from "@/app/_lib/inServer-services";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Loading from "../../loading";

export const metadata = {
  title: "Post",
};

export default async function PostPage({ params: { postId } }) {
  const supabase = serverDB();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user || authError) {
    redirect("/auth/login");
  }

  const loggedInUserId = user?.id;

  const post = await getSinglePost(postId);

  const numOfPosts = await getPostsCount(post?.post_user_id);

  const { post_user_id } = post;

  const userProfile = await getProfile(post_user_id);

  const isFollowing = await isFollowingOrNot(post_user_id, loggedInUserId);

  let isPostOwner;

  if (user?.id === post?.post_user_id) {
    isPostOwner = true;
  }

  if (user?.id !== post?.post_user_id) {
    isPostOwner = false;
  }

  const curPostModalPath = "home";

  let isPostModal = false;

  return (
    <div
      className={`w-full sm:w-[90%] md:min-w-[900px] md:ml-7 md:max-w-[995px] lg:max-w-[1551px] mt-0 ${user?.id === userProfile?.id || numOfPosts < 1 ? "mb-36 md:mb-auto" : ""} ${user?.id !== userProfile?.id || !(numOfPosts < 1) ? "mb-36 md:mb-auto" : ""}`}
    >
      <div className="w-full h-full flex flex-col items-center px-0 md:px-5 md:pt-5 pb-2">
        <div className="relative md:static w-full h-[660px] md:h-full lg:h-[60dvh] xl:h-[95dvh] flex justify-center items-center md:min-h-[75dvh]">
          <div className="flex h-hStretch w-full mt-[64px] md:mt-auto">
            <Suspense fallback={<Loading />}>
              <SeparateSinglePost
                post={post}
                userProfile={userProfile}
                loggedInUser={user}
                postId={post.id}
                isPostOwner={isPostOwner}
                isFollowing={isFollowing}
                isPostModal={isPostModal}
                curPostModalPath={curPostModalPath}
              />
            </Suspense>
          </div>
        </div>

        {user?.id !== userProfile?.id && (
          <>
            {numOfPosts > 1 && (
              <>
                <div className="w-full h-12 border-b border-primaryHvrClr"></div>

                <div className="w-full h-max mb-3 md:mb-28 flex flex-col mt-10 gap-7">
                  <div className="text-[14px] font-semibold">
                    <span className="text-slate-500">More posts from</span>{" "}
                    <Link
                      href={`/user/${userProfile?.id}`}
                      className="hover:underline text-strokeClr"
                    >
                      {userProfile?.username}
                    </Link>
                  </div>
                  <Suspense fallback={<Loading />}>
                    <MorePostsFromUser
                      loggedInUserId={loggedInUserId}
                      postId={post.id}
                      postOwnerId={post?.post_user_id}
                    />
                  </Suspense>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
