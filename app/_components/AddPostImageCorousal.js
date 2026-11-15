"use client";

import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import { useEffect, useState } from "react";

function AddPostImageCorousal({
  expandIt,
  miniPreview,
  pIndex,
  setPIndex,
  middleRmv,
}) {
  const [imgSrc, setImgSrc] = useState("");

  useEffect(() => {
    if (miniPreview?.at(pIndex)) {
      setImgSrc(URL.createObjectURL(miniPreview?.at(pIndex)?.imgOrgFile));
    }

    if (!miniPreview?.at(pIndex)) {
      if (miniPreview?.length === pIndex) {
        const mPrevwLength = miniPreview?.length;
        setPIndex(mPrevwLength - 1);
        setImgSrc(
          URL.createObjectURL(miniPreview?.at(mPrevwLength - 1)?.imgOrgFile),
        );
      }
    }
  }, [miniPreview, pIndex, setPIndex, middleRmv]);

  if (miniPreview && miniPreview?.length <= 0) return;

  function handleLeft(e) {
    e.preventDefault();
    if (pIndex > 0) {
      setPIndex((prevIndex) => prevIndex - 1);
    }
  }

  function handleRight(e) {
    e.preventDefault();
    if (pIndex + 1 < miniPreview?.length) {
      setPIndex((prevIndex) => prevIndex + 1);
    }
  }

  return (
    <div
      className={`flex relative ${expandIt ? "justify-self-start border-r-[1px] border-postIniBdrBtm" : "justify-self-center"} w-[348px] h-[348px] md:w-[398px] md:h-[398px] lg:w-[748px] lg:h-[748px] shrink-0`}
    >
      <div
        className={`w-full h-full flex justify-center items-center relative`}
      >
        {miniPreview && miniPreview?.length > 0 && imgSrc !== "" && (
          <Image
            src={imgSrc}
            fill
            quality={100}
            className={`object-cover`}
            alt="Mountains and forests with two cabins"
            onLoad={(e) => URL.revokeObjectURL(e.target.src)}
          />
        )}
      </div>

      {miniPreview?.length > 1 && (
        <>
          {pIndex > 0 && (
            <button
              className="absolute top-1/2 -translate-y-1/2 left-1"
              onClick={handleLeft}
            >
              <ArrowLeftCircleIcon className="w-7 h-7 fill-white [&>path]:stroke-[1.3]" />
            </button>
          )}
          {pIndex + 1 !== miniPreview?.length && (
            <button
              className="absolute top-1/2 -translate-y-1/2 right-1"
              onClick={handleRight}
            >
              <ArrowRightCircleIcon className="w-7 h-7 fill-white [&>path]:stroke-[1.3]" />
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default AddPostImageCorousal;
