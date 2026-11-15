"use client";

import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useMainContext } from "./MainContext";
import { toggleDark } from "../_lib/actions";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";

function ToggleDarkMode({ setSbExpanded }) {
  const { curUser, isDark, setMenuClicked } = useMainContext();

  const pathname = usePathname();

  async function handleDark(e) {
    setSbExpanded(false);
    setMenuClicked(false);

    const htmlElement = document.documentElement;

    const currentTheme = htmlElement.classList.contains("dark");

    const oldTheme = currentTheme ? "dark" : "light";
    const newTheme = currentTheme ? "light" : "dark";
    htmlElement.classList.replace(oldTheme, newTheme);

    const darkObj = {
      curPath: pathname,
    };

    if (!isDark) {
      darkObj.isFirstTime = true;
      darkObj.dark_status = true;
      darkObj.darked_by = curUser?.id;
    }

    if (isDark && !isDark?.dark_status) {
      darkObj.isFirstTime = false;
      darkObj.darkId = isDark?.id;
      darkObj.dark_status = true;
      darkObj.darked_by = curUser?.id;
    }

    if (isDark && isDark?.dark_status) {
      darkObj.isFirstTime = false;
      darkObj.darkId = isDark?.id;
      darkObj.dark_status = false;
      darkObj.darked_by = curUser?.id;
    }

    const results = await toggleDark(darkObj);

    if (results) {
      if (results.success) {
        if (oldTheme === "dark") toast.success("Light Mode Enabled");
        if (oldTheme === "light") toast.success("Dark Mode Enabled");
      }

      if (!results.success) {
        toast.error(
          "Theme update failed. Please refresh the page and try again.",
        );
        htmlElement.classList.replace(newTheme, oldTheme);
      }
    }
  }

  return (
    <button
      className="hover:rounded-lg w-full h-full hover:bg-primaryHvrClr flex py-3 px-4 gap-2 items-center [&>path]:stroke-strokeClr"
      onClick={handleDark}
    >
      <span>
        {isDark?.dark_status ? (
          <MoonIcon className="w-6 h-6 [&>path]:stroke-strokeClr" />
        ) : (
          <SunIcon className="w-6 h-6 [&>path]:stroke-strokeClr" />
        )}
      </span>
      {isDark?.dark_status ? (
        <span className="text-strokeClr">Disable Dark mode</span>
      ) : (
        <span className="text-strokeClr">Enable Dark mode</span>
      )}
    </button>
  );
}

export default ToggleDarkMode;
