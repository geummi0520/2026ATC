// 메인(/)으로 넘어가는 연출용 주소라 검색 결과에 따로 나오지 않게 함
export const metadata = {
  robots: { index: false, follow: true },
  alternates: { canonical: "/" },
};

// 온보딩 화면은 레이아웃(MainLayout)이 띄움. 끝나면 메인(/)으로 넘어가서 이 페이지 자체는 비어 있음.
export default function OnboardingPage() {
  return null;
}
