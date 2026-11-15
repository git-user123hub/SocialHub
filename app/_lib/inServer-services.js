import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function serverDB() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Safe to ignore in Server Components
          }
        },
      },
    },
  );
}

export async function getAuthUser() {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Safe to ignore. Server Components are read-only for cookies;
            // your middleware.js handles the actual cookie setting modifications.
          }
        },
      },
    },
  );

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) return null;

  return user;
}

export async function getSinglePost(postId) {
  const supabase = serverDB();

  let { data: post = [], error } = await supabase
    .from("user_posts")
    .select("*")
    .eq("id", postId)
    .maybeSingle();

  if (error) {
    console.log("error in getSinglePost server", error);
    return null;
  }

  return post;
}

export async function getProfile(postOwnerId) {
  const supabase = serverDB();

  let { data: userProfile, error } = await supabase
    .from("user_profile")
    .select("*")
    .eq("id", postOwnerId)
    .maybeSingle();

  if (error) {
    console.log("error in getProfile server", error);
    return null;
  }

  return userProfile;
}

export async function getFollowers(userId) {
  const supabase = serverDB();

  let {
    data: followers,
    count: followersCount,
    error,
  } = await supabase
    .from("follow_sys")
    .select(
      `
      user_following,
      user_profile:user_following (
      id,
      username,
      avatar,
      fullname
    )
  `,
      { count: "exact" },
    )
    .eq("user_to_follow", userId);

  if (error) {
    console.error("at getFollowers server", error);
    return null;
  }

  return { followers, followersCount };
}

export async function getFollowing(userId) {
  const supabase = serverDB();

  let {
    data: following,
    count: followingCount,
    error,
  } = await supabase
    .from("follow_sys")
    .select(
      `
      user_to_follow,
      user_profile:user_to_follow (
      id,
      username,
      avatar,
      fullname
    )
  `,
      { count: "exact" },
    )
    .eq("user_following", userId);

  if (error) {
    console.error("at getFollowing server", error);
    return null;
  }

  return { following, followingCount };
}

export async function isFollowingOrNot(postOwnerId, loggedInUserId) {
  const supabase = serverDB();

  const { data, error } = await supabase
    .from("follow_sys")
    .select("*")
    .eq("user_to_follow", postOwnerId)
    .eq("user_following", loggedInUserId);

  if (error) {
    console.log("error at isFollowingOrNot server", error);
    return null;
  }

  let isFollowing;

  if (data.length <= 0) {
    isFollowing = false;
  }

  if (data.length > 0 || data.length === 1) {
    isFollowing = true;
  }

  return isFollowing;
}

export async function getAllFollowings(curUserId) {
  const supabase = serverDB();

  const { data, error } = await supabase
    .from("follow_sys")
    .select("*")
    .eq("user_following", curUserId);

  if (error) {
    console.log("error at getAllFollowings server", error);
    return null;
  }

  const results = data.map(async (anAcc) => {
    const aProfile = await getProfile(anAcc.user_to_follow);
    return aProfile;
  });

  const allProfilesOfFollowings = await Promise.all(results);

  return allProfilesOfFollowings;
}

export async function getFollowingsCount(curUserId) {
  const supabase = serverDB();

  const { count, error } = await supabase
    .from("follow_sys")
    .select("*", { count: "exact", head: true })
    .eq("user_following", curUserId);

  if (error) {
    console.log("error at getFollowingsCount server", error);
    return null;
  }

  return count;
}

export async function getRandomProfiles(loggedInUserId) {
  const supabase = serverDB();

  const { data, error } = await supabase.rpc("get_random_profiles", {
    row_limit: 6,
  });

  if (error) {
    console.log("error at getRandomProfiles server", error);
    return null;
  }

  const curUserAcc = await getProfile(loggedInUserId);
  const allFollowings = await getAllFollowings(loggedInUserId);

  let onlySuggestedAccounts;

  const dataWithoutCurUser = data?.filter((dAcc) => {
    return dAcc?.id !== curUserAcc?.id;
  });

  if (allFollowings.length === 0) {
    onlySuggestedAccounts = dataWithoutCurUser;
  }

  if (allFollowings.length > 0) {
    const dataIds = dataWithoutCurUser?.map((dAcc) => dAcc?.id);
    const flwngIds = allFollowings?.map((fAcc) => fAcc?.id);

    const doesInclude = dataIds?.map((id) =>
      flwngIds.includes(id) ? null : id,
    );

    const filteredIds = doesInclude?.filter((id) => id !== null);

    const finalSgstdArr = filteredIds?.flatMap((id) => {
      const cmplteObj = data?.filter((obj) => {
        return obj.id === id;
      });

      const finalCmplteObj = {
        ...cmplteObj[0],
        isFollowingTheUsr: false,
      };

      return finalCmplteObj;
    });

    onlySuggestedAccounts = finalSgstdArr;
  }

  return onlySuggestedAccounts;
}

export async function getCommentsCount(postId) {
  const supabase = serverDB();

  let { count: commentsCount, error } = await supabase
    .from("comments_sys")
    .select("*", { count: "exact", head: true })
    .eq("post_to_comment", postId);

  if (error) {
    console.log("error at getCommentsCount server", error);
    return null;
  }

  return commentsCount;
}

export async function getPostLikesWithCounts(postId) {
  const supabase = serverDB();

  let {
    data: postLikes,
    count: LikesCount,
    error,
  } = await supabase
    .from("like_sys")
    .select("liked_by", { count: "exact" })
    .eq("post_to_like", postId);

  if (error) {
    console.log("error at getPostLikesWithCounts server", error);
    return null;
  }

  return { postLikes, LikesCount };
}

export async function getAllMySavePosts(userId) {
  const supabase = serverDB();

  let { data: savedPosts, error } = await supabase
    .from("saved_posts")
    .select("*")
    .eq("saved_by", userId);

  if (error) {
    console.log("error at getAllMySavePosts server", error);
    return null;
  }

  let myAllSavedPosts = [];

  if (savedPosts?.length > 0) {
    const postResults = savedPosts.map(async (sPost) => {
      let { data: allPosts, error: postErr } = await supabase
        .from("user_posts")
        .select("*")
        .eq("id", sPost?.post_to_save)
        .maybeSingle();

      if (postErr) {
        console.error(
          "postErr error in getAllMySavePosts function in savedPosts mapping: ",
          postErr,
        );
        console.log(`post not found with this specific ${sPost?.post_to_save}`);
      }

      return allPosts;
    });

    // console.log("postResults", postResults);
    const pResultsPromise = await Promise.all(postResults);
    // savedPostsArr = pResultsPromise;

    const results = pResultsPromise.map(async (aPost) => {
      const cmntCount = await getCommentsCount(aPost.id);
      const { LikesCount } = await getPostLikesWithCounts(aPost.id);
      aPost.commentsCount = cmntCount;
      aPost.LikesCount = LikesCount;
      return aPost;
    });
    myAllSavedPosts = await Promise.all(results);
  }

  return { myAllSavedPosts };
}

export async function getMyPosts(userId, postId = null) {
  const supabase = serverDB();

  let query = supabase.from("user_posts").select("*");

  if (postId) {
    query = query
      .eq("post_user_id", userId)
      .order("created_at", { ascending: false })
      .neq("id", postId)
      .range(0, 6);
  }

  if (!postId) {
    query = query
      .eq("post_user_id", userId)
      .order("created_at", { ascending: false });
  }

  let { data: allPosts, error } = await query;

  if (error) {
    console.log("error at getMyPosts server", error);
    return null;
  }

  const results = allPosts?.map(async (aPost) => {
    const cmntCount = await getCommentsCount(aPost?.id);
    const { LikesCount } = await getPostLikesWithCounts(aPost?.id);
    aPost.commentsCount = cmntCount;
    aPost.LikesCount = LikesCount;
    return aPost;
  });

  const myAllPosts = await Promise.all(results);

  return { myAllPosts, error };
}

export async function getDarkStatus(userId) {
  const supabase = serverDB();

  const { data: dark_mode, error } = await supabase
    .from("dark_mode")
    .select("*")
    .eq("darked_by", userId);

  if (error) {
    console.log("error at getDarkStatus server", error);
    return null;
  }

  return dark_mode;
}

export async function getPostsCount(loggedInUserId) {
  const supabase = serverDB();

  let { count: numOfPosts, error } = await supabase
    .from("user_posts")
    .select("*", { count: "exact", head: true })
    .eq("post_user_id", loggedInUserId);

  if (error) {
    console.log("error at getPostsCount server", error);
    return null;
  }

  return numOfPosts;
}

export async function getMyPostsCount(postUserId) {
  const supabase = serverDB();

  let { count: numOfPosts, error } = await supabase
    .from("user_posts")
    .select("*", { count: "exact", head: true })
    .eq("post_user_id", postUserId);

  if (error) {
    console.log("error at getMyPostsCount server", error);
    return null;
  }

  return numOfPosts;
}
