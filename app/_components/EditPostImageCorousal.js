"use client";

import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import { useState } from "react";

function EditPostImageCorousal({ imagesArr }) {
  const [pIndex, setPIndex] = useState(0);

  if (imagesArr && imagesArr?.length <= 0) return;

  function handleLeft(e) {
    e.preventDefault();
    if (pIndex > 0) {
      setPIndex((prevIndex) => prevIndex - 1);
    }
  }

  function handleRight(e) {
    e.preventDefault();
    if (pIndex + 1 < imagesArr?.length) {
      setPIndex((prevIndex) => prevIndex + 1);
    }
  }

  return (
    <div
      className={`flex relative justify-self-start border-r-[1px] border-postIniBdrBtm w-hStretch h-full sm:h-auto`}
      style={{ width: "-webkit-fill-available" }}
    >
      <div
        className={`w-full h-full flex justify-center items-center relative`}
      >
        {imagesArr?.length > 0 && (
          <>
            {imagesArr?.map((anImg, index) => {
              return (
                <Image
                  key={index}
                  src={anImg}
                  alt="article photo"
                  width={1200}
                  height={1200}
                  sizes="1080px"
                  className={`object-cover absolute inset-0 w-full h-full transition-all duration-500 ease-in-out ${
                    pIndex === index
                      ? "opacity-100 visible scale-100"
                      : "opacity-0 invisible scale-95"
                  }`}
                  quality={100}
                  priority
                />
              );
            })}
          </>
        )}
      </div>

      {imagesArr?.length > 1 && (
        <>
          {pIndex > 0 && (
            <button
              className="absolute top-1/2 -translate-y-1/2 left-1"
              onClick={handleLeft}
            >
              <ArrowLeftCircleIcon className="w-7 h-7 fill-white [&>path]:stroke-[1.3]" />
            </button>
          )}
          {pIndex + 1 !== imagesArr?.length && (
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

export default EditPostImageCorousal;
