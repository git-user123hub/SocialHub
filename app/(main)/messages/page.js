import { serverDB } from "@/app/_lib/inServer-services";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Messages",
};

export default async function messages() {
  const supabase = serverDB();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user || authError) {
    redirect("/auth/login");
  }

  return (
    <div className="text-strokeClr w-full h-full flex flex-col items-center">
      <div className="w-full h-full">
        <div className="w-full h-full flex flex-col justify-center items-center absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] opacity-70">
          <div className="w-[17%] flex justify-center items-center">
            <ChatBubbleLeftRightIcon className="w-full h-full [&>path]:stroke-strokeClr [&>path]:stroke-[1]" />
          </div>
          <p className="w-full flex justify-center items-center text-xl font-normal">
            There are no messages yet.
          </p>
        </div>
      </div>
    </div>
  );
}
