// 온보딩이 재생 중인지 레이아웃·메인이 알 수 있게 하는 아주 작은 공용 상태.
// - 레이아웃: 재생 중이면 주소가 메인(/)으로 바뀐 뒤에도 온보딩을 계속 띄워서 사라지는 모션이 끊기지 않게 함
// - 메인: 재생 중이면 클로슈를 닫힌 채로 기다렸다가, 끝나면 열림
// 메인으로 바로 들어오면(새로고침 포함) 온보딩이 없으므로 "재생 중 아님"으로 시작함.
let isPlaying = false;

// 이 탭에서 온보딩을 이미 봤는지 기록하는 sessionStorage 키.
// sessionStorage는 새로고침해도 남고 탭/창을 닫으면 지워져서,
// "새로고침은 메인 그대로, 닫았다 다시 열면 온보딩부터"가 됨.
// (확인은 화면이 그려지기 전에 해야 해서 app/layout.jsx의 head 스크립트에서 함)
export const ONBOARDING_SEEN_KEY = "atc-onboarding-seen";
const listeners = new Set();

const notify = () => listeners.forEach((listener) => listener());

export const isOnboardingPlaying = () => isPlaying;

export const startOnboarding = () => {
  if (isPlaying) return;
  isPlaying = true;
  notify();
};

export const finishOnboarding = () => {
  if (!isPlaying) return;
  isPlaying = false;
  notify();
};

export const subscribeOnboarding = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
