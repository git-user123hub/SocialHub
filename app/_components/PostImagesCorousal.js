"use client";

import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import { useEffect, useState } from "react";

function PostImagesCorousal({ postImages, fWType, isPostModal }) {
  const [postPhotos, setPostPhotos] = useState([]);
  const [pIndex, setPIndex] = useState(0);

  useEffect(() => {
    if (postImages?.length > 0) {
      setPostPhotos(postImages);
    }
  }, [postImages]);

  function handleLeft(e) {
    e.preventDefault();

    if (pIndex > 0) {
      setPIndex((prevIndex) => prevIndex - 1);
    }
  }

  function handleRight(e) {
    e.preventDefault();
    if (pIndex + 1 < postPhotos?.length) {
      setPIndex((prevIndex) => prevIndex + 1);
    }
  }

  if (fWType === "article") {
    return (
      <div className="relative w-full h-[468px] flex justify-center items-center border border-primaryHvrClr rounded-md">
        <div className="relative w-full h-full max-w-[468px] max-h-[468px]">
          {postPhotos?.length > 0 && (
            <>
              {postPhotos?.map((anImg, index) => {
                return (
                  <Image
                    key={index}
                    src={anImg}
                    alt="article post photo"
                    fill
                    sizes="468px"
                    className={`rounded-md absolute inset-0 object-contain transition-all duration-500 ease-in-out ${
                      pIndex === index
                        ? "opacity-100 visible scale-100"
                        : "opacity-0 invisible scale-95"
                    }`}
                    quality={100}
                    priority={index === 0}
                  />
                );
              })}
            </>
          )}
        </div>

        {postPhotos?.length > 1 && (
          <>
            {pIndex > 0 && (
              <button
                className="absolute top-1/2 -translate-y-1/2 left-1"
                onClick={handleLeft}
              >
                <ArrowLeftCircleIcon className="w-7 h-7 fill-white [&>path]:stroke-[1.3]" />
              </button>
            )}
            {pIndex + 1 !== postPhotos?.length && (
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

  if (fWType === "modalWindowPost") {
    return (
      <div
        className={`${isPostModal ? "absolute top-[61px] left-0 right-0 h-auto md:relative md:top-auto md:left-auto md:right-auto w-full md:h-full" : "absolute md:relative top-[64px] md:top-0 h-[528px] md:h-full border-t border-t-primaryHvrClr border-b border-b-primaryHvrClr md:border-none"} min-h-[300px] md:w-[500px] lg:w-[600px] flex justify-center items-center bg-mainClr`}
        style={{ width: "stretch", width: "-webkit-fill-available" }}
      >
        <div
          className={`${isPostModal ? "h-hStretch md:h-full" : "min-[767px]:h-hStretch max-[1023px]:h-hStretch"} relative w-full h-full overflow-hidden flex items-center justify-center`}
          style={{ height: "-webkit-fill-available" }}
        >
          {postPhotos?.length > 0 && (
            <>
              {postPhotos?.map((anImg, index) => {
                return (
                  <Image
                    key={index}
                    src={anImg}
                    alt="separate page post photo"
                    width={1200}
                    height={1200}
                    sizes="1080px"
                    className={`object-cover absolute inset-0 w-full h-full transition-all duration-500 ease-in-out ${
                      pIndex === index
                        ? "opacity-100 visible scale-100"
                        : "opacity-0 invisible scale-95"
                    }`}
                    quality={100}
                    priority={index === 0}
                  />
                );
              })}
            </>
          )}
        </div>

        {postPhotos?.length > 1 && (
          <>
            {pIndex > 0 && (
              <button
                className="absolute top-1/2 -translate-y-1/2 left-1"
                onClick={handleLeft}
              >
                <ArrowLeftCircleIcon className="w-7 h-7 fill-white [&>path]:stroke-[1.3]" />
              </button>
            )}
            {pIndex + 1 !== postPhotos?.length && (
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
}

export default PostImagesCorousal;
