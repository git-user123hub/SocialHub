"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChatBubbleBottomCenterIcon } from "@heroicons/react/24/solid";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { useMainContext } from "./MainContext";

function MyPost({ index, arrLength, myPost, fromWhere }) {
  const [onHoverPost, setOnHoverPost] = useState(false);
  const [doesSupportHvr, setDoesSupportHvr] = useState(false);

  const { isMobile } = useMainContext();

  function handleHoverEnter(e) {
    const supportsHover = window.matchMedia("(hover: hover)").matches;
    if (!supportsHover) {
      setDoesSupportHvr(true);
    }
    setOnHoverPost(true);
  }

  function handleHoverLeave(e) {
    setOnHoverPost(false);
    setDoesSupportHvr(false);
  }

  function handlePostRoute(e) {
    e.preventDefault();
    window.location.assign(`/posts/${myPost.id}`);
  }

  let onlyOneRow = arrLength <= 4;
  let isLast = onlyOneRow && arrLength === index;
  let firstRowLastEl;
  if (isLast) {
    firstRowLastEl = index;
  }

  let isFourth = false;
  if (index / 4 === 1) {
    isFourth = true;
  }

  let lastFours;

  if (arrLength - 3 === index) {
    lastFours = index;
  }
  if (arrLength - 2 === index) {
    lastFours = index;
  }
  if (arrLength - 1 === index) {
    lastFours = index;
  }
  if (arrLength === index) {
    lastFours = index;
  }

  let gridElNumberIs;

  if (lastFours) {
    let whichNumber = String(lastFours / 4).split(".");

    if (whichNumber.length > 1) {
      if (Number(whichNumber.at(1)) === 25) {
        gridElNumberIs = "first";
      }
      if (Number(whichNumber.at(1)) === 5) {
        gridElNumberIs = "second";
      }
      if (Number(whichNumber.at(1)) === 75) {
        gridElNumberIs = "third";
      }
    }

    if (whichNumber.length === 1) {
      gridElNumberIs = "fourth";
    }
  }

  if (fromWhere !== "MorePostsFromUser") {
    return (
      <Link
        href={isMobile ? "" : `/posts/${myPost.id}`}
        onClick={isMobile ? handlePostRoute : undefined}
        className={`w-full ${!isFourth ? "mr-[1px]" : ""} h-auto w-full cursor-pointer`}
        onMouseEnter={handleHoverEnter}
        onMouseLeave={handleHoverLeave}
      >
        <div className={`relative aspect-[2/3] box-border overflow-hidden`}>
          <Image
            src={myPost.post_images.at(0)}
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            quality={50}
            className="object-cover"
            alt="Mountains and forests with two cabins"
            priority
          />

          {onHoverPost && (
            <>
              {doesSupportHvr && (
                <div
                  className={`absolute top-0 left-0 w-full h-full bg-slate-900/80 flex justify-center items-center rounded-[inherit] gap-3`}
                ></div>
              )}

              {!doesSupportHvr && (
                <div
                  className={`absolute top-0 left-0 w-full h-full bg-slate-900/80 flex justify-center items-center rounded-[inherit] gap-3`}
                >
                  <div className="flex items-center gap-1">
                    <HeartIconSolid className="w-7 h-7 [&>path]:stroke-[1] fill-slate-300" />
                    <p className="text-slate-300 text-lg font-semibold">
                      {myPost.LikesCount}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <ChatBubbleBottomCenterIcon className="w-7 h-7 [&>path]:stroke-[1] fill-slate-300" />
                    <p className="text-slate-300 text-lg font-semibold">
                      {myPost.commentsCount}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Link>
    );
  }

  if (fromWhere === "MorePostsFromUser") {
    return (
      <div
        onClick={(e) => {
          window.location.assign(`/posts/${myPost.id}`);
        }}
        className={`w-full ${!isFourth ? "mr-[1px]" : ""} h-auto w-full cursor-pointer`}
        onMouseEnter={handleHoverEnter}
        onMouseLeave={handleHoverLeave}
      >
        <div className={`relative aspect-[2/3] box-border overflow-hidden`}>
          <Image
            src={myPost.post_images.at(0)}
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            quality={50}
            className="object-cover"
            alt="Mountains and forests with two cabins"
            priority
          />

          {onHoverPost && (
            <>
              {doesSupportHvr && (
                <div className="absolute top-0 left-0 w-full h-full bg-slate-900/80 flex justify-center items-center rounded-[inherit] gap-3"></div>
              )}
              {!doesSupportHvr && (
                <div className="absolute top-0 left-0 w-full h-full bg-slate-900/80 flex justify-center items-center rounded-[inherit] gap-3">
                  <div className="flex items-center gap-1">
                    <HeartIconSolid className="w-7 h-7 [&>path]:stroke-[1] fill-slate-300" />
                    <p className="text-slate-300 text-lg font-semibold">
                      {myPost.LikesCount}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <ChatBubbleBottomCenterIcon className="w-7 h-7 [&>path]:stroke-[1] fill-slate-300" />
                    <p className="text-slate-300 text-lg font-semibold">
                      {myPost.commentsCount}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }
}

export default MyPost;
