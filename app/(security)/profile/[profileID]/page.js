import CreateProfile from "@/app/_components/CreateProfile";
import CreateNewProfile from "@/app/_components/CreateNewProfile";
import { createServer } from "@/app/_lib/supabase/server";
import { getAuthUser } from "@/app/_lib/inServer-services";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Profile",
};

export default async function ProfilePage({ params }) {
  const c = cookies();
  let unparsedCookie = c.get("signup_progress")?.value;
  let cookieData = unparsedCookie ? JSON.parse(unparsedCookie) : null;
  let proID = unparsedCookie ? cookieData?.proID : null;

  const supabase = await createServer();

  const user = await getAuthUser();

  if (!user) {
    redirect("/auth/login");
  }

  let { data: userProfile, error: profileErr } = await supabase
    .from("user_profile")
    .select("*")
    .eq("id", params.profileID)
    .maybeSingle();

  if (profileErr) {
    if (unparsedCookie) {
      redirect(`/profile/${proID}`);
    }
  }

  let userData;

  if (!userProfile) {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    userData = user;
  }

  return (
    <div className="w-full min-h-dvh flex justify-center items-center">
      <div className="w-full h-hStretch">
        <div className="w-full h-full flex justify-center items-center bg-slate-200">
          <div className="md:max-w-[540px] lg:max-w-[540px] w-[80%] h-max overflow-auto mt-10 mb-14 rounded-lg bg-slate-100 flex justify-center">
            <div className="w-full flex flex-col pt-6 pb-16 items-center">
              <h2 className="mb-5 font-semibold text-xl text-slate-700 underline underline-offset-2">
                Create Profile
              </h2>
              {!userProfile ? (
                <CreateNewProfile
                  userAvatar={userData?.user_metadata?.avatar_url}
                />
              ) : (
                <CreateProfile />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
