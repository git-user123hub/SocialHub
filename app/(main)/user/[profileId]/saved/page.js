import MyPost from "@/app/_components/MyPost";
import { getAllMySavePosts, serverDB } from "@/app/_lib/inServer-services";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Saved",
};

export default async function Account({ params: { profileId } }) {
  const supabase = serverDB();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user || authError) {
    redirect("/auth/login");
  }

  let { myAllSavedPosts } = await getAllMySavePosts(profileId);

  return (
    <div className="flex justify-center w-full flex-grow">
      {myAllSavedPosts.length === 0 ? (
        <div className="relative w-full flex justify-center items-center min-[500px]:text-3xl text-slate-500">
          <div>You did not created any post yet</div>
        </div>
      ) : (
        <div className="w-full grid grid-cols-3 lg:grid-cols-4 gap-[1px] mb-10 h-max">
          {myAllSavedPosts.map((arr, index) => (
            <MyPost
              key={arr.id}
              index={index + 1}
              arrLength={myAllSavedPosts.length}
              myPost={arr}
            />
          ))}
        </div>
      )}
    </div>
  );
}
