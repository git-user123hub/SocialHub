import {
  MagnifyingGlassIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { XCircleIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { getProfileThrSearch } from "../_lib/inClient-services";
import { useMainContext } from "./MainContext";

function SearchBar({
  setSearchClicked,
  listenCapturing = true,
  sdSearchBtnRef,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedProfiles, setSearchedProfiles] = useState([]);
  const { isDarkTrue } = useMainContext();
  const [containerHeight, setContainerHeight] = useState("171px");

  const ref = useRef(null);
  const closeRef = useRef(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (
        ref.current &&
        !ref.current.contains(e.target) &&
        !closeRef.current.contains(e.target) &&
        !sdSearchBtnRef.current.contains(e.target)
      ) {
        setSearchClicked(false);
      }
    }

    document.addEventListener("click", handleClick, listenCapturing);

    return () =>
      document.removeEventListener("click", handleClick, listenCapturing);
  }, [sdSearchBtnRef, setSearchClicked, listenCapturing]);

  useEffect(() => {
    async function getQueries() {
      const { dataWithFollowers } = await getProfileThrSearch(searchQuery);

      if (dataWithFollowers?.length > 0) {
        setSearchedProfiles(dataWithFollowers);
      }
    }

    if (searchQuery.length > 0) {
      getQueries();
    }
  }, [searchQuery]);

  useLayoutEffect(() => {
    if (resultsRef?.current) {
      const topOffset = resultsRef.current.getBoundingClientRect().top;
      const availableHeight = window.innerHeight - topOffset;

      setContainerHeight(`${availableHeight}px`);
    }
  }, []);

  return createPortal(
    <div
      ref={ref}
      id="searchBarIdForScroll"
      className={`fixed top-0 left-0 w-full md:w-[500px] h-dvh bg-mainClr text-strokeClr border-primaryHvrClr ${isDarkTrue ? "border-r-[1px]" : "border-r-[1px]"} z-[4000]`}
    >
      <div className="relative w-full h-full flex flex-col">
        <div>
          <div className="px-8 py-10">
            <p className="text-2xl font-semibold capitalize">search</p>
          </div>
          <div className="px-7 relative">
            <input
              id="searchField"
              type="text"
              className="rounded-full w-full bg-lightBg h-12 pl-11 placeholder:text-lg outline-none"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
            />
            <MagnifyingGlassIcon className="w-5 h-5 [&>path]:stroke-[1.7] stroke-slate-400 absolute  top-[50%] left-11 translate-y-[-50%]" />
            <button
              className="absolute  top-[50%] right-11 translate-y-[-50%]"
              onClick={(e) => {
                setSearchQuery("");
                setSearchedProfiles([]);
              }}
            >
              <XCircleIcon className="w-5 h-5 [&>path]:stroke-[1.7] [&>path]:fill-slate-400/55" />
            </button>
          </div>
          <button
            className="absolute right-3 top-3 cursor-pointer"
            ref={closeRef}
            onClick={(e) => {
              setSearchClicked(false);
            }}
          >
            <XMarkIcon className="w-5 h-5 [&>path]:stroke-[1.7]" />
          </button>
        </div>
        <div
          ref={resultsRef}
          className="flex flex-grow px-6 py-5"
          style={{ height: containerHeight }}
        >
          <div className="flex flex-col flex-grow">
            <p className="font-semibold">
              Searches ({searchedProfiles?.length})
            </p>

            {searchedProfiles?.length > 0 ? (
              <div style={{ scrollbarWidth: "none", overflowY: "scroll" }}>
                {searchedProfiles?.map((profile) => (
                  <Link
                    key={profile.id}
                    href={`/user/${profile?.id}`}
                    className="flex items-center gap-4 p-3 hover:bg-hoverClr hover:rounded-md"
                    onClick={() => setSearchClicked((c) => !c)}
                  >
                    <div className="w-[42px] h-[42px] rounded-full relative flex justify-center items-center overflow-hidden bg-[#d4d4d4]">
                      {profile?.avatar ? (
                        <Image
                          src={profile?.avatar}
                          alt="article photo"
                          fill
                          sizes="468px"
                          className="rounded-md object-fill"
                          quality={100}
                          priority
                        />
                      ) : (
                        <UserIcon className="w-[50%] h-[50%] [&>path]:stroke-slate-700 [&>path]:stroke-[1.5]" />
                      )}
                    </div>

                    <div className="flex-grow self-start min-[500px]:self-auto">
                      <p className="text-sm font-semibold text-strokeClr">
                        {profile?.username}
                      </p>
                      <div className="text-sm capitalize flex gap-1 text-textPryClr">
                        <span>{profile?.fullname}</span>
                        <span className="hidden min-[500px]:inline relative">
                          <p className="absolute top-[-50%] font-semibold text-xl">
                            .
                          </p>
                        </span>
                        <span className="hidden min-[500px]:inline ml-1">
                          {profile?.followers} followers
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col flex-grow px-2">
                <div className="w-full px-7 flex justify-center items-center flex-grow">
                  <p className="font-semibold text-sm text-slate-400">
                    Not searched yet
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default SearchBar;
