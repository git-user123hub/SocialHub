"use client";

import { useState } from "react";

function ToggleRepliesBtn({ children, cML, chsL, cmndChLvl }) {
  const [showReplies, setShowReplies] = useState(false);

  return (
    <>
      <button
        className="mb-3 text-slate-500 text-sm font-semibold"
        onClick={(e) => setShowReplies((prevSt) => !prevSt)}
        style={{
          marginLeft: `${cmndChLvl < 3 ? (cML === 0 ? cML + 32 + 12 : cML + 32) : 0}px`,
        }}
      >
        <span>——</span>{" "}
        <span>
          {showReplies ? "Hide all replies" : `Show all ${chsL} replies`}
        </span>
      </button>

      {showReplies && <>{children}</>}
    </>
  );
}

export default ToggleRepliesBtn;
