"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { createClient } from "../_lib/supabase/client";

const MainContext = createContext();

const supabase = createClient();

function MainContextProvider({
  children,
  initialUser,
  initialProfile,
  initialDarkStatus,
}) {
  const [curUser, setCurUser] = useState(initialUser);
  const [gblRefresh, setGlbRefresh] = useState(false);
  const [open, setOpen] = useState(false);
  const [curUsrPro, setCurUserPro] = useState(initialProfile);
  const [isDark, setIsDark] = useState(false);
  const [isDarkTrue, setIsDarkTrue] = useState(
    initialDarkStatus?.dark_status ?? false,
  );
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [historyRoutes, setHistoryRoutes] = useState([]);
  const [aboutEditPost, setAboutEditPost] = useState(false);
  const [isClickedOnReply, setIsClickedOnReply] = useState(false);
  const [isMiniModalOpened, setIsMiniModalOpened] = useState(false);
  const [menuClicked, setMenuClicked] = useState(false);
  const [searchClicked, setSearchClicked] = useState(false);
  const [createClicked, setCreateClicked] = useState(false);
  const [homeHvr, setHomeHvr] = useState(false);
  const [isCmtSectOpen, setIsCmtSectOpen] = useState(false);

  const [notificationHvr, setNotificationHvr] = useState(false);
  const [notificationClicked, setNotificationClicked] = useState(false);

  const [messagesHvr, setMessagesHvr] = useState(false);
  const [searchHvr, setSearchHvr] = useState(false);
  const [createHvr, setCreateHvr] = useState(false);
  const [profileHvr, setProfileHvr] = useState(false);
  const [articlePostId, setArticlePostId] = useState("");
  const [mobileCmntPostId, setMobileCmntPostId] = useState(null);
  const [delCmnBtnRefForCmntsPopUp, setDelCmnBtnRefForCmntsPopUp] =
    useState(null);
  const [replyFocus, setReplyFocus] = useState(null);

  const aPMRef = useRef(null);
  const sbRef = useRef(null);
  const menuBtnRef = useRef(null);
  const menuTxtRef = useRef(null);
  const plusBtnRef = useRef(null);
  const plusTxtRef = useRef(null);
  const postBtnRef = useRef(null);
  const allRefs = useRef([]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setCurUser(session.user);

        if (event === "USER_UPDATED" || event === "SIGNED_IN") {
          const {
            data: { user },
            error,
          } = await supabase.auth.getUser();

          if (user && !error) {
            let { data: user_profile } = await supabase
              .from("user_profile")
              .select("*")
              .eq("id", user.id)
              .maybeSingle();

            if (user_profile) setCurUserPro(user_profile);
          }
        }
      } else {
        setCurUser(null);
        setCurUserPro(null);
        if (
          event === "SIGNED_OUT" &&
          window.location.pathname.startsWith("/")
        ) {
          router.push("/auth/login");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (initialDarkStatus?.dark_status === isDark?.dark_status) return;

    if (initialDarkStatus) {
      setIsDark(initialDarkStatus);
    }

    if (initialDarkStatus?.dark_status) {
      setIsDarkTrue(true);
    }

    if (!initialDarkStatus?.dark_status) {
      setIsDarkTrue(false);
    }
  }, [initialDarkStatus, isDark?.dark_status]);

  useEffect(() => {
    if (
      initialProfile?.avatar === curUsrPro?.avatar &&
      initialProfile?.bio === curUsrPro?.bio &&
      initialProfile?.birthday === curUsrPro?.birthday &&
      initialProfile?.created_at === curUsrPro?.created_at &&
      initialProfile?.fullname === curUsrPro?.fullname &&
      initialProfile?.gender === curUsrPro?.gender &&
      initialProfile?.username === curUsrPro?.username
    )
      return;

    setCurUserPro(initialProfile);
  }, [initialProfile, curUsrPro]);

  return (
    <MainContext.Provider
      value={{
        aPMRef,
        sbRef,
        isDark,
        isDarkTrue,
        setIsDark,
        historyRoutes,
        setHistoryRoutes,
        allRefs,
        open,
        setOpen,
        mobileCmntPostId,
        setMobileCmntPostId,
        curUser,
        aboutEditPost,
        setAboutEditPost,
        isClickedOnReply,
        isMobile,
        setIsMobile,
        isTablet,
        setIsTablet,
        isCmtSectOpen,
        setIsCmtSectOpen,
        setIsClickedOnReply,
        replyFocus,
        setReplyFocus,
        gblRefresh,
        setGlbRefresh,
        curUsrPro,
        setCurUserPro,
        isMiniModalOpened,
        setIsMiniModalOpened,
        menuClicked,
        setMenuClicked,
        searchClicked,
        setSearchClicked,
        homeHvr,
        setHomeHvr,
        messagesHvr,
        setMessagesHvr,
        searchHvr,
        setSearchHvr,
        createHvr,
        setCreateHvr,
        profileHvr,
        setProfileHvr,
        menuBtnRef,
        menuTxtRef,
        createClicked,
        setCreateClicked,
        plusBtnRef,
        plusTxtRef,
        postBtnRef,
        articlePostId,
        setArticlePostId,
        notificationHvr,
        setNotificationHvr,
        notificationClicked,
        setNotificationClicked,
        delCmnBtnRefForCmntsPopUp,
        setDelCmnBtnRefForCmntsPopUp,
      }}
    >
      {children}
    </MainContext.Provider>
  );
}

function useMainContext() {
  const context = useContext(MainContext);
  if (context === undefined)
    throw new Error("Context was used outside the provider");
  return context;
}

export { MainContextProvider, useMainContext };
