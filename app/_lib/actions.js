"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { supabaseKey, supabaseUrl } from "@/app/_lib/supabase/server";
import { createServer } from "@/app/_lib/supabase/server";
import { supabaseAdmin } from "./supabase/admin";
import { sql } from "./db";

export async function createPostAction(previousState, formData) {
  console.log(formData);

  const postOwner = formData.get("postOwner");
  const imageField = formData.getAll("imageField");
  const postDesc = formData.get("postDesc");

  if (!imageField || imageField?.length < 1)
    return {
      success: false,
      message: "Something went wrong, please try again",
    };

  const supabase = await createServer();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user)
    return {
      success: false,
      message: authError?.message || "User is not authorized",
    };

  const allFiles = imageField?.map((img) => {
    const lastDotIndex = img?.name?.lastIndexOf(".");
    const originalName =
      lastDotIndex !== -1
        ? img?.name
            ?.substring(0, lastDotIndex)
            ?.replaceAll("-", "")
            ?.replaceAll("/", "")
            ?.replaceAll(" ", "")
        : "avatar";
    const extension =
      lastDotIndex !== -1 ? img?.name?.substring(lastDotIndex + 1) : "png";
    const imgName = `${user?.id}_${Math.random().toString().replaceAll(".", "")}${originalName}.${extension}`;
    const baseImgURL = `${supabaseUrl}/storage/v1/object/public/post_images/`;
    const imgPath = baseImgURL + imgName;

    return {
      imageName: imgName,
      imagePath: imgPath,
      imageFile: img,
    };
  });

  const allImagesPath = allFiles?.map((img) => {
    return img?.imagePath;
  });

  let imgUpldErr;

  for (const file of allFiles) {
    const { error: error1 } = await supabase.storage
      .from("post_images")
      .upload(`${file?.imageName}`, file?.imageFile, {
        cacheControl: "3600",
        upsert: false,
      });

    console.log(
      "image upload error in loop in createPostAction funtion in actions.js: ",
      error1,
    );

    if (error1) {
      imgUpldErr = error1;
    }
  }

  if (imgUpldErr) {
    return { success: false, message: imgUpldErr?.message };
  }

  // =======================================================
  // 🛡️ NATIVE RAW SQL TRANSACTION REPLACEMENT
  // =======================================================
  let data = null;
  let error = null;

  try {
    data = await sql.begin(async (sql) => {
      // Direct raw query execution
      const [insertedRow] = await sql`
        INSERT INTO user_posts (post_user_id, post_images, description)
        VALUES (${user?.id}, ${allImagesPath}, ${postDesc})
        RETURNING *
      `;
      return [insertedRow];
    });
  } catch (dbError) {
    error = dbError;
  }

  if (error) {
    console.error(
      "Database entry aborted and rolled back safely:",
      error.message,
    );
    return {
      success: false,
      message: error?.message || "Failed to create post cleanly.",
    };
  }

  revalidatePath("/");
  revalidatePath("/user");
  revalidatePath(`/user/${user?.id}`);

  return {
    success: true,
    message: "Post created successfully!",
    user_id: user?.id,
  };
}

export async function signupUser(formData) {
  const signupObj = {
    email: formData?.email,
    password: formData?.password,
  };

  const supabase = await createServer();

  const { data, error } = await supabase.auth.signUp(signupObj);

  if (error) {
    console.log("signup error in signupUser function in actions.js: ", error);
    return {
      success: false,
      message: error?.message,
      signupStatus: false,
      errorType: "signUpError",
      signUpUsername: formData?.username,
    };
  }

  let userLoginError;

  if (data?.user?.role === "authenticated") {
    const profileObj = {
      id: data.user?.id,
      birthday: formData?.birthday,
      username: formData?.username,
      fullname: formData?.fullname,
    };

    // =======================================================
    // 🛡️ NATIVE RAW SQL INSERT REPLACEMENT
    // =======================================================
    let pData = null;
    let pErr = null;

    try {
      pData = await sql`
        INSERT INTO user_profile (id, birthday, username, fullname)
        VALUES (${profileObj.id}, ${profileObj.birthday}, ${profileObj.username}, ${profileObj.fullname})
        RETURNING *
      `;
    } catch (dbInsertErr) {
      pErr = dbInsertErr;
    }

    if (pErr) {
      console.log("profile creating error in signupUser in actions.js: ", pErr);
      return {
        success: false,
        message: pErr?.message,
        profileStatus: false,
        errorType: "createProfileError",
      };
    }

    const cookieStore = cookies();

    const supabase1 = createServerClient(
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
            } catch (error) {
              // Safe to ignore if called from Server Components
            }
          },
        },
      },
    );

    const { data: loginData, error: loginErr } =
      await supabase1.auth.signInWithPassword(signupObj);

    if (loginErr) {
      console.log("login error in signupUser in actions.js: ", loginErr);
      userLoginError = loginErr;

      await supabase1.auth.signInWithPassword(signupObj);
    }
  }

  const cookieStore = cookies();

  const progressData = {
    cookieStatus: "user_just_signed_up",
    proID: data?.user?.id,
  };

  cookieStore.set("signup_progress", JSON.stringify(progressData), {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
  });

  return {
    success: true,
    message: "Signup successful!",
    loginStatus: true,
    errorType: "none",
    navigateTo: `/profile/${data?.user?.id}`,
  };
}

export async function signinUser(formData) {
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
            // This safely saves the auth session to the user's browser
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch (error) {
            // Safe to ignore if called from Server Components during routing transitions
          }
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData?.email,
    password: formData?.password,
  });

  if (error) {
    console.error("login error message: ", error?.message);
    return {
      success: false,
      message: "Invalid login credentials",
    };
  }

  return {
    success: true,
    message: "Login successful!",
  };
}

export async function signoutUser() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet, _headers) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch (_a) {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );

  const { error } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error?.message);
  }

  const { error: logOutErr } = await supabase.auth.signOut();

  if (logOutErr) {
    return {
      success: false,
      message: logOutErr?.message,
    };
  }

  cookies().delete("session");

  return {
    success: true,
    message: "Log out successfully",
  };
}

export async function createUserProfile(formData) {
  const avatarImage = formData.get("profilePicName");
  const bio = formData.get("profileBioName");
  const gender = formData.get("profileGenderName");
  const user_id = formData.get("user_id");

  const supabase = await createServer();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user)
    return {
      success: false,
      message: authError?.message || "User is not authorized",
    };

  let avatar;
  let imgUploaded;
  let error1;

  if (avatarImage !== "no-file") {
    const lastDotIndex = avatarImage?.name?.lastIndexOf(".");
    const originalName =
      lastDotIndex !== -1
        ? avatarImage?.name
            ?.substring(0, lastDotIndex)
            ?.replaceAll("-", "")
            ?.replaceAll("/", "")
        : "avatar";
    const extension =
      lastDotIndex !== -1
        ? avatarImage?.name?.substring(lastDotIndex + 1)
        : "png";
    const imgName = `${user?.id}_${Math.random().toString().replaceAll(".", "")}${originalName}.${extension}`;
    const baseImgURL = `${supabaseUrl}/storage/v1/object/public/avatars/`;
    const imgPath = baseImgURL + imgName;
    avatar = {
      imageName: imgName,
      imagePath: imgPath,
      imageFile: avatarImage,
    };

    const { data: imgData, error: imgErr } = await supabase.storage
      .from("avatars")
      .upload(`${imgName}`, avatarImage, {
        cacheControl: "3600",
        upsert: false,
      });

    imgUploaded = imgData;
    error1 = imgErr;
  }

  if (error1) {
    console.error(error1?.message);
    throw new Error(error1?.message);
  }

  let profileObj = {
    gender: gender,
    bio: bio,
  };

  if (avatarImage !== "no-file") {
    profileObj.avatar = avatar?.imagePath;
  }

  // =======================================================
  // 🛡️ NATIVE RAW SQL UPDATE REPLACEMENT
  // =======================================================
  let data = null;
  let error = null;

  try {
    data = await sql`
      UPDATE user_profile 
      SET 
        gender = COALESCE(${profileObj.gender !== undefined ? profileObj.gender : null}, gender),
        bio = COALESCE(${profileObj.bio !== undefined ? profileObj.bio : null}, bio),
        avatar = ${profileObj.avatar !== undefined ? profileObj.avatar : sql`avatar`}
      WHERE id = ${user?.id}
      RETURNING *
    `;
  } catch (dbUpdateErr) {
    error = dbUpdateErr;
  }

  if (error) {
    console.error(error);
    return {
      success: false,
      message:
        error?.message || "Failed to finalize database profile entry cleanly.",
    };
  }

  const cookieStore = cookies();
  cookieStore.delete("signup_progress");
  revalidatePath("/");
  revalidatePath("/user");
  revalidatePath(`/user/${user?.id}`);

  return {
    success: true,
    message: "profile created successfully",
    navigateTo: `/user/${user?.id}`,
  };
}

export async function createUserNewProfile(formData) {
  console.log(formData);

  const avatarImage = formData.get("profilePicName");
  const bio = formData.get("profileBioName");
  const gender = formData.get("profileGenderName");
  const user_id = formData.get("user_id");
  const birthday = formData.get("signupBirthday");
  const fullname = formData.get("signupFullName");
  const username = formData.get("signupUsername");

  const cookieStore = cookies();
  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet, _headers) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch (_a) {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user || user?.id !== user_id)
    return {
      success: false,
      message: authError?.message || "User is not authorized",
    };

  let avatar;
  let imgUploaded;
  let error1;

  if (avatarImage !== "no-file") {
    if (typeof avatarImage === "object") {
      const lastDotIndex = avatarImage?.name?.lastIndexOf(".");
      const originalName =
        lastDotIndex !== -1
          ? avatarImage?.name
              ?.substring(0, lastDotIndex)
              ?.replaceAll("-", "")
              ?.replaceAll("/", "")
          : "avatar";
      const extension =
        lastDotIndex !== -1
          ? avatarImage?.name?.substring(lastDotIndex + 1)
          : "png";
      const imgName = `${user?.id}_${Math.random().toString().replaceAll(".", "")}${originalName}.${extension}`;
      const baseImgURL = `${supabaseUrl}/storage/v1/object/public/avatars/`;
      const imgPath = baseImgURL + imgName;
      avatar = {
        imageName: imgName,
        imagePath: imgPath,
        imageFile: avatarImage,
      };

      const { data: imgData, error: imgErr } = await supabase.storage
        .from("avatars")
        .upload(`${imgName}`, avatarImage, {
          cacheControl: "3600",
          upsert: false,
        });

      imgUploaded = imgData;
      error1 = imgErr;
    }
  }

  if (error1) {
    console.error(error1);
    return {
      success: false,
      message: "profile creation failed, please try again",
    };
  }

  let profileObj = {
    id: user?.id,
    gender: gender,
    bio: bio,
    birthday: birthday,
    fullname: fullname,
    username: username,
  };

  if (avatarImage !== "no-file") {
    if (typeof avatarImage === "object") {
      profileObj.avatar = avatar?.imagePath;
    }

    if (typeof avatarImage === "string") {
      profileObj.avatar = avatarImage;
    }
  }

  // =======================================================
  // 🛡️ NATIVE RAW SQL INSERT REPLACEMENT
  // =======================================================
  let data = null;
  let error = null;

  try {
    const rows = await sql`
      INSERT INTO user_profile (id, gender, bio, birthday, fullname, username, avatar)
      VALUES (
        ${profileObj.id}, 
        ${profileObj.gender}, 
        ${profileObj.bio}, 
        ${profileObj.birthday}, 
        ${profileObj.fullname}, 
        ${profileObj.username}, 
        -- If profileObj.avatar is missing/undefined, pass null explicitly to the text database field
        ${profileObj.avatar !== undefined ? profileObj.avatar : null}
      )
      RETURNING *
    `;

    data = rows;
  } catch (dbInsertErr) {
    error = dbInsertErr;
  }

  if (error) {
    console.error(error);
    return {
      success: false,
      message:
        error?.message || "Failed to finalize database profile entry cleanly.",
    };
  }

  const cookieStore1 = cookies();
  cookieStore1.delete("signup_progress");
  revalidatePath("/");
  revalidatePath("/user");
  revalidatePath(`/user/${user?.id}`);

  return {
    success: true,
    message: "profile created successfully",
    navigateTo: `/user/${user?.id}`,
  };
}

export async function editUserProfile(formData) {
  const avatar = formData.get("profilePicName");
  const avatarStatus = formData.get("profilePicStatus");
  const bio = formData.get("profileBioName");
  const gender = formData.get("profileGenderName");
  const user_id = formData.get("user_id");
  const prevAvatar = formData.get("profilePicPrev");

  if (!avatar && !bio && !gender) {
    return {
      success: true,
      message: "nothing changed",
    };
  }

  const profileObj = {};

  if (bio) {
    profileObj.bio = bio;
  }

  if (gender) {
    profileObj.gender = gender;
  }

  const supabase = await createServer();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user || user_id !== user?.id)
    return {
      success: false,
      message: authError?.message || "User is not authorized",
    };

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  console.log(`${supabaseUrl}/storage/v1/object/public/avatars/`);

  if (avatarStatus === "no-file") {
    console.log("nofile");
    profileObj.avatar = null;
  }

  let imgUploaded;
  let error1;

  if (avatarStatus === "fresh-upload") {
    const lastDotIndex = avatar?.name?.lastIndexOf(".");
    const originalName =
      lastDotIndex !== -1
        ? avatar?.name
            ?.substring(0, lastDotIndex)
            ?.replaceAll("-", "")
            ?.replaceAll("/", "")
        : "avatar";
    const extension =
      lastDotIndex !== -1 ? avatar?.name?.substring(lastDotIndex + 1) : "png";
    const imgName = `${user?.id}_${Math.random().toString().replaceAll(".", "")}${originalName}.${extension}`;
    const baseImgURL = `${supabaseUrl}/storage/v1/object/public/avatars/`;
    const imgPath = baseImgURL + imgName;

    const { data: imgData, error: imgErr } = await supabase.storage
      .from("avatars")
      .upload(`${imgName}`, avatar, {
        cacheControl: "3600",
        upsert: false,
      });

    imgUploaded = imgData;
    error1 = imgErr;

    profileObj.avatar = imgPath;
  }

  if (error1) {
    return {
      success: false,
      message: "Avatar image upload failed",
    };
  }

  if (avatarStatus === "updated-file") {
    const lastDotIndex = avatar?.name.lastIndexOf(".");
    const originalName =
      lastDotIndex !== -1
        ? avatar?.name
            ?.substring(0, lastDotIndex)
            ?.replaceAll("-", "")
            ?.replaceAll("/", "")
        : "avatar";
    const extension =
      lastDotIndex !== -1 ? avatar?.name?.substring(lastDotIndex + 1) : "png";
    const imgName = `${user.id}_${Math.random().toString().replaceAll(".", "")}${originalName}.${extension}`;
    const baseImgURL = `${supabaseUrl}/storage/v1/object/public/avatars/`;
    const imgPath = baseImgURL + imgName;

    const { data: imgUpData, error: imgUpErr } = await supabase.storage
      .from("avatars")
      .upload(`${imgName}`, avatar, {
        cacheControl: "3600",
        upsert: true,
      });

    if (!imgUpErr) {
      profileObj.avatar = imgPath;
    } else {
      console.error(
        "Upload failed, original file preserved:",
        imgUpErr?.message,
      );
    }
  }

  // =======================================================
  // 🛡️ NATIVE RAW SQL DYNAMIC UPDATE REPLACEMENT
  // =======================================================
  let data = null;
  let error = null;

  try {
    data = await sql`
      UPDATE user_profile 
      SET 
        bio = COALESCE(${profileObj.bio !== undefined ? profileObj.bio : null}, bio),
        gender = COALESCE(${profileObj.gender !== undefined ? profileObj.gender : null}, gender),
        avatar = ${profileObj.avatar !== undefined ? profileObj.avatar : sql`avatar`}
      WHERE id = ${user?.id}
      RETURNING *
    `;
  } catch (dbUpdateErr) {
    error = dbUpdateErr;
  }

  if (error) {
    console.error(error);
    return {
      success: false,
      message: "Unable to update the profile right now.",
    };
  }

  revalidatePath("/");
  revalidatePath(`/user`);
  revalidatePath(`/user/${user?.id}`);

  return {
    success: true,
    message: "final",
  };
}

export async function followIt(formData) {
  const user_to_follow = formData.userToFollow;
  const user_following = formData.userFollowing;
  const curPath = formData.curPath;

  const supabase = await createServer();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user || user?.id !== user_following)
    return {
      success: false,
      message: authError?.message || "User is not authorized",
    };

  const followObj = {
    user_to_follow,
    user_following,
  };

  // =======================================================
  // 🛡️ NATIVE RAW SQL INSERT REPLACEMENT
  // =======================================================

  let data = null;
  let error = null;

  try {
    const rows = await sql`
      INSERT INTO follow_sys (user_to_follow, user_following)
      VALUES (${followObj.user_to_follow}, ${followObj.user_following})
      RETURNING *
    `;

    data = rows;
  } catch (dbInsertErr) {
    error = dbInsertErr;
  }

  if (error) {
    console.error(error);
    return {
      success: false,
      message: error?.message,
    };
  }

  revalidatePath("/");
  revalidatePath(`/user`);
  revalidatePath(`/user/${user_to_follow}`);
  revalidatePath(curPath);

  return {
    success: true,
    message: "Followed the user successfully",
    followData: data,
  };
}

export async function unFollowIt(formData) {
  const user_to_follow = formData.userToFollow;
  const user_following = formData.userFollowing;
  const curPath = formData.curPath;

  const supabase = await createServer();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user || user?.id !== user_following)
    return {
      success: false,
      message: authError?.message || "User is not authorized",
    };

  const followObj = {
    user_to_follow,
    user_following,
  };

  // =======================================================
  // 🛡️ NATIVE RAW SQL DELETE REPLACEMENT
  // =======================================================

  let error = null;

  try {
    await sql`
      DELETE FROM follow_sys 
      WHERE user_to_follow = ${user_to_follow} 
        AND user_following = ${user_following}
    `;
  } catch (dbDeleteErr) {
    error = dbDeleteErr;
  }

  if (error) {
    console.error(error);
    return {
      success: false,
      message: error?.message,
    };
  }

  revalidatePath("/");
  revalidatePath(`/user`);
  revalidatePath(`/user/${user_to_follow}`);
  revalidatePath(curPath);

  return {
    success: true,
    message: "UnFollowed the user successfully",
  };
}

export async function deleteUser(formData) {
  const userID = formData.userID;

  const supabase = await createServer();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user || user?.id !== userID)
    return {
      success: false,
      message: authError?.message || "User is not authorized",
    };

  const signout = await signoutUser();

  if (!signout?.success) {
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }

  const { data, error } = await supabaseAdmin.auth.admin.deleteUser(user?.id);

  if (error) {
    console.error("delete user error", error);
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }

  return {
    success: true,
    message: "Your account has been deleted successfully",
  };
}

export async function likePost(likeObj) {
  const postId = likeObj.postId;
  const curUserId = likeObj.curUserId;
  const curPath = likeObj.curPath;
  const like_post_onwer = likeObj.like_post_onwer;

  const supabase = await createServer();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user || user?.id !== curUserId)
    return {
      success: false,
      message: authError?.message || "User is not authorized",
    };

  // =======================================================
  // 🛡️ NATIVE RAW SQL SELECT REPLACEMENT
  // =======================================================

  let like_sys = [];
  let error = null;

  try {
    like_sys = await sql`
      SELECT * FROM like_sys 
      WHERE post_to_like = ${postId} AND liked_by = ${curUserId}
    `;
  } catch (dbSelectErr) {
    error = dbSelectErr;
  }

  if (like_sys) {
    if (like_sys?.at(0)) {
      // =======================================================
      // 🛡️ NATIVE RAW SQL DELETE REPLACEMENT (Unlike)
      // =======================================================

      try {
        await sql`
          DELETE FROM like_sys 
          WHERE post_to_like = ${postId} AND liked_by = ${user?.id}
        `;
      } catch (dbDeleteErr) {
        console.error("Error unliking post:", dbDeleteErr.message);
        return {
          success: false,
          message: "Post unlike failed",
        };
      }
    }
  }

  let likeCmplte;
  let likeErr;

  if (like_sys?.length <= 0) {
    const likeObject = {
      post_to_like: postId,
      liked_by: user?.id,
      like_post_onwer: like_post_onwer,
    };

    // =======================================================
    // 🛡️ NATIVE RAW SQL INSERT REPLACEMENT (Like)
    // =======================================================

    try {
      const rows = await sql`
        INSERT INTO like_sys (post_to_like, liked_by, like_post_onwer)
        VALUES (${likeObject.post_to_like}, ${likeObject.liked_by}, ${likeObject.like_post_onwer})
        RETURNING *
      `;
      likeCmplte = rows;
    } catch (dbInsertErr) {
      likeErr = dbInsertErr;
      return {
        success: false,
        message: "Post like failed",
      };
    }
  }

  if (likeErr) {
    console.error(likeErr?.message);
  }

  revalidatePath(curPath);
  revalidatePath("/");

  return {
    success: true,
    message: "Post liked successfully!",
    likeData: likeCmplte,
  };
}

export async function savePost(saveObj) {
  const postId = saveObj.postId;
  const curUserId = saveObj.curUserId;
  const curPath = saveObj.curPath;

  const supabase = await createServer();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user || user?.id !== curUserId)
    return {
      success: false,
      message: authError?.message || "User is not authorized",
    };

  // =======================================================
  // 🛡️ NATIVE RAW SQL SELECT REPLACEMENT
  // =======================================================
  let savedPost = [];
  let savedPostErr = null;

  try {
    savedPost = await sql`
      SELECT * FROM saved_posts 
      WHERE post_to_save = ${postId} AND saved_by = ${user?.id}
    `;
  } catch (dbSelectErr) {
    savedPostErr = dbSelectErr;
  }

  if (savedPostErr) {
    console.error(savedPostErr?.message);
  }

  let isSaved = false;
  let isUnSaved = false;

  if (savedPost?.length > 0) {
    if (savedPost?.at(0)) {
      // =======================================================
      // 🛡️ NATIVE RAW SQL DELETE REPLACEMENT (Unsave Post)
      // =======================================================
      try {
        await sql`
          DELETE FROM saved_posts 
          WHERE post_to_save = ${postId} AND saved_by = ${user?.id}
        `;
        isUnSaved = true;
      } catch (dbDeleteErr) {
        console.error("Error unsaving post:", dbDeleteErr.message);
        return {
          success: false,
          message: "Post save failed",
        };
      }
    }
  }

  if (savedPost?.length <= 0) {
    const saveObject = {
      post_to_save: postId,
      saved_by: user?.id,
    };

    // =======================================================
    // 🛡️ NATIVE RAW SQL INSERT REPLACEMENT (Save Post)
    // =======================================================
    try {
      const data = await sql`
        INSERT INTO saved_posts (post_to_save, saved_by)
        VALUES (${saveObject.post_to_save}, ${saveObject.saved_by})
        RETURNING *
      `;
      isSaved = true;
    } catch (dbInsertErr) {
      console.error("Error saving post:", dbInsertErr.message);
      return {
        success: false,
        message: "Post unsave failed",
      };
    }
  }

  revalidatePath(curPath);
  revalidatePath("/");

  return {
    success: true,
    message: "Post liked successfully!",
    isSaved: isSaved,
    isUnSaved: isUnSaved,
  };
}

export async function deletePost(formData) {
  const postOwnerId = formData.postOwnerId;
  const postId = formData.postId;
  const curPath = formData.toPath;

  const supabase = await createServer();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user || user?.id !== postOwnerId)
    return {
      success: false,
      message: authError?.message || "User is not authorized",
    };

  // =======================================================
  // 🛡️ NATIVE RAW SQL SELECT REPLACEMENT
  // =======================================================
  let postData = null;
  let postErr = null;

  try {
    const rows = await sql`
      SELECT * FROM user_posts WHERE id = ${postId}
    `;
    postData = rows; // Returns an array of matching row objects
  } catch (dbSelectErr) {
    postErr = dbSelectErr;
  }

  if (postErr || !postData || postData.length === 0) {
    return { success: false, message: postErr?.message || "Post not found." };
  }

  const curPost = postData.at(0);

  const postImages = curPost.post_images;

  // =======================================================
  // 🛡️ NATIVE RAW SQL DELETE REPLACEMENT
  // =======================================================
  let error = null;

  try {
    await sql`
      DELETE FROM user_posts WHERE id = ${curPost?.id}
    `;
  } catch (dbDeleteErr) {
    error = dbDeleteErr;
  }

  if (error) {
    console.error("error at 1245", error);
    return {
      success: false,
      message: "Could not delete the post, try again later",
    };
  }

  let postImgDel;
  let postImgDelErr;

  if (curPost?.post_user_id === user?.id) {
    if (curPost) {
      for (const postImg of postImages) {
        console.log("postImg at delete post", postImg);

        const imgName = postImg.split("/").at(-1);
        console.log("imgName at delete post", imgName);

        const { data, error } = await supabase.storage
          .from("post_images")
          .remove([`${imgName}`]);

        postImgDel = data;
        postImgDelErr = error;
      }
    }
  }

  if (postImgDelErr) {
    console.error("postImgDelErr at 1236", postImgDelErr);
  }

  revalidatePath("/");
  revalidatePath(`/user/${user?.id}`);

  return { success: true, message: "Post deleted successfully" };
}

export async function editPost(formData) {
  const postDesc = formData.get("postDesc");
  const postOwnerId = formData.get("postOwnerId");
  const postId = formData.get("postId");

  const supabase = await createServer();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user || user?.id !== postOwnerId)
    return {
      success: false,
      message: authError?.message || "User is not authorized",
    };

  const descObj = {
    description: postDesc,
  };

  // =======================================================
  // 🛡️ NATIVE RAW SQL UPDATE REPLACEMENT
  // =======================================================
  let data = null;
  let error = null;

  try {
    const rows = await sql`
      UPDATE user_posts 
      SET description = ${descObj.description} 
      WHERE id = ${postId}
      RETURNING *
    `;

    data = rows;
  } catch (dbUpdateErr) {
    error = dbUpdateErr;
  }

  if (error) {
    console.error(error);
    return {
      success: false,
      message: error.message || "Failed to update description.",
    };
  }

  revalidatePath("/");
  revalidatePath(`/posts/${postId}`);
}

export async function commentOnPost(formData) {
  const postId = formData.postId;
  const loggedInUserId = formData.loggedInUserId;
  const postPath = formData.pathname;
  const cmtBody = formData.cmtBody;
  const cmtId = formData.cmtId;
  const cmtOwnrId = formData.cmtOwnrId;
  const commented_post_owner = formData.postOwnerId;
  const real_target_user_id = formData.realTargetUserId;

  const supabase = await createServer();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user || user?.id !== loggedInUserId)
    return {
      success: false,
      message: authError?.message || "User is not authorized",
    };

  const commentObj = {
    post_to_comment: postId,
    commented_by: user?.id,
    comment_body: cmtBody,
    commented_post_owner: commented_post_owner,
  };

  if (cmtId) {
    commentObj.commented_on = cmtId;
    commentObj.real_target_user_id = real_target_user_id;
  }

  if (cmtOwnrId) {
    commentObj.comment_owner_id = cmtOwnrId;
  }

  // =======================================================
  // 🛡️ NATIVE RAW SQL ENTRY BLOCK
  // =======================================================
  let data = null;
  let error = null;

  try {
    const [insertedRow] = await sql`
      INSERT INTO comments_sys (
        post_to_comment, 
        commented_by, 
        comment_body, 
        commented_post_owner, 
        commented_on, 
        real_target_user_id, 
        comment_owner_id
      ) VALUES (
        ${commentObj.post_to_comment}, 
        ${commentObj.commented_by}, 
        ${commentObj.comment_body}, 
        ${commentObj.commented_post_owner}, 
        -- If these optional keys don't exist, JavaScript passes undefined which raw SQL handles as NULL
        ${commentObj.commented_on || null}, 
        ${commentObj.real_target_user_id || null}, 
        ${commentObj.comment_owner_id || null}
      )
      RETURNING *
    `;

    data = [insertedRow];
  } catch (dbError) {
    error = dbError;
  }

  if (error) {
    return {
      success: false,
      message: error.message || "Failed to submit comment.",
    };
  }

  revalidatePath("/");
  revalidatePath(postPath);
}

export async function likeComment(likeObj) {
  const postId = likeObj.postId;
  const curUserId = likeObj.curUserId;
  const curPath = likeObj.curPath;
  const cmntId = likeObj.cmntId;
  const cmnt_real_owner_id = likeObj.cmntPostOwnerId;

  const supabase = await createServer();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user || user?.id !== curUserId)
    return {
      success: false,
      message: authError?.message || "User is not authorized",
    };

  // =======================================================
  // 🛡️ NATIVE RAW SQL SELECT REPLACEMENT
  // =======================================================
  let comments_like_sys = [];
  let error = null;

  try {
    comments_like_sys = await sql`
      SELECT * FROM comments_like_sys 
      WHERE cmnt_to_like = ${cmntId} AND cmnt_liked_by = ${curUserId}
    `;
  } catch (dbSelectErr) {
    error = dbSelectErr;
  }

  if (comments_like_sys && comments_like_sys.length > 0) {
    if (comments_like_sys.at(0)) {
      // =======================================================
      // 🛡️ NATIVE RAW SQL DELETE REPLACEMENT (Unlike)
      // =======================================================
      try {
        await sql`
          DELETE FROM comments_like_sys 
          WHERE cmnt_to_like = ${cmntId} AND cmnt_liked_by = ${user?.id}
        `;
      } catch (dbDeleteErr) {
        console.error("Error unliking comment:", dbDeleteErr.message);
      }
    }
  }

  let likeCmplte;
  let likeErr;

  if (comments_like_sys.length <= 0) {
    const likeObject = {
      cmnt_post: postId,
      cmnt_liked_by: user?.id,
      cmnt_to_like: cmntId,
      cmnt_real_owner_id: cmnt_real_owner_id,
    };

    // =======================================================
    // 🛡️ NATIVE RAW SQL INSERT REPLACEMENT (Like)
    // =======================================================
    try {
      const rows = await sql`
        INSERT INTO comments_like_sys (
          cmnt_post, 
          cmnt_liked_by, 
          cmnt_to_like, 
          cmnt_real_owner_id
        ) VALUES (
          ${likeObject.cmnt_post}, 
          ${likeObject.cmnt_liked_by}, 
          ${likeObject.cmnt_to_like}, 
          ${likeObject.cmnt_real_owner_id}
        )
        RETURNING *
      `;
      likeCmplte = rows;
    } catch (dbInsertErr) {
      likeErr = dbInsertErr;
    }
  }

  if (likeErr) {
    console.error(likeErr.message);
  }

  revalidatePath(curPath);
  revalidatePath("/");

  return {
    success: true,
    message: "Post liked successfully!",
  };
}

export async function deleteComment(formData) {
  const commentOwnerId = formData.commentOwnerId;
  const cmntId = formData.cmntId;
  const curPath = formData.curPath;

  const supabase = await createServer();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user || user?.id !== commentOwnerId)
    return {
      success: false,
      message: authError?.message || "User is not authorized",
    };

  // =======================================================
  // 🛡️ NATIVE RAW SQL CASCADE DELETE (All-In-One Command)
  // =======================================================
  let error = null;

  try {
    await sql`
      DELETE FROM comments_sys WHERE id = ${cmntId}
    `;
  } catch (dbMainDelErr) {
    error = dbMainDelErr;
  }

  if (error) {
    console.error("Database deletion error:", error.message);
    return {
      success: false,
      message: error.message || "Failed to delete comment.",
    };
  }

  revalidatePath("/");
  revalidatePath(curPath);
}

export async function toggleDark(darkObj) {
  const isFirstTime = darkObj.isFirstTime;
  const dark_status = darkObj.dark_status;
  const darked_by = darkObj.darked_by;
  const darkId = darkObj.darkId;
  const curPath = darkObj.curPath;

  const supabase = await createServer();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user || user?.id !== darked_by)
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
      errorType: "AuthError",
    };

  // =======================================================
  // 🛡️ NATIVE RAW SQL CONDITIONAL EXECUTION
  // =======================================================
  let data = null;
  let error = null;

  try {
    if (isFirstTime) {
      data = await sql`
        INSERT INTO dark_mode (dark_status, darked_by)
        VALUES (${dark_status}, ${darked_by})
        RETURNING *
      `;
    } else {
      data = await sql`
        UPDATE dark_mode 
        SET dark_status = ${dark_status}
        WHERE darked_by = ${user?.id}
        RETURNING *
      `;
    }
  } catch (dbErr) {
    error = dbErr;
  }

  if (error)
    return {
      success: false,
      message: "Unable to update the theme right now.",
      errorType: "FetchFailed",
    };

  revalidatePath("/", "layout");
  revalidatePath(curPath);

  return { success: true, message: "Theme updated successfully" };
}
