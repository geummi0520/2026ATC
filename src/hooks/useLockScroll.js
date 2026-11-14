import { useEffect } from "react";

// 모달이 열린 동안 body 스크롤을 막고, Esc로 닫을 수 있게 함
export default function useLockScroll(isLocked, onEscape) {
  useEffect(() => {
    if (!isLocked) return undefined;

    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event) => event.key === "Escape" && onEscape?.();

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isLocked, onEscape]);
}
