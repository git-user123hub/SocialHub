import { useEffect, useRef, useState } from "react";
import LogoutBtn from "./LogoutBtn";
import DeleteAccBtn from "./DeleteAccBtn";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMainContext } from "./MainContext";
import { createClient } from "../_lib/supabase/client";
import DeletePostBtn from "./DeletePostBtn";
import EditPostBtn from "./EditPostBtn";
import FollowBtn from "./FollowBtn";

const supabase = createClient();

function DropDownList({
  listenCapturing = true,
  setMenuClicked,
  btnRef,
  ddType,
  additionalProps,
  setIsEditPostOpen,
  isEditPostOpen,
  ddBtnPos,
  entireProfileForEditPostMenu,
  setIsMiniModalOpened,
}) {
  const [postOwner, setPostOwner] = useState(null);
  const { curUser, articlePostId, setArticlePostId } = useMainContext();

  const params = useParams();

  const ref = useRef();

  let postId;

  if (ddType === "singlePostMoreOptionsList") {
    postId = params.postId;
  }

  useEffect(() => {
    function handleClick(e) {
      if (
        ref.current &&
        !ref.current.contains(e.target) &&
        !btnRef.contains(e.target)
      ) {
        setMenuClicked(false);
      }
    }

    document.addEventListener("click", handleClick, listenCapturing);

    return () =>
      document.removeEventListener("click", handleClick, listenCapturing);
  }, [setMenuClicked, listenCapturing, btnRef]);

  useEffect(() => {
    async function getPostOwner() {
      const { data, error } = await supabase
        .from("user_posts")
        .select("post_user_id")
        .eq("id", postId)
        .maybeSingle();

      setPostOwner(data);
    }

    if (ddType === "singlePostMoreOptionsList") {
      getPostOwner();
    }
  }, [ddType, postId]);

  useEffect(() => {
    if (ddType === "article3DotsBtn") {
      setArticlePostId(additionalProps?.postId);
    }
  }, [additionalProps?.postId, ddType, setArticlePostId]);

  if (!curUser) return;

  if (ddType === "profileSet") {
    return (
      <div
        ref={ref}
        className="absolute top-[34px] min-[500px]:top-[37px] md:top-[42px] right-[-3px] bg-primaryClr w-[250px] rounded-2xl flex items-center flex-col justify-evenly gap-1 border border-primaryHvrClr text-[13px] px-2 py-2 z-[2000]"
      >
        <DeleteAccBtn
          setMenuClicked={setMenuClicked}
          setIsMiniModalOpened={setIsMiniModalOpened}
        />
        <LogoutBtn setMenuClicked={setMenuClicked} />
      </div>
    );
  }

  if (ddType === "singlePostMoreOptionsList") {
    return (
      <div
        ref={ref}
        className="absolute top-[34px] right-[-10px] min-[500px]:right-[-17px] bg-primaryClr w-[250px] rounded-2xl flex items-center flex-col justify-evenly gap-1 border border-primaryHvrClr text-strokeClr text-[13px] px-2 py-2 z-[2000]"
      >
        {additionalProps && additionalProps.isPostOwner && (
          <>
            {additionalProps.loggedInUserId === additionalProps.postOwnerId && (
              <>
                <DeletePostBtn
                  postOwnerId={additionalProps.loggedInUserId}
                  postId={additionalProps.postId}
                  toPath={additionalProps.curPostModalPath}
                  setMenuClicked={setMenuClicked}
                  setIsMiniModalOpened={setIsMiniModalOpened}
                />
                <EditPostBtn
                  setMenuClicked={setMenuClicked}
                  setIsEditPostOpen={setIsEditPostOpen}
                />
              </>
            )}
          </>
        )}

        {!additionalProps.isPostOwner && (
          <FollowBtn
            whichBtn="inPostDDFollowBtn"
            isFollowing={additionalProps.isFollowing}
            name={`${additionalProps.isFollowing ? "UnFollow" : "Follow"}`}
            curProfileId={additionalProps.postOwnerId}
            setMenuClicked={setMenuClicked}
            curProUsername={entireProfileForEditPostMenu?.username}
          />
        )}

        {!additionalProps.isPostModal && (
          <Link
            href={`/user/${additionalProps.postOwnerId}`}
            onClick={(e) => {
              setMenuClicked(false);
            }}
            className="hover:rounded-lg w-full h-full hover:bg-primaryHvrClr flex py-3 px-4 gap-2 items-center"
          >
            <span>About this Account</span>
          </Link>
        )}

        {additionalProps.isPostModal && (
          <span
            onClick={(e) => {
              window.location.assign(`/posts/${additionalProps.postId}`);
              setMenuClicked(false);
            }}
            className="hover:rounded-lg w-full h-full hover:bg-primaryHvrClr flex py-3 px-4 gap-2 items-center cursor-pointer"
          >
            <span>Go to the post</span>
          </span>
        )}
      </div>
    );
  }

  if (ddType === "article3DotsBtn") {
    return (
      <div
        ref={ref}
        className="absolute top-[34px] right-[-10px] min-[500px]:right-[-17px] bg-primaryClr w-[250px] rounded-2xl flex items-center flex-col justify-evenly gap-1 border border-primaryHvrClr text-strokeClr text-[13px] px-2 py-2 z-[2000]"
      >
        {additionalProps && additionalProps.isPostOwner && (
          <>
            {additionalProps.loggedInUserId === additionalProps.postOwnerId && (
              <>
                <DeletePostBtn
                  postOwnerId={additionalProps.loggedInUserId}
                  postId={additionalProps.postId}
                  toPath={additionalProps.curPostModalPath}
                  setMenuClicked={setMenuClicked}
                  setIsMiniModalOpened={setIsMiniModalOpened}
                />
                <EditPostBtn
                  setMenuClicked={setMenuClicked}
                  setIsEditPostOpen={setIsEditPostOpen}
                />
              </>
            )}
          </>
        )}

        {!additionalProps.isPostOwner && (
          <FollowBtn
            whichBtn="inPostDDFollowBtn"
            isFollowing={additionalProps.isFollowing}
            name={`${additionalProps.isFollowing ? "UnFollow" : "Follow"}`}
            curProfileId={additionalProps.postOwnerId}
            setMenuClicked={setMenuClicked}
            curProUsername={entireProfileForEditPostMenu?.username}
          />
        )}

        <Link
          href={`/user/${additionalProps.postOwnerId}`}
          onClick={(e) => {
            setMenuClicked(false);
          }}
          className="hover:rounded-lg w-full h-full hover:bg-primaryHvrClr flex py-3 px-4 gap-2 items-center"
        >
          <span>About this Account</span>
        </Link>

        <span
          onClick={(e) => {
            window.location.assign(`/posts/${additionalProps.postId}`);
            setMenuClicked(false);
          }}
          className="hover:rounded-lg w-full h-full hover:bg-primaryHvrClr flex py-3 px-4 gap-2 items-center cursor-pointer"
        >
          <span>Go to the post</span>
        </span>
      </div>
    );
  }
}

export default DropDownList;
