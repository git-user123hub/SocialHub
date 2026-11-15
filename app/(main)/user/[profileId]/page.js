import MyPost from "@/app/_components/MyPost";
import { getMyPosts, serverDB } from "@/app/_lib/inServer-services";
import { redirect } from "next/navigation";

export default async function Account({ params: { profileId } }) {
  const supabase = serverDB();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user || authError) {
    redirect("/auth/login");
  }

  let { myAllPosts, error } = await getMyPosts(profileId);

  if (error) {
    console.log("myAllPosts error in /user page.js: ", error);
  }

  return (
    <div className="flex justify-center w-full flex-grow">
      {myAllPosts.length < 1 ? (
        <div className="relative w-full flex justify-center items-center min-[500px]:text-3xl text-slate-500">
          <div>You did not created any post yet</div>
        </div>
      ) : (
        <div className="relative w-full grid grid-cols-3 lg:grid-cols-4 gap-[1px] mb-10 h-max">
          {myAllPosts.map((arr, index) => (
            <MyPost
              key={arr.id}
              index={index + 1}
              arrLength={myAllPosts.length}
              myPost={arr}
            />
          ))}
        </div>
      )}
    </div>
  );
}
