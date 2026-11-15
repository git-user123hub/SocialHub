"use client";

import { memo, useEffect, useState } from "react";
import { getProfile } from "../_lib/inClient-services";
import Image from "next/image";
import { UserIcon } from "@heroicons/react/24/outline";
import FollowBtn from "./FollowBtn";
import { createClient } from "../_lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CreationTime from "./CreationTime";
import NotificationBody from "./NotificationBody";

const supabase = createClient();

const NotificationsWrapper = memo(function NotificationsWrapper({
  notifyObj,
  elementRef,
  filterBtn,
  setNotificationClicked,
}) {
  const [userActingProfile, setUserActingProfile] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [likePost, setLikePost] = useState(null);
  const [commentOnPost, setCommentOnPost] = useState(null);

  const router = useRouter();

  useEffect(() => {
    async function profileOfUser(userId) {
      const { data: profile } = await getProfile(userId);
      setUserActingProfile(profile);
    }

    profileOfUser(notifyObj?.user_acting);
  }, [notifyObj?.user_acting]);

  useEffect(() => {
    async function profileOfUser(actingUser, itselfUser) {
      const { data, error } = await supabase
        .from("follow_sys")
        .select("*")
        .eq("user_to_follow", actingUser)
        .eq("user_following", itselfUser)
        .maybeSingle();

      if (data) {
        setIsFollowing(true);
      }

      if (!data) {
        setIsFollowing(false);
      }
    }

    if (notifyObj?.notification_type === "realTimeFollowers") {
      profileOfUser(notifyObj?.user_acting, notifyObj?.user_itself);
    }
  }, [
    notifyObj?.notification_type,
    notifyObj?.user_acting,
    notifyObj?.user_itself,
  ]);

  useEffect(() => {
    async function likedPost(postId) {
      let { data } = await supabase
        .from("user_posts")
        .select("*")
        .eq("id", postId)
        .maybeSingle();

      if (data) {
        setLikePost(data);
      }
    }

    if (
      notifyObj?.notification_type === "realTimePostLike" ||
      notifyObj?.notification_type === "realTimeCommented" ||
      notifyObj?.notification_type === "realTimeCommentMention" ||
      notifyObj?.notification_type === "realTimeCommentLike"
    ) {
      likedPost(notifyObj?.notify_post_id);
    }
  }, [notifyObj?.notification_type, notifyObj?.notify_post_id]);

  useEffect(() => {
    async function commentOnPostFunc(cmtId) {
      let { data } = await supabase
        .from("comments_sys")
        .select("*")
        .eq("id", cmtId)
        .maybeSingle();

      if (data) {
        setCommentOnPost(data);
      }
    }

    if (
      notifyObj?.notification_type === "realTimeCommented" ||
      notifyObj?.notification_type === "realTimeCommentMention" ||
      notifyObj?.notification_type === "realTimeCommentLike"
    ) {
      commentOnPostFunc(notifyObj?.notify_comment_id);
    }
  }, [notifyObj?.notification_type, notifyObj?.notify_comment_id]);

  if (
    filterBtn === "follows" &&
    notifyObj?.notification_type === "realTimeFollowers"
  ) {
    return (
      <div
        ref={elementRef}
        data-notifyobjid={notifyObj?.id}
        data-notifyobjread={notifyObj?.is_read}
        onClick={(e) => {
          setNotificationClicked(false);
          router.push(`/user/${userActingProfile?.id}`);
        }}
        className={`notifyWrapCl w-full px-5 py-2 hover:bg-hoverClr rounded-lg cursor-pointer flex items-center gap-3 relative ${notifyObj && !notifyObj.is_read ? "after:w-[7px] after:h-[7px] after:bg-red-700 after:rounded-full after:absolute after:right-[4px]" : ""}`}
      >
        <>
          <div className="shrink-0 w-[44px] h-[44px] rounded-full relative flex justify-center items-center overflow-hidden bg-[#d4d4d4]">
            {userActingProfile?.avatar ? (
              <Image
                src={userActingProfile?.avatar}
                alt="article photo"
                fill
                sizes="468px"
                className="rounded-md object-fill"
                quality={100}
                priority
              />
            ) : (
              <UserIcon className="w-[55%] h-[55%] [&>path]:stroke-black [&>path]:stroke-[1]" />
            )}
          </div>

          <div className="flex-grow flex items-center">
            <div className="leading-tight">
              <strong>
                <Link href={`/user/${userActingProfile?.id}`}>
                  {userActingProfile?.username}
                </Link>
              </strong>{" "}
              {notifyObj.notification_type === "realTimeFollowers" && (
                <span>started following you.</span>
              )}
              {notifyObj.notification_type === "realTimePostLike" && (
                <span> liked your post. </span>
              )}
              {notifyObj.notification_type === "realTimeCommented" && (
                <NotificationBody
                  notifyObj={notifyObj}
                  userActingProfile={userActingProfile}
                  commentOnPost={commentOnPost}
                  notificationDesc="commented:"
                />
              )}
              {notifyObj.notification_type === "realTimeCommentLike" && (
                <NotificationBody
                  notifyObj={notifyObj}
                  userActingProfile={userActingProfile}
                  commentOnPost={commentOnPost}
                  notificationDesc="liked on your comment:"
                />
              )}
              {notifyObj.notification_type === "realTimeCommentMention" && (
                <NotificationBody
                  notifyObj={notifyObj}
                  userActingProfile={userActingProfile}
                  commentOnPost={commentOnPost}
                  notificationDesc="mentioned you in comment:"
                />
              )}{" "}
              <CreationTime
                timesAgo={notifyObj?.created_at}
                postLcl="articlePost"
              />
            </div>
          </div>

          <>
            {notifyObj.notification_type === "realTimeFollowers" ? (
              <span onClick={(e) => e.stopPropagation()} className="shrink-0">
                <FollowBtn
                  name={`${isFollowing ? "Following" : "Follow Back"}`}
                  curProfileId={userActingProfile?.id}
                  isFollowing={isFollowing}
                  whichBtn="notificationBtn"
                  optionalProp={setIsFollowing}
                />
              </span>
            ) : (
              <div
                className="shrink-0 w-[44px] h-[44px] rounded-lg relative flex justify-center items-center overflow-hidden bg-[#d4d4d4]"
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.assign(`/posts/${likePost?.id}`);
                }}
              >
                {likePost?.post_images && (
                  <Image
                    src={likePost?.post_images.at(0)}
                    alt="article photo"
                    fill
                    sizes="468px"
                    className="rounded-md object-fill"
                    quality={100}
                    priority
                  />
                )}
              </div>
            )}
          </>
        </>
      </div>
    );
  }

  if (
    filterBtn === "postLikes" &&
    notifyObj?.notification_type === "realTimePostLike"
  ) {
    return (
      <div
        ref={elementRef}
        data-notifyobjid={notifyObj?.id}
        data-notifyobjread={notifyObj?.is_read}
        onClick={(e) => {
          setNotificationClicked(false);
          router.push(`/user/${userActingProfile?.id}`);
        }}
        className={`notifyWrapCl w-full px-5 py-2 hover:bg-hoverClr rounded-lg cursor-pointer flex items-center gap-3 relative ${notifyObj && !notifyObj.is_read ? "after:w-[7px] after:h-[7px] after:bg-red-700 after:rounded-full after:absolute after:right-[4px]" : ""}`}
      >
        <>
          <div className="shrink-0 w-[44px] h-[44px] rounded-full relative flex justify-center items-center overflow-hidden bg-[#d4d4d4]">
            {userActingProfile?.avatar ? (
              <Image
                src={userActingProfile?.avatar}
                alt="article photo"
                fill
                sizes="468px"
                className="rounded-md object-fill"
                quality={100}
                priority
              />
            ) : (
              <UserIcon className="w-[55%] h-[55%] [&>path]:stroke-black [&>path]:stroke-[1]" />
            )}
          </div>

          <div className="flex-grow flex items-center">
            <div className="leading-tight">
              <strong>
                <Link href={`/user/${userActingProfile?.id}`}>
                  {userActingProfile?.username}
                </Link>
              </strong>{" "}
              {notifyObj.notification_type === "realTimeFollowers" && (
                <span>started following you.</span>
              )}
              {notifyObj.notification_type === "realTimePostLike" && (
                <span> liked your post. </span>
              )}
              {notifyObj.notification_type === "realTimeCommented" && (
                <NotificationBody
                  notifyObj={notifyObj}
                  userActingProfile={userActingProfile}
                  commentOnPost={commentOnPost}
                  notificationDesc="commented:"
                />
              )}
              {notifyObj.notification_type === "realTimeCommentLike" && (
                <NotificationBody
                  notifyObj={notifyObj}
                  userActingProfile={userActingProfile}
                  commentOnPost={commentOnPost}
                  notificationDesc="liked on your comment:"
                />
              )}
              {notifyObj.notification_type === "realTimeCommentMention" && (
                <NotificationBody
                  notifyObj={notifyObj}
                  userActingProfile={userActingProfile}
                  commentOnPost={commentOnPost}
                  notificationDesc="mentioned you in comment:"
                />
              )}{" "}
              <CreationTime
                timesAgo={notifyObj?.created_at}
                postLcl="articlePost"
              />
            </div>
          </div>

          <>
            {notifyObj.notification_type === "realTimeFollowers" ? (
              <span onClick={(e) => e.stopPropagation()} className="shrink-0">
                <FollowBtn
                  name={`${isFollowing ? "Following" : "Follow Back"}`}
                  curProfileId={userActingProfile?.id}
                  isFollowing={isFollowing}
                  whichBtn="notificationBtn"
                  optionalProp={setIsFollowing}
                />
              </span>
            ) : (
              <div
                className="shrink-0 w-[44px] h-[44px] rounded-lg relative flex justify-center items-center overflow-hidden bg-[#d4d4d4]"
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.assign(`/posts/${likePost?.id}`);
                }}
              >
                {likePost?.post_images && (
                  <Image
                    src={likePost?.post_images.at(0)}
                    alt="article photo"
                    fill
                    sizes="468px"
                    className="rounded-md object-fill"
                    quality={100}
                    priority
                  />
                )}
              </div>
            )}
          </>
        </>
      </div>
    );
  }

  if (
    filterBtn === "comments" &&
    (notifyObj?.notification_type === "realTimeCommented" ||
      notifyObj?.notification_type === "realTimeCommentLike" ||
      notifyObj?.notification_type === "realTimeCommentMention")
  ) {
    return (
      <div
        ref={elementRef}
        data-notifyobjid={notifyObj?.id}
        data-notifyobjread={notifyObj?.is_read}
        onClick={(e) => {
          setNotificationClicked(false);
          router.push(`/user/${userActingProfile?.id}`);
        }}
        className={`notifyWrapCl w-full px-5 py-2 hover:bg-hoverClr rounded-lg cursor-pointer flex items-center gap-3 relative ${notifyObj && !notifyObj.is_read ? "after:w-[7px] after:h-[7px] after:bg-red-700 after:rounded-full after:absolute after:right-[4px]" : ""}`}
      >
        <>
          <div className="shrink-0 w-[44px] h-[44px] rounded-full relative flex justify-center items-center overflow-hidden bg-[#d4d4d4]">
            {userActingProfile?.avatar ? (
              <Image
                src={userActingProfile?.avatar}
                alt="article photo"
                fill
                sizes="468px"
                className="rounded-md object-fill"
                quality={100}
                priority
              />
            ) : (
              <UserIcon className="w-[55%] h-[55%] [&>path]:stroke-black [&>path]:stroke-[1]" />
            )}
          </div>

          <div className="flex-grow flex items-center">
            <div className="leading-tight">
              <strong>
                <Link href={`/user/${userActingProfile?.id}`}>
                  {userActingProfile?.username}
                </Link>
              </strong>{" "}
              {notifyObj.notification_type === "realTimeFollowers" && (
                <span>started following you.</span>
              )}
              {notifyObj.notification_type === "realTimePostLike" && (
                <span> liked your post. </span>
              )}
              {notifyObj.notification_type === "realTimeCommented" && (
                <NotificationBody
                  notifyObj={notifyObj}
                  userActingProfile={userActingProfile}
                  commentOnPost={commentOnPost}
                  notificationDesc="commented:"
                />
              )}
              {notifyObj.notification_type === "realTimeCommentLike" && (
                <NotificationBody
                  notifyObj={notifyObj}
                  userActingProfile={userActingProfile}
                  commentOnPost={commentOnPost}
                  notificationDesc="liked on your comment:"
                />
              )}
              {notifyObj.notification_type === "realTimeCommentMention" && (
                <NotificationBody
                  notifyObj={notifyObj}
                  userActingProfile={userActingProfile}
                  commentOnPost={commentOnPost}
                  notificationDesc="mentioned you in comment:"
                />
              )}{" "}
              <CreationTime
                timesAgo={notifyObj?.created_at}
                postLcl="articlePost"
              />
            </div>
          </div>

          <>
            {notifyObj.notification_type === "realTimeFollowers" ? (
              <span onClick={(e) => e.stopPropagation()} className="shrink-0">
                <FollowBtn
                  name={`${isFollowing ? "Following" : "Follow Back"}`}
                  curProfileId={userActingProfile?.id}
                  isFollowing={isFollowing}
                  whichBtn="notificationBtn"
                  optionalProp={setIsFollowing}
                />
              </span>
            ) : (
              <div
                className="shrink-0 w-[44px] h-[44px] rounded-lg relative flex justify-center items-center overflow-hidden bg-[#d4d4d4]"
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.assign(`/posts/${likePost?.id}`);
                }}
              >
                {likePost?.post_images && (
                  <Image
                    src={likePost?.post_images.at(0)}
                    alt="article photo"
                    fill
                    sizes="468px"
                    className="rounded-md object-fill"
                    quality={100}
                    priority
                  />
                )}
              </div>
            )}
          </>
        </>
      </div>
    );
  }

  if (filterBtn === "all") {
    return (
      <div
        ref={elementRef}
        data-notifyobjid={notifyObj?.id}
        data-notifyobjread={notifyObj?.is_read}
        onClick={(e) => {
          setNotificationClicked(false);
          router.push(`/user/${userActingProfile?.id}`);
        }}
        className={`notifyWrapCl w-full px-5 py-2 hover:bg-hoverClr rounded-lg cursor-pointer flex items-center gap-3 relative ${notifyObj && !notifyObj.is_read ? "after:w-[7px] after:h-[7px] after:bg-red-700 after:rounded-full after:absolute after:right-[4px]" : ""}`}
      >
        <>
          <div className="shrink-0 w-[44px] h-[44px] rounded-full relative flex justify-center items-center overflow-hidden bg-[#d4d4d4]">
            {userActingProfile?.avatar ? (
              <Image
                src={userActingProfile?.avatar}
                alt="article photo"
                fill
                sizes="468px"
                className="rounded-md object-fill"
                quality={100}
                priority
              />
            ) : (
              <UserIcon className="w-[55%] h-[55%] [&>path]:stroke-black [&>path]:stroke-[1]" />
            )}
          </div>

          <div className="flex-grow flex items-center">
            <div className="leading-tight">
              <strong>
                <Link href={`/user/${userActingProfile?.id}`}>
                  {userActingProfile?.username}
                </Link>
              </strong>{" "}
              {notifyObj.notification_type === "realTimeFollowers" && (
                <span>started following you.</span>
              )}
              {notifyObj.notification_type === "realTimePostLike" && (
                <span> liked your post. </span>
              )}
              {notifyObj.notification_type === "realTimeCommented" && (
                <NotificationBody
                  notifyObj={notifyObj}
                  userActingProfile={userActingProfile}
                  commentOnPost={commentOnPost}
                  notificationDesc="commented:"
                />
              )}
              {notifyObj.notification_type === "realTimeCommentLike" && (
                <NotificationBody
                  notifyObj={notifyObj}
                  userActingProfile={userActingProfile}
                  commentOnPost={commentOnPost}
                  notificationDesc="liked on your comment:"
                />
              )}
              {notifyObj.notification_type === "realTimeCommentMention" && (
                <NotificationBody
                  notifyObj={notifyObj}
                  userActingProfile={userActingProfile}
                  commentOnPost={commentOnPost}
                  notificationDesc="mentioned you in comment:"
                />
              )}{" "}
              <CreationTime
                timesAgo={notifyObj?.created_at}
                postLcl="articlePost"
              />
            </div>
          </div>

          <>
            {notifyObj.notification_type === "realTimeFollowers" ? (
              <span onClick={(e) => e.stopPropagation()} className="shrink-0">
                <FollowBtn
                  name={`${isFollowing ? "Following" : "Follow Back"}`}
                  curProfileId={userActingProfile?.id}
                  isFollowing={isFollowing}
                  whichBtn="notificationBtn"
                  optionalProp={setIsFollowing}
                />
              </span>
            ) : (
              <div
                className="shrink-0 w-[44px] h-[44px] rounded-lg relative flex justify-center items-center overflow-hidden bg-[#d4d4d4]"
                onClick={(e) => {
                  e.stopPropagation();
                  window.location.assign(`/posts/${likePost?.id}`);
                }}
              >
                {likePost?.post_images && (
                  <Image
                    src={likePost?.post_images.at(0)}
                    alt="article photo"
                    fill
                    sizes="468px"
                    className="rounded-md object-fill"
                    quality={100}
                    priority
                  />
                )}
              </div>
            )}
          </>
        </>
      </div>
    );
  }
});

export default NotificationsWrapper;
