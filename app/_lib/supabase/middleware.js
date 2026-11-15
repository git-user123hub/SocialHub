import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

/**
 * @param {import('next/server').NextRequest} request
 */

export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
          Object.entries(headers).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value),
          );
        },
      },
    },
  );

  const url = request.nextUrl.clone();

  const pathname = request.nextUrl.pathname;

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  let userCookie =
    request.cookies.get("sb-jsnsjnfwoaokfshkogam-auth-token") ||
    session ||
    null;

  if (
    request.nextUrl.pathname === "/auth/callback" &&
    request.nextUrl.searchParams.has("code")
  ) {
    return NextResponse.next();
  }

  if (!userCookie) {
    if (pathname === "/auth/login") {
      return NextResponse.next();
    }

    if (pathname === "/auth/signup") {
      return NextResponse.next();
    }

    if (url.searchParams.has("limit")) {
      const cleanUrl = new URL(url.pathname, request.url);

      url.searchParams.forEach((value, key) => {
        if (key !== "limit") cleanUrl.searchParams.set(key, value);
      });
      return NextResponse.redirect(cleanUrl);
    }

    const loginUrl = new URL("/auth/login", request.url);

    url.searchParams.forEach((value, key) => {
      loginUrl.searchParams.set(key, value);
    });

    return NextResponse.redirect(loginUrl);
  }

  if (userCookie) {
    if (pathname === "/profile") {
      let proID = JSON.parse(
        request.cookies.get("signup_progress")?.value,
      )?.proID;

      url.pathname = `/profile/${proID}`;
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith("/profile")) {
      return NextResponse.next();
    }

    const unparsedCookie =
      request.cookies.get("signup_progress")?.value || null;

    if (unparsedCookie) {
      let cookieData = unparsedCookie ? JSON.parse(unparsedCookie) : null;
      let proID = unparsedCookie ? cookieData?.proID : null;

      if (pathname.startsWith("/profile")) {
        return NextResponse.next();
      }

      url.pathname = `/profile/${proID}`;
      return NextResponse.redirect(url);
    }

    if (!unparsedCookie) {
      if (
        pathname === "/auth/login" ||
        pathname === "/auth/signup" ||
        pathname.startsWith("/profile")
      ) {
        const previousUrl =
          request.cookies.get("last-valid-path")?.value || null;

        if (previousUrl) {
          url.pathname = previousUrl;
          return NextResponse.redirect(url);
        }

        url.pathname = "/";
        return NextResponse.redirect(url);
      }

      return NextResponse.next();
    }

    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
