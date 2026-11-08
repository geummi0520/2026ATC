"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import {
  STAMP_CHANGE_EVENT,
  STAMP_STORAGE_KEY,
  STAMP_TOTAL,
} from "@/constants/stamps";
import { createStampPlan, isValidStampPlan } from "@/utils/stampPlan";

export const StampContext = createContext(null);

const subscribeToStamp = (callback) => {
  window.addEventListener("storage", callback);
  window.addEventListener(STAMP_CHANGE_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(STAMP_CHANGE_EVENT, callback);
  };
};

const getStampSnapshot = () => {
  try {
    return window.localStorage.getItem(STAMP_STORAGE_KEY);
  } catch {
    return null;
  }
};

const getServerStampSnapshot = () => null;

const parseStampPlan = (rawPlan) => {
  try {
    const plan = JSON.parse(rawPlan);
    return isValidStampPlan(plan) ? plan : null;
  } catch {
    return null;
  }
};

const saveStampPlan = (plan) => {
  try {
    window.localStorage.setItem(STAMP_STORAGE_KEY, JSON.stringify(plan));
    window.dispatchEvent(new Event(STAMP_CHANGE_EVENT));
  } catch {
    // 저장소 접근이 제한된 환경에서는 도장 수집을 하지 않음
  }
};

export default function StampProvider({ children }) {
  const rawPlan = useSyncExternalStore(
    subscribeToStamp,
    getStampSnapshot,
    getServerStampSnapshot
  );
  const plan = useMemo(() => parseStampPlan(rawPlan), [rawPlan]);
  // null | { view: "card" | "reward", stampedSlot?: string }
  const [modal, setModal] = useState(null);

  // 하이드레이션 첫 렌더에서는 plan이 항상 null이라, 저장소를 직접 확인한 뒤에만 새로 만듦
  useEffect(() => {
    if (plan || parseStampPlan(getStampSnapshot())) return;
    saveStampPlan(createStampPlan());
  }, [plan]);

  const collect = useCallback((slot) => {
    const currentPlan = parseStampPlan(getStampSnapshot());
    if (!currentPlan || currentPlan.collected.includes(slot)) return;

    saveStampPlan({
      ...currentPlan,
      collected: [...currentPlan.collected, slot],
    });
    setModal({ view: "card", stampedSlot: slot });
  }, []);

  const openStampCard = useCallback(() => {
    const collectedCount = parseStampPlan(getStampSnapshot())?.collected.length ?? 0;
    setModal({ view: collectedCount >= STAMP_TOTAL ? "reward" : "card" });
  }, []);

  const showReward = useCallback(() => setModal({ view: "reward" }), []);
  const closeStampModal = useCallback(() => setModal(null), []);

  const value = useMemo(() => {
    const collected = plan?.collected ?? [];

    return {
      plan,
      collected,
      isComplete: collected.length >= STAMP_TOTAL,
      modal,
      collect,
      openStampCard,
      showReward,
      closeStampModal,
    };
  }, [plan, modal, collect, openStampCard, showReward, closeStampModal]);

  return (
    <StampContext.Provider value={value}>{children}</StampContext.Provider>
  );
}
