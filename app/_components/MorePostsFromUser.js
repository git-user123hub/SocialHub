import { getMyPosts } from "../_lib/inServer-services";
import MyPost from "./MyPost";

export default async function MorePostsFromUser({
  loggedInUserId,
  postId,
  postOwnerId,
}) {
  const { myAllPosts, error } = await getMyPosts(postOwnerId, postId);

  return (
    <div className="w-full grid grid-cols-[--my-grid-test-cols] lg:grid-cols-[--my-grid-cols] gap-[1px] mb-10">
      {myAllPosts?.length > 0 && (
        <>
          {myAllPosts.map((arr, index) => (
            <MyPost
              key={index}
              index={index + 1}
              arrLength={myAllPosts.length}
              myPost={arr}
              fromWhere="MorePostsFromUser"
            />
          ))}
        </>
      )}
    </div>
  );
}
