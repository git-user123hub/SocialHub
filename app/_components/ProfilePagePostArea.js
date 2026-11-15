"use client";

import { usePathname } from "next/navigation";
import {
  BookmarkIcon as BookmarkIconOutline,
  Squares2X2Icon as Squares2X2IconOutline,
} from "@heroicons/react/24/outline";
import {
  BookmarkIcon as BookmarkIconSolid,
  Squares2X2Icon as Squares2X2IconSolid,
} from "@heroicons/react/24/solid";
import GridSavedBtn from "./GridSavedBtn";
import React from "react";

const gridSaveBtns = [
  {
    id: "homePageId=001",
    btnType: "OwnPostsBtn",
    solidIcon: <Squares2X2IconSolid className="w-7 h-7 fill-strokeClr" />,
    outlineIcon: (
      <Squares2X2IconOutline className="w-7 h-7 [&>path]:stroke-strokeClr" />
    ),
  },
  {
    id: "homePageIdSaved=002",
    btnType: "SavedPostsBtn",
    solidIcon: (
      <BookmarkIconSolid className="w-7 h-7 [&>path]:stroke-strokeClr fill-strokeClr" />
    ),
    outlineIcon: (
      <BookmarkIconOutline className="w-7 h-7 [&>path]:stroke-strokeClr" />
    ),
  },
];

function ProfilePagePostArea({ profileId, isUserItself }) {
  const pathName = usePathname();

  return (
    <div className="w-[90%] border-b-[1px] border-primaryHvrClr flex items-center justify-center">
      <div className="w-[40%] flex justify-around">
        {gridSaveBtns.map((btn) => (
          <GridSavedBtn
            key={btn.id}
            currentPath={pathName}
            btnBody={btn}
            profileId={profileId}
            isUserItself={isUserItself}
          />
        ))}
      </div>
    </div>
  );
}

export default ProfilePagePostArea;
