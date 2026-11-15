"use client";

import { useState } from "react";

function DescExpander({ description }) {
  const [expand, setExpand] = useState(false);

  let sliceDesc;

  if (description.length > 0) {
    sliceDesc = description.slice(0, 100);
  }

  return (
    <span>
      <span className="text-strokeClr supports-[overflow-wrap:anywhere]:[overflow-wrap:anywhere] supports-[not(overflow-wrap:anywhere)]:[word-break:normal]">
        {expand ? description : sliceDesc}
      </span>
      {description.length >= 100 && (
        <>
          {!expand && <span className="text-strokeClr">...</span>}
          <button
            className={`text-textPryClr ${expand ? "ml-1" : ""} hover:underline underline-offset-1`}
            onClick={() => setExpand((exp) => !exp)}
          >
            {!expand ? "more" : "less"}
          </button>
        </>
      )}
    </span>
  );
}

export default DescExpander;
