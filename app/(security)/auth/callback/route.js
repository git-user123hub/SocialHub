import { NextResponse } from "next/server";
import { createServer } from "@/app/_lib/supabase/server";

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/login`);
  }

  const supabase = await createServer();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/auth/login`);
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    return NextResponse.redirect(`${origin}/auth/login`);
  }

  let { data: userProfile, error: profileErr } = await supabase
    .from("user_profile")
    .select("*")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (profileErr) {
    console.error("profileErr message", profileErr.message);
  }

  if (!userProfile) {
    const response = NextResponse.redirect(
      `${origin}/profile/${userData?.user?.id}`,
    );

    const progressData = {
      cookieStatus: "user_just_signed_up",
      proID: userData?.user?.id,
    };

    response.cookies.set("signup_progress", JSON.stringify(progressData), {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    });

    return response;
  }

  return NextResponse.redirect(`${origin}/user/${userData?.user?.id}`);
}
