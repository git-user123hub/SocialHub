"use client";

import Link from "next/link";
import MenuBtn from "./MenuBtn";
import SidebarLinks from "./SidebarLinks";
import { useEffect, useRef, useState } from "react";
import { useMainContext } from "./MainContext";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Logo from "./Logo";
import { useMediaQuery } from "../hooks/useMediaQuery";

function Sidebar() {
  const isItMobile = useMediaQuery("(width <= 1023px)");
  const isItTablet = useMediaQuery("(width <= 767px)");
  const [sbExpanded, setSbExpanded] = useState(false);
  const [logoHvr, setLogoHvr] = useState(false);
  const [menuHvr, setMenuHvr] = useState(false);
  const {
    open,
    sbRef,
    menuClicked,
    setMenuClicked,
    homeHvr,
    setHomeHvr,
    menuTxtRef,
    curUser,
    messagesHvr,
    setMessagesHvr,
    profileHvr,
    setProfileHvr,
    searchHvr,
    setSearchHvr,
    searchClicked,
    setSearchClicked,
    createHvr,
    setCreateHvr,
    setCreateClicked,
    plusTxtRef,
    postBtnRef,
    createClicked,
    notificationHvr,
    setNotificationHvr,
    notificationClicked,
    setNotificationClicked,
    setIsMobile,
    setIsTablet,
  } = useMainContext();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const mLSbRef = useRef(null);
  const mRSbRef = useRef(null);

  function handleHoverEnter(e) {
    setSbExpanded(true);
  }

  function handleHoverLeave(e) {
    if (!createClicked && !menuClicked) {
      setSbExpanded(false);
    }
  }

  useEffect(() => {
    if (searchParams.get("signup") === "success") {
      const params = new URLSearchParams(searchParams.toString());

      params.delete("signup");

      const cleanUrl = params.toString()
        ? `${pathname}?${params.toString()}`
        : pathname;

      router.replace(cleanUrl);
    }
  }, [searchParams, pathname, router]);

  useEffect(() => {
    if (isItMobile) {
      setIsMobile(true);
    }

    if (!isItMobile) {
      setIsMobile(false);
    }
  }, [isItMobile, setIsMobile]);

  useEffect(() => {
    if (isItTablet) {
      setIsTablet(true);
    }

    if (!isItTablet) {
      setIsTablet(false);
    }
  }, [isItTablet, setIsTablet]);

  return (
    <div
      ref={sbRef}
      id="sidebar-id"
      className={`flex text-xl h-max justify-between fixed left-0 right-0 bottom-0 z-[1000] bg-mainClr shrink-0 lg:w-max lg:h-dvh lg:top-0 lg:left-0 lg:shrink`}
      onMouseEnter={open ? undefined : handleHoverEnter}
      onMouseLeave={open ? undefined : handleHoverLeave}
    >
      <div
        ref={mLSbRef}
        className="w-full flex justify-between h-max pt-1 pb-1 text-xl lg:w-auto lg:h-full lg:pt-5 lg:pb-5 lg:pl-3 lg:flex-col"
      >
        {isItMobile && (
          <div
            className={`shrink-0 ${logoHvr ? "bg-hoverClr" : ""} fixed top-0 left-1/2 -translate-x-1/2 w-full flex justify-center items-center bg-mainClr ${!curUser ? "pointer-events-none" : ""}`}
          >
            <Link
              href="/"
              className="shrink-0 flex items-center px-2 py-2 text-strokeClr"
              onMouseEnter={(e) => setLogoHvr(true)}
              onMouseLeave={(e) => setLogoHvr(false)}
              onClick={(e) => {
                if (!curUser) {
                  e.preventDefault();
                }
              }}
            >
              <div>SocialHub</div>
            </Link>
          </div>
        )}

        {!isItMobile && (
          <Link
            href="/"
            className={`hidden lg:inline rounded-md ${logoHvr ? "bg-hoverClr" : ""} ${!curUser ? "pointer-events-none" : ""}`}
            onMouseEnter={(e) => setLogoHvr(true)}
            onMouseLeave={(e) => setLogoHvr(false)}
            onClick={(e) => {
              if (!curUser) {
                e.preventDefault();
              }
            }}
          >
            <div className="shrink-0 flex items-center px-2 py-2 text-strokeClr">
              <Logo />
            </div>
          </Link>
        )}

        <SidebarLinks sbExpanded={sbExpanded} setSbExpanded={setSbExpanded} />
        <MenuBtn
          sbExpanded={sbExpanded}
          setSbExpanded={setSbExpanded}
          menuHvr={menuHvr}
          setMenuHvr={setMenuHvr}
        />
      </div>

      <div
        ref={mRSbRef}
        className={`hidden lg:relative lg:flex lg:flex-col lg:justify-between lg:h-full lg:pt-5 lg:pb-5 lg:text-[15px] lg:transition-all lg:duration-200 lg:ease-in-out lg:overflow-hidden lg:whitespace-nowrap ${sbExpanded ? "lg:w-[170px] lg:opacity-100 lg:translate-x-0 lg:pointer-events-auto lg:pr-3 lg:left-0" : "lg:w-0 lg:opacity-0 lg:-translate-x-4 lg:pointer-events-none lg:overflow-hidden lg:pr-0 lg:left-[9px]"}`}
      >
        <div className="w-[44px] h-[44px] min-h-[44px] shrink-0"></div>

        <div>
          <div className="flex flex-col justify-evenly relative gap-2">
            <Link
              href="/"
              tabIndex={!curUser ? -1 : 0}
              prefetch={false}
              className={`pl-1 py-2 h-11 flex items-center ${homeHvr ? "bg-hoverClr" : ""} rounded-tr-md rounded-br-md`}
              onMouseEnter={(e) => setHomeHvr(true)}
              onMouseLeave={(e) => setHomeHvr(false)}
              onClick={(e) => {
                if (!curUser) {
                  e.preventDefault();
                }
              }}
            >
              <span
                className={`${pathname === "/" ? "font-semibold" : ""} text-strokeClr`}
              >
                Home
              </span>
            </Link>

            <Link
              href="/messages"
              tabIndex={!curUser ? -1 : 0}
              prefetch={false}
              className={`pl-1 py-2 h-11 flex items-center ${messagesHvr ? "bg-hoverClr" : ""} rounded-tr-md rounded-br-md`}
              onMouseEnter={(e) => setMessagesHvr(true)}
              onMouseLeave={(e) => setMessagesHvr(false)}
              onClick={(e) => {
                if (!curUser) {
                  e.preventDefault();
                }
              }}
            >
              <span
                className={`${pathname === "/messages" ? "font-semibold" : ""} text-strokeClr`}
              >
                messages
              </span>
            </Link>

            <div
              onClick={() => setSearchClicked((curSt) => !curSt)}
              onMouseEnter={(e) => setSearchHvr(true)}
              onMouseLeave={(e) => setSearchHvr(false)}
              className={`pl-1 py-2 h-11 flex items-center ${searchHvr ? "bg-hoverClr" : ""} rounded-tr-md rounded-br-md cursor-pointer`}
            >
              <span
                className={`${searchClicked ? "font-semibold" : ""} text-strokeClr`}
              >
                Search
              </span>
            </div>

            <div
              onClick={() => setNotificationClicked((curSt) => !curSt)}
              onMouseEnter={(e) => setNotificationHvr(true)}
              onMouseLeave={(e) => setNotificationHvr(false)}
              className={`pl-1 py-2 h-11 flex items-center ${notificationHvr ? "bg-hoverClr" : ""} rounded-tr-md rounded-br-md cursor-pointer`}
            >
              <span
                className={`${notificationClicked ? "font-semibold" : ""} text-strokeClr`}
              >
                Notifications
              </span>
            </div>

            <div
              ref={plusTxtRef}
              className={`pl-1 py-2 h-11 flex items-center ${createHvr ? "bg-hoverClr" : ""} rounded-tr-md rounded-br-md cursor-pointer text-strokeClr`}
              onMouseEnter={(e) => {
                if (!postBtnRef?.current?.contains(e.target)) {
                  setCreateHvr(true);
                }
              }}
              onMouseLeave={(e) => setCreateHvr(false)}
              onClick={(e) => {
                e.preventDefault();
                setCreateClicked((c) => !c);
              }}
            >
              <span>Create</span>
            </div>

            <Link
              href={`/user/${curUser?.id}`}
              tabIndex={!curUser ? -1 : 0}
              prefetch={false}
              className={`pl-1 py-2 h-11 flex items-center ${profileHvr ? "bg-hoverClr" : ""} text-strokeClr rounded-tr-md rounded-br-md`}
              onMouseEnter={(e) => setProfileHvr(true)}
              onMouseLeave={(e) => setProfileHvr(false)}
              onClick={(e) => {
                if (!curUser) {
                  e.preventDefault();
                }
              }}
            >
              <span
                className={`${
                  pathname === `/user/${curUser?.id}` ||
                  pathname === `/user/${curUser?.id}/saved`
                    ? "font-semibold"
                    : ""
                }`}
              >
                Profile
              </span>
            </Link>
          </div>
        </div>

        <div
          ref={menuTxtRef}
          tabIndex={!curUser ? -1 : 0}
          className={`pl-1 py-2 h-11 flex items-center ${menuHvr ? "bg-hoverClr" : ""} cursor-pointer rounded-tr-md rounded-br-md`}
          onClick={() => {
            if (!curUser) {
              e.preventDefault();
            }
            setMenuClicked((curSt) => !curSt);
          }}
          onMouseEnter={(e) => setMenuHvr(true)}
          onMouseLeave={(e) => setMenuHvr(false)}
        >
          <span
            className={`${menuClicked ? "font-semibold" : ""} text-strokeClr`}
          >
            Menu
          </span>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
