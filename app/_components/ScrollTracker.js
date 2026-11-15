"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Spinner from "./Spinner";
import { createClient } from "../_lib/supabase/client";

const supabase = createClient();

export default function ScrollTracker({ currentLimit }) {
  const [totalPosts, setTotalPosts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const isFetching = useRef(false);

  useEffect(() => {
    async function getPosts() {
      let { count, error } = await supabase
        .from("user_posts")
        .select("*", { count: "exact", head: true });

      if (!error) {
        setTotalPosts(count);
      }
    }

    getPosts();
  }, []);

  useEffect(() => {
    isFetching.current = false;
  }, [currentLimit]);

  useEffect(() => {
    function handleScroll() {
      if (isFetching.current) return;

      if (currentLimit === totalPosts || currentLimit > totalPosts) return;

      setIsLoading(true);

      const feedPage = document.getElementById("feedHomePageTrackingId");

      if (feedPage) {
        if (
          window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 100
        ) {
          isFetching.current = true;

          const nextLimit = currentLimit + 5;

          router.replace(`${pathname}?limit=${nextLimit}`, { scroll: false });
        }
      }
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentLimit, router, pathname, totalPosts]);

  return (
    <div
      className={`${isLoading ? "flex" : "hidden"} mb-20 h-max items-center justify-center`}
    >
      <Spinner />
    </div>
  );
}
