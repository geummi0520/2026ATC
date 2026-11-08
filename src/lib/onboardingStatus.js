// 온보딩이 재생 중인지 메인이 알 수 있게 하는 아주 작은 공용 상태.
// 메인 클로슈는 온보딩이 끝날 때까지 닫힌 채로 기다렸다가, 끝나면 열림.
//
// 첫 접속(새로고침) 땐 온보딩이 항상 재생되므로 "재생 중"으로 시작하고,
// 온보딩이 끝나거나(또는 중간에 페이지를 떠나 사라지면) 끝난 걸로 바뀜.
let isPlaying = true;
const listeners = new Set();

export const isOnboardingPlaying = () => isPlaying;

export const finishOnboarding = () => {
  if (!isPlaying) return;
  isPlaying = false;
  listeners.forEach((listener) => listener());
};

export const subscribeOnboarding = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
