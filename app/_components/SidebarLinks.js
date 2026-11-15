"use client";

import {
  HomeIcon as HomeIconSolid,
  ChatBubbleBottomCenterTextIcon as ChatBubbleBottomCenterTextIconSolid,
} from "@heroicons/react/20/solid";
import {
  ChatBubbleBottomCenterTextIcon as ChatBubbleBottomCenterTextIconOutline,
  HomeIcon as HomeIconOutline,
  UserIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SidebarSearchBtn from "./SidebarSearchBtn";
import SidebarPlusBtn from "./SidebarPlusBtn";
import { useMainContext } from "./MainContext";
import Image from "next/image";
import SidebarNotificationBtn from "./SidebarNotificationBtn";

function SidebarLinks({ sbExpanded, setSbExpanded }) {
  const {
    curUser,
    curUsrPro,
    homeHvr,
    setHomeHvr,
    messagesHvr,
    setMessagesHvr,
    profileHvr,
    setProfileHvr,
  } = useMainContext();

  const pathname = usePathname();

  return (
    <div className="w-full lg:w-auto">
      <div className="w-full flex justify-evenly relative gap-2 lg:w-auto lg:flex-col">
        <Link
          href="/"
          tabIndex={!curUser ? -1 : 0}
          prefetch={false}
          className={`${homeHvr ? "bg-hoverClr" : ""} rounded-md ${!curUser ? "pointer-events-none" : ""} lg:rounded-tr-none lg:rounded-br-none`}
          onMouseEnter={(e) => {
            const supportsHover = window.matchMedia("(hover: hover)").matches;

            if (supportsHover) {
              setHomeHvr(true);
            }
          }}
          onMouseLeave={(e) => setHomeHvr(false)}
          onClick={(e) => {
            if (!curUser) {
              e.preventDefault();
            }
          }}
        >
          <div className={`flex items-center px-2 py-2 container`}>
            <div>
              {pathname === "/" ? (
                <HomeIconSolid className="w-7 h-7 [&>path]:stroke-strokeClr fill-strokeClr" />
              ) : (
                <HomeIconOutline className="w-7 h-7 [&>path]:stroke-strokeClr [&>path]:stroke-[1.7]" />
              )}
            </div>
          </div>
        </Link>

        <Link
          href="/messages"
          prefetch={false}
          tabIndex={!curUser ? -1 : 0}
          className={`${messagesHvr ? "bg-hoverClr" : ""} rounded-md ${!curUser ? "pointer-events-none" : ""} lg:rounded-tr-none lg:rounded-br-none`}
          onMouseEnter={(e) => {
            const supportsHover = window.matchMedia("(hover: hover)").matches;

            if (supportsHover) {
              setMessagesHvr(true);
            }
          }}
          onMouseLeave={(e) => setMessagesHvr(false)}
          onClick={(e) => {
            if (!curUser) {
              e.preventDefault();
            }
          }}
        >
          <div className="flex items-center px-2 py-2">
            <div>
              {pathname === "/messages" ? (
                <ChatBubbleBottomCenterTextIconSolid className="w-7 h-7 fill-strokeClr" />
              ) : (
                <ChatBubbleBottomCenterTextIconOutline className="w-7 h-7 [&>path]:stroke-strokeClr [&>path]:stroke-[1.7]" />
              )}
            </div>
          </div>
        </Link>

        <SidebarSearchBtn
          sbExpanded={sbExpanded}
          setSbExpanded={setSbExpanded}
        />

        <SidebarNotificationBtn
          sbExpanded={sbExpanded}
          setSbExpanded={setSbExpanded}
        />

        <SidebarPlusBtn sbExpanded={sbExpanded} setSbExpanded={setSbExpanded} />

        <Link
          href={curUser ? `/user/${curUser?.id}` : ""}
          tabIndex={!curUser ? -1 : 0}
          prefetch={false}
          className={`rounded-md ${!curUser ? "pointer-events-none" : ""} ${profileHvr ? "bg-hoverClr" : ""} lg:rounded-tr-none lg:rounded-br-none`}
          onMouseEnter={(e) => {
            const supportsHover = window.matchMedia("(hover: hover)").matches;

            if (supportsHover) {
              setProfileHvr(true);
            }
          }}
          onMouseLeave={(e) => setProfileHvr(false)}
          onClick={(e) => {
            if (!curUser) {
              e.preventDefault();
            }
          }}
        >
          <div className="flex items-center px-2 py-2">
            <div>
              <div
                className={`w-[28px] h-[28px] rounded-full relative flex justify-center items-center overflow-hidden ${
                  pathname === `/user/${curUser?.id}` ||
                  pathname === `/user/${curUser?.id}/saved`
                    ? "border-[2px] border-strokeClr"
                    : ""
                } bg-slate-300`}
              >
                {curUser?.id ? (
                  <>
                    {curUsrPro?.avatar ? (
                      <Image
                        src={curUsrPro.avatar}
                        alt="avatar image"
                        fill
                        sizes="468px"
                        className={`rounded-md object-cover`}
                        quality={100}
                        priority
                      />
                    ) : (
                      <UserIcon className="w-[16px] h-[16px] [&>path]:stroke-[0.5] [&>path]:stroke-globalBlack" />
                    )}
                  </>
                ) : (
                  <UserIcon className="w-[16px] h-[16px] [&>path]:stroke-[0.5] [&>path]:stroke-globalBlack" />
                )}
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default SidebarLinks;
