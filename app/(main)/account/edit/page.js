import EditProfile from "@/app/_components/EditProfile";
import { serverDB } from "@/app/_lib/inServer-services";
import { Suspense } from "react";
import Loading from "../../loading";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Edit Profile",
};

export default async function Account() {
  const supabase = serverDB();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user || authError) {
    redirect("/auth/login");
  }
  const userId = user?.id;

  let { data, error } = await supabase
    .from("user_profile")
    .select("*")
    .eq("id", userId);

  console.log("error while fetching user_profile in account/edit page", error);

  const userProfile = data?.at(0);

  return (
    <div className="flex justify-center mx-auto px-5 w-hStretch max-w-[707px] h-hStretch min-[500px]:pt-12">
      <div className="flex flex-col pt-2 pb-6 items-center w-full h-hStretch">
        <h2 className="min-[500px]:mb-5 w-full font-bold text-2xl text-strokeClr ">
          Edit Profile
        </h2>

        <Suspense fallback={<Loading />}>
          <EditProfile userProfile={userProfile} />
        </Suspense>
      </div>
    </div>
  );
}
