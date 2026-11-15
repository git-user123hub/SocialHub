import PostModalWindow from "@/app/_components/PostModalWindow";
import PostModalWindowWrapper from "@/app/_components/PostModalWindowWrapper";
import SeparateSinglePost from "@/app/_components/SeparateSinglePost";
import {
  getProfile,
  getSinglePost,
  isFollowingOrNot,
  serverDB,
} from "@/app/_lib/inServer-services";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Post",
};

export default async function Page({ params: { postId } }) {
  const supabase = serverDB();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user || authError) {
    redirect("/auth/login");
  }

  const loggedInUserId = user.id;

  const post = await getSinglePost(postId);

  if (!post) return;

  const { post_user_id } = post;

  const userProfile = await getProfile(post_user_id);

  const isFollowing = await isFollowingOrNot(post_user_id, loggedInUserId);

  let isPostOwner;

  if (user.id === post.post_user_id) {
    isPostOwner = true;
  }

  if (user.id !== post.post_user_id) {
    isPostOwner = false;
  }

  let isPostModal = true;

  const curPostModalPath = "back";

  return (
    <PostModalWindowWrapper>
      <PostModalWindow>
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
      </PostModalWindow>
    </PostModalWindowWrapper>
  );
}
