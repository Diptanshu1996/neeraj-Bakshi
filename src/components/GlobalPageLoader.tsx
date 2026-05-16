"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function GlobalPageLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [visible, setVisible] = useState(false);
  const pendingRequestsRef = useRef(0);
  const hideTimerRef = useRef<number | null>(null);

  function showLoader() {
    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    setVisible(true);
  }

  function hideLoaderSoon(delay = 220) {
    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
    }
    hideTimerRef.current = window.setTimeout(() => {
      if (pendingRequestsRef.current === 0) {
        setVisible(false);
      }
    }, delay);
  }

  useEffect(() => {
    const originalFetch = window.fetch.bind(window);

    window.fetch = async (...args) => {
      pendingRequestsRef.current += 1;
      showLoader();

      try {
        return await originalFetch(...args);
      } finally {
        pendingRequestsRef.current = Math.max(0, pendingRequestsRef.current - 1);
        if (pendingRequestsRef.current === 0) {
          hideLoaderSoon();
        }
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const clickable = target.closest("a,button,[role='button'],input[type='submit'],input[type='button']");
      if (!clickable) return;

      showLoader();

      if (pendingRequestsRef.current === 0) {
        hideLoaderSoon(700);
      }
    }

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  useEffect(() => {
    hideLoaderSoon();
  }, [pathname, searchParams]);

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) {
        window.clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/45 backdrop-blur-[2px]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-300/30 border-t-amber-400" />
        <p className="text-sm font-semibold tracking-wide text-amber-100">Loading...</p>
      </div>
    </div>
  );
}
