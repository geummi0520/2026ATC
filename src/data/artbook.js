// 아트북 PDF와 목차.
// page: 그 목차가 시작하는 PDF 페이지 번호(1부터). 클릭하면 이 페이지로 넘어감.
// PDF는 용량이 커서(약 97MB) git에 넣지 않고 R2(img.2026atc.com)에 올려 둠.
// 버킷 CORS에서 Range 요청을 허용해 둬야 필요한 부분만 받아옴(artbook.jsx의 PDF_OPTIONS).
export const ARTBOOK_PDF = "https://img.2026atc.com/artbook.pdf";

export const artbookToc = [
  { title: "서문", page: 7 },
  { title: "ATC란 무엇인가", page: 15 },
  { title: "레시피 구상하기", page: 59 },
  { title: "재료 준비하기", page: 71 },
  { title: "섞고 더하고 망치고 완성하기", page: 103 },
  { title: "맛보기", page: 361 },
  // isAppendix: 목차 번호 없이 제목만 표시
  { title: "* 별책부록", page: 401, isAppendix: true },
];
