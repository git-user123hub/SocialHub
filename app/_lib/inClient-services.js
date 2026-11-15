import { createClient } from "@/app/_lib/supabase/client";

export async function getProfile(id) {
  const supabase = createClient();

  let { data, error } = await supabase
    .from("user_profile")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("error in getProfile function in inClient-services: ", error);
    return null;
  }

  return { data, error };
}

export async function getProfileThrSearch(username) {
  const supabase = createClient();

  let { data, error } = await supabase
    .from("user_profile")
    .select("*")
    .ilike("username", `%${username}%`);

  if (error) {
    console.error(
      "error in getProfileThrSearch function in inClient-services: ",
      error,
    );
    return null;
  }

  let dataWithFollowers;

  if (data?.length > 0) {
    const results = data.map(async (profile) => {
      const { data: followers, error } = await supabase
        .from("follow_sys")
        .select("*")
        .eq("user_to_follow", profile.id);

      profile.followers = followers.length;
      return profile;
    });

    dataWithFollowers = await Promise.all(results);
  }

  return { dataWithFollowers, error };
}

export async function getFollowersClient(userId) {
  const supabase = createClient();

  let {
    data: followers,
    count: followersCount,
    error,
  } = await supabase
    .from("follow_sys")
    .select(
      `
      user_following,id,
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
    console.error(
      "error in getFollowersClient function in inClient-services: ",
      error,
    );
    return null;
  }

  return { followers, followersCount };
}

export async function getFollowingClient(userId) {
  const supabase = createClient();

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
    console.error(
      "error in getFollowingClient function in inClient-services: ",
      error,
    );
    return null;
  }

  return { following, followingCount };
}

export async function getPostLikesWithCountsClient(curUser) {
  const supabase = createClient();

  let { data: postLikes, error } = await supabase
    .from("like_sys")
    .select("*", { count: "exact" })
    .eq("like_post_onwer", curUser);

  if (error) {
    console.error(
      "error in getPostLikesWithCountsClient function in inClient-services: ",
      error,
    );
    return null;
  }

  let postLikeObj = [];

  if (postLikes?.length === 0) {
    return (postLikeObj = []);
  }

  const filteredAccnts =
    postLikes?.length > 0 &&
    postLikes?.filter((post) => {
      return post.liked_by !== curUser;
    });

  if (filteredAccnts?.length === 0) {
    return (postLikeObj = []);
  }

  const results =
    filteredAccnts?.length > 0 &&
    filteredAccnts?.map(async (post) => {
      const { data } = await getProfile(post.liked_by);

      post.likingAcc = data;

      return post;
    });

  const postLikeByAccnts = await Promise.all(results);

  if (postLikeByAccnts?.length > 0) {
    postLikeObj = postLikeByAccnts;
  }

  return postLikeObj;
}

export async function getLikeSys(postId, loggedInUserId) {
  const supabase = createClient();
  let { data: like_sys, error } = await supabase
    .from("like_sys")
    .select("*")
    .eq("post_to_like", postId)
    .eq("liked_by", loggedInUserId)
    .maybeSingle();

  if (error) {
    console.error("error in getLikeSys function in inClient-services: ", error);
    return null;
  }

  return { like_sys };
}

export async function getPostLikesAndCounts(postId) {
  const supabase = createClient();
  let {
    data: postLikesAll,
    count: likesCountAll,
    error: error,
  } = await supabase
    .from("like_sys")
    .select("*", { count: "exact" })
    .eq("post_to_like", postId);

  if (error) {
    console.error(
      "error in getPostLikesAndCounts function in inClient-services: ",
      error,
    );
    return null;
  }

  return { postLikesAll, likesCountAll };
}

export async function getSavedPosts(postId, loggedInUserId) {
  const supabase = createClient();
  let { data: savedPost, error } = await supabase
    .from("saved_posts")
    .select("*")
    .eq("post_to_save", postId)
    .eq("saved_by", loggedInUserId)
    .maybeSingle();

  if (error) {
    console.error(
      "error in getSavedPosts function in inClient-services: ",
      error,
    );
    return null;
  }

  return { savedPost };
}

export async function getFollowSys(postId, loggedInUserId) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("follow_sys")
    .select("*")
    .eq("user_to_follow", postId)
    .eq("user_following", loggedInUserId)
    .maybeSingle();
  if (error) {
    console.error(
      "error in getFollowSys function in inClient-services: ",
      error,
    );
    return null;
  }

  return { data };
}

export async function getCommentsCountClient(postId) {
  const supabase = createClient();

  let { count: counts, error } = await supabase
    .from("comments_sys")
    .select("*", { count: "exact", head: true })
    .eq("post_to_comment", postId);

  if (error) {
    console.error(
      "error in getCommentsCountClient function in inClient-services: ",
      error,
    );
    return null;
  }

  return counts;
}
