"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  memo,
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useMainContext } from "./MainContext";
import { createClient } from "../_lib/supabase/client";
import NotificationsWrapper from "./NotificationsWrapper";
import { formatDistance } from "date-fns";
import Spinner from "./Spinner";

const supabase = createClient();

function checkWeek(cmprDate) {
  let result;

  const customDistancePhrases = {
    lessThanXSeconds: "7days",
    xSeconds: "7days",
    halfAMinute: "7days",
    lessThanXMinutes: "7days",
    xMinutes: "7days",
    aboutXHours: "7days",
    xHours: "7days",
  };

  const customLocale = {
    formatDistance: (token, count, options) => {
      let result = customDistancePhrases[token];

      if (token === "xDays") {
        if (count >= 7 && count < 30) {
          result = `15days`;
        } else {
          result = `7days`;
        }
      }

      return result;
    },
  };

  result = formatDistance(new Date(), cmprDate, {
    locale: customLocale,
  });

  return result;
}

const NotificationsBar = memo(function NotificationsBar({
  setNotificationClicked,
  listenCapturing = true,
  setIsAnyNotify,
  setNewNotifi,
  sdNotifiBtnRef,
}) {
  const { curUser, isDarkTrue } = useMainContext();
  const [sortedArr, setSortedArr] = useState([]);

  const [filterBtn, setFilterBtn] = useState("all");
  const [containerHeight, setContainerHeight] = useState("400px");
  const [isLoading, setIsLoading] = useState(false);

  const ref = useRef(null);
  const closeRef = useRef(null);
  const notifyRef = useRef(null);
  const observerRef = useRef(null);
  const unReadIds = useRef([]);

  useEffect(() => {
    function handleClick(e) {
      if (
        ref.current &&
        !ref.current.contains(e.target) &&
        !closeRef.current.contains(e.target) &&
        !sdNotifiBtnRef.current.contains(e.target)
      ) {
        setNotificationClicked(false);
      }
    }

    document.addEventListener("click", handleClick, listenCapturing);

    return () =>
      document.removeEventListener("click", handleClick, listenCapturing);
  }, [sdNotifiBtnRef, setNotificationClicked, listenCapturing]);

  useEffect(() => {
    async function results() {
      setIsLoading(true);
      const { data } = await supabase
        .from("notifications_sys")
        .select("*")
        .eq("user_itself", curUser?.id)
        .order("created_at", { ascending: false });

      if (data.length > 0) {
        const sortedData = data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at),
        );

        setSortedArr(sortedData);

        const filterD = data?.filter((dArr) => dArr.is_read === false);

        if (filterD?.length === 0) {
          setNewNotifi(false);
          setIsAnyNotify(false);
        }
      }
      setIsLoading(false);
    }

    if (curUser?.id) {
      results();
    }
  }, [curUser?.id, setNewNotifi, setIsAnyNotify]);

  useEffect(() => {
    if (!notifyRef.current) return;

    const options = {
      root: notifyRef.current,
      rootMargin: "0px",
      threshold: 1.0,
    };

    const callback = async (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        if (entry.isIntersecting) {
          const notifyId = entry.target.dataset.notifyobjid;
          const notifyRead = entry.target.dataset.notifyobjread === "true";
          observer.unobserve(entry.target);

          if (!notifyRead) {
            unReadIds.current.push(notifyId);
          }
        }
      });

      if (unReadIds?.current?.length > 0) {
        let allIds = unReadIds?.current;
        unReadIds.current = [];

        const { data, error } = await supabase
          .from("notifications_sys")
          .update({ is_read: true })
          .in("id", allIds)
          .select("id");

        if (data?.length > 0) {
          const filteredData = data?.map((sId) => sId.id);

          setSortedArr((prevArr) => {
            return prevArr?.map((pArr) => {
              if (filteredData?.includes(pArr?.id)) {
                return { ...pArr, is_read: true };
              }
              return pArr;
            });
          });
        }

        if (data?.length === allIds?.length) {
          setNewNotifi(false);
          setIsAnyNotify(false);
        }
      }
    };

    observerRef.current = new IntersectionObserver(callback, options);

    // Cleanup observer when parent unmounts
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [setNewNotifi, setIsAnyNotify]);

  async function handleAllRead(e) {
    e.stopPropagation();

    if (sortedArr?.length > 0) {
      const filteredIds = sortedArr?.filter((arr) => {
        return arr?.is_read !== true;
      });

      if (filteredIds?.length > 0) {
        const unReadIds = filteredIds?.map((idObj) => idObj.id);

        if (unReadIds?.length > 0) {
          const { data, error } = await supabase
            .from("notifications_sys")
            .update({ is_read: true })
            .in("id", unReadIds)
            .select("id");

          if (data?.length > 0) {
            const filteredData = data?.map((sId) => sId.id);

            setSortedArr((prevArr) => {
              return prevArr?.map((pArr) => {
                if (filteredData?.includes(pArr?.id)) {
                  return { ...pArr, is_read: true };
                }
                return pArr;
              });
            });
          }

          if (data?.length === unReadIds?.length) {
            setNewNotifi(false);
            setIsAnyNotify(false);
          }
        }
      }
    }
  }

  const handleObserveChild = useCallback((node) => {
    if (!observerRef.current) return;

    if (node) {
      observerRef.current.observe(node);
    } else {
    }
  }, []);

  useLayoutEffect(() => {
    if (notifyRef.current) {
      const topOffset = notifyRef.current.getBoundingClientRect().top;
      const availableHeight = window.innerHeight - topOffset;

      setContainerHeight(`${availableHeight}px`);
    }
  }, []);

  const curWeekArr =
    sortedArr?.length > 0
      ? sortedArr?.filter((arr) => checkWeek(arr?.created_at) === "7days")
      : [];

  // 2. Filter out the items for the previous week
  const prevWeekArr =
    sortedArr?.length > 0
      ? sortedArr?.filter((arr) => checkWeek(arr?.created_at) === "15days")
      : [];

  return createPortal(
    <div
      ref={ref}
      className={`fixed top-0 left-0 w-full md:w-[500px] h-dvh bg-mainClr text-strokeClr border-primaryHvrClr ${isDarkTrue ? "border-r-[1px]" : "border-r-[1px]"} z-[4000]`}
    >
      <div className="relative w-full h-full flex flex-col">
        <div className="w-full h-full">
          <div className="px-[7px] md:px-7 flex flex-col h-full overflow-auto">
            <div className="px-5 py-10 flex flex-col gap-4">
              <p className="text-2xl font-semibold capitalize">Notifications</p>
              <div
                className="flex items-center gap-2 ml-[-13px]"
                style={{ overflow: "scroll", scrollbarWidth: "none" }}
              >
                <button
                  className={`text-[12px] font-semibold px-4 py-2 border-[1px] border-primaryHvrClr rounded-3xl shrink-0  ${filterBtn === "all" ? "bg-primaryHvrClr hover:bg-[#a0a0a066]" : "hover:bg-primaryClr"}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setFilterBtn("all");
                  }}
                >
                  All
                </button>
                <button
                  className={`text-[12px] font-semibold px-4 py-2 border-[1px] border-primaryHvrClr rounded-3xl shrink-0  ${filterBtn === "follows" ? "bg-primaryHvrClr hover:bg-[#a0a0a066]" : "hover:bg-primaryClr"}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setFilterBtn("follows");
                  }}
                >
                  follows
                </button>
                <button
                  className={`text-[12px] font-semibold px-4 py-2 border-[1px] border-primaryHvrClr rounded-3xl shrink-0  ${filterBtn === "postLikes" ? "bg-primaryHvrClr hover:bg-[#a0a0a066]" : "hover:bg-primaryClr"}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setFilterBtn("postLikes");
                  }}
                >
                  postLikes
                </button>
                <button
                  className={`text-[12px] font-semibold px-4 py-2 border-[1px] border-primaryHvrClr rounded-3xl shrink-0  ${filterBtn === "comments" ? "bg-primaryHvrClr hover:bg-[#a0a0a066]" : "hover:bg-primaryClr"}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setFilterBtn("comments");
                  }}
                >
                  comments
                </button>

                <button
                  className={`text-[12px] font-semibold px-4 py-2 border-[1px] border-primaryHvrClr rounded-3xl shrink-0 hover:bg-primaryClr`}
                  onClick={handleAllRead}
                >
                  Mark all as read
                </button>
              </div>
            </div>

            <div
              ref={notifyRef}
              style={{
                height: containerHeight,
                overflowY: "auto",
                position: "relative",
                scrollbarWidth: "none",
              }}
            >
              {isLoading ? (
                <div className="flex justify-center items-center h-hStretch overflow-hidden">
                  <Spinner />
                </div>
              ) : (
                <>
                  {sortedArr?.length === 0 ? (
                    <div className="flex justify-center items-center h-hStretch overflow-hidden">
                      No notifications yet
                    </div>
                  ) : (
                    sortedArr?.length > 0 && (
                      <>
                        <div className="w-full pb-5">
                          {curWeekArr?.length > 0 && (
                            <>
                              {filterBtn === "all" && (
                                <div
                                  className={`text-lg font-semibold text-strokeClr mb-4 px-5`}
                                >
                                  This week
                                </div>
                              )}

                              <Suspense fallback={null}>
                                {curWeekArr?.map((notifyObj) => (
                                  <NotificationsWrapper
                                    key={notifyObj.id}
                                    notifyObj={notifyObj}
                                    elementRef={handleObserveChild}
                                    filterBtn={filterBtn}
                                    setNotificationClicked={
                                      setNotificationClicked
                                    }
                                  />
                                ))}
                              </Suspense>
                            </>
                          )}

                          {curWeekArr?.length > 0 &&
                            prevWeekArr?.length > 0 && (
                              <div className="w-full px-5">
                                <div className="w-full border-t-[1px] border-t-primaryHvrClr mt-4"></div>
                              </div>
                            )}

                          {prevWeekArr?.length > 0 && (
                            <>
                              {filterBtn === "all" && (
                                <div
                                  className={`text-lg font-semibold text-strokeClr mb-4 px-5 ${curWeekArr?.length > 0 ? "mt-4" : ""}`}
                                >
                                  This month
                                </div>
                              )}

                              <Suspense fallback={null}>
                                {prevWeekArr?.map((notifyObj) => (
                                  <NotificationsWrapper
                                    key={notifyObj.id}
                                    notifyObj={notifyObj}
                                    elementRef={handleObserveChild}
                                    filterBtn={filterBtn}
                                    setNotificationClicked={
                                      setNotificationClicked
                                    }
                                  />
                                ))}
                              </Suspense>
                            </>
                          )}
                        </div>
                      </>
                    )
                  )}
                </>
              )}
            </div>
          </div>

          {/* 
          
          */}
          <button
            className="absolute right-3 top-3 cursor-pointer"
            ref={closeRef}
            onClick={(e) => {
              setNotificationClicked(false);
            }}
          >
            <XMarkIcon className="w-5 h-5 [&>path]:stroke-[1.7]" />
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
});

export default NotificationsBar;
