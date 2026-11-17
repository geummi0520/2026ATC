// GA4 이벤트 전송. GA 스크립트가 아직 로드되지 않았거나 차단된 환경에서는 조용히 무시함
export const trackEvent = (name, params = {}) => {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;

  window.gtag("event", name, params);
};
