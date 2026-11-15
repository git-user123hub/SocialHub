"use client";

import { formatDistance } from "date-fns";
import { useEffect, useState } from "react";

const customDistancePhrases = {
  lessThanXSeconds: "just now",
  xSeconds: "{{count}}s",
  halfAMinute: "30s",
  lessThanXMinutes: "1m",
  xMinutes: "{{count}}m",
  aboutXHours: "{{count}}h",
  xHours: "{{count}}h",
  xDays: "{{count}}d",
  aboutXMonths: "{{count}}mo",
  xMonths: "{{count}}mo",
  aboutXYears: "{{count}}y",
  xYears: "{{count}}y",
  overXYears: "{{count}}y+",
  almostXYears: "{{count}}y",
};

const customLocale = {
  formatDistance: (token, count, options) => {
    let formattedString = customDistancePhrases[token] || "";

    if (token === "xDays") {
      if (count >= 7 && count < 30) {
        const weeks = Math.round(count / 7);
        formattedString = `${weeks}w`;
      } else {
        formattedString = `${count}d`;
      }
    } else if (count !== undefined) {
      formattedString = formattedString.replace("{{count}}", String(count));
    }

    if (options?.addSuffix) {
      if (options.comparison && options.comparison < 0) {
        return `in ${formattedString}`;
      }
      return `${formattedString} ago`;
    }

    return formattedString;
  },
};

function CreationTime({ timesAgo, postLcl }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <span></span>;

  if (!timesAgo) {
    return <span className="text-sm text-textPryClr">--</span>;
  }

  const dateToCompare = new Date(timesAgo);
  if (isNaN(dateToCompare.getTime())) {
    return <span className="text-sm text-textPryClr">Invalid date</span>;
  }

  let finalResult = "";

  if (postLcl === "singlePost") {
    finalResult = formatDistance(new Date(), dateToCompare, {
      includeSeconds: true,
      addSuffix: true,
      locale: customLocale,
    });
  }

  if (postLcl === "articlePost") {
    finalResult = formatDistance(new Date(), dateToCompare, {
      includeSeconds: true,
      locale: customLocale,
    });
  }

  return <span className="text-sm text-textPryClr">{finalResult}</span>;
}

export default CreationTime;
