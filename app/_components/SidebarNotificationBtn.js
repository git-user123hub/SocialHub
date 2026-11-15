"use client";

import { HeartIcon } from "@heroicons/react/24/outline";
import { useMainContext } from "./MainContext";
import NotificationsBar from "./NotificationsBar";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { createClient } from "../_lib/supabase/client";
import { getProfile } from "../_lib/inClient-services";

const supabase = createClient();

function SidebarNotificationBtn({ setSbExpanded }) {
  const [newNotify, setNewNotifi] = useState(false);
  const [isAnyNotify, setIsAnyNotify] = useState(false);

  const {
    notificationHvr,
    setNotificationHvr,
    notificationClicked,
    setNotificationClicked,
  } = useMainContext();
  const { curUser } = useMainContext();

  const sdNotifiBtnRef = useRef(null);

  useEffect(() => {
    if (notificationClicked) {
      document.querySelector("html").style.scrollbarGutter = "stable";
      document.body.style.overflow = "hidden";
    } else {
      document.querySelector("html").style.scrollbarGutter = "auto";
      document.body.style.overflow = "visible";
    }
  }, [notificationClicked]);

  useEffect(() => {
    async function results() {
      const { data } = await supabase
        .from("notifications_sys")
        .select("*")
        .eq("user_itself", curUser?.id)
        .order("created_at", { ascending: false });

      if (data.length > 0) {
        const notifyArr = data?.filter((notify) => {
          return notify.is_read !== true;
        });

        if (notifyArr?.length > 0) {
          setIsAnyNotify(true);
        }

        if (notifyArr?.length === 0) {
          setIsAnyNotify(false);
        }
      }
    }

    if (curUser?.id) {
      results();
    }
  }, [curUser?.id]);

  // notifications -realTime
  useEffect(() => {
    const channel = supabase
      .channel(`notifications ${curUser?.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications_sys",
          filter: `is_read=eq.${false}`,
        },
        (payload) => {
          if (payload.new?.user_acting !== curUser?.id) {
            if (!payload.new?.is_read) {
              setNewNotifi(true);
            }
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [curUser?.id]);

  // followers -realTime
  useEffect(() => {
    const channel = supabase
      .channel(`followers ${curUser?.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "follow_sys",
          filter: `user_to_follow=eq.${curUser?.id}`,
        },
        async (payload) => {
          const { data: followerProfile } = await getProfile(
            payload?.new?.user_following,
          );

          toast.success(`You have a new follower ${followerProfile.username}`);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [curUser?.id]);

  // post likes -realTime
  useEffect(() => {
    const channel = supabase
      .channel(`post likes ${curUser?.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "like_sys",
          filter: `like_post_onwer=eq.${curUser?.id}`,
        },
        async (payload) => {
          if (payload.new?.liked_by !== curUser?.id) {
            const { data: postLiker } = await getProfile(payload.new?.liked_by);
            toast.success(
              <div
                onClick={(e) =>
                  window.location.assign(`/posts/${payload.new?.post_to_like}`)
                }
                className="cursor-pointer"
              >
                {postLiker?.username} <span>liked your post!</span>
              </div>,
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [curUser?.id]);

  // comment -realTime
  useEffect(() => {
    const channel = supabase
      .channel(`comment ${curUser?.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments_sys",
          filter: `commented_post_owner=eq.${curUser?.id}`,
        },
        async (payload) => {
          if (payload.new?.commented_by !== curUser?.id) {
            const { data: commentorProfile } = await getProfile(
              payload.new?.commented_by,
            );

            toast.success(
              <div
                onClick={(e) =>
                  window.location.assign(
                    `/posts/${payload.new?.post_to_comment}`,
                  )
                }
                className="cursor-pointer"
              >
                {commentorProfile?.username}{" "}
                <span>commented on your post!</span>
              </div>,
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [curUser?.id]);

  // comment likes -realTime
  useEffect(() => {
    const channel = supabase
      .channel(`comment likes ${curUser?.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments_like_sys",
          filter: `cmnt_real_owner_id=eq.${curUser?.id}`,
        },
        async (payload) => {
          if (payload.new?.cmnt_liked_by !== curUser?.id) {
            const { data: commentLikerProfile } = await getProfile(
              payload.new?.cmnt_liked_by,
            );

            toast.success(
              <div
                onClick={(e) =>
                  window.location.assign(`/posts/${payload.new?.cmnt_post}`)
                }
                className="cursor-pointer"
              >
                {commentLikerProfile?.username} <span>liked your comment!</span>
              </div>,
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [curUser?.id]);

  // comment mention -realTime
  useEffect(() => {
    const channel = supabase
      .channel(`comment mention ${curUser?.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments_sys",
          filter: `real_target_user_id=eq.${curUser?.id}`,
        },
        async (payload) => {
          if (payload.new?.commented_by !== curUser?.id) {
            const { data: commentorProfile } = await getProfile(
              payload.new?.commented_by,
            );

            toast.success(
              <div
                onClick={(e) =>
                  window.location.assign(
                    `/posts/${payload.new?.post_to_comment}`,
                  )
                }
                className="cursor-pointer"
              >
                {commentorProfile?.username}{" "}
                <span>mentioned you in the comment!</span>
              </div>,
            );
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [curUser?.id]);

  return (
    <>
      <div
        ref={sdNotifiBtnRef}
        tabIndex={!curUser ? -1 : 0}
        className={`${notificationHvr ? "bg-hoverClr" : ""} rounded-md cursor-pointer lg:rounded-tr-none lg:rounded-br-none ${!curUser ? "pointer-events-none" : ""}`}
        onClick={(e) => {
          e.preventDefault();
          setSbExpanded(false);
          setNotificationClicked((curSt) => !curSt);
        }}
        onMouseEnter={(e) => {
          const supportsHover = window.matchMedia("(hover: hover)").matches;

          if (supportsHover) {
            setNotificationHvr(true);
          }
        }}
        onMouseLeave={(e) => setNotificationHvr(false)}
      >
        <div className={`flex items-center px-2 py-2 relative`}>
          <div
            className={`${newNotify || isAnyNotify ? "after:content-[''] after:w-[10px] after:h-[10px] after:border-[1px] after:border-mainClr after:bg-red-700 after:rounded-full after:absolute after:top-[10px] after:right-[7px]" : ""}`}
          >
            <HeartIcon className="w-7 h-7 [&>path]:stroke-strokeClr [&>path]:stroke-[1.7]" />
          </div>
        </div>
      </div>

      {notificationClicked && (
        <NotificationsBar
          setNotificationClicked={setNotificationClicked}
          newNotify={newNotify}
          setIsAnyNotify={setIsAnyNotify}
          setNewNotifi={setNewNotifi}
          sdNotifiBtnRef={sdNotifiBtnRef}
        />
      )}
    </>
  );
}

export default SidebarNotificationBtn;
