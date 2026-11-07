// 작품배치도에서 작품 상세로 이동할 때, 돌아올 배치도 주소와 스크롤 위치를 저장
const STORAGE_KEY = "atc-works-map-return";

export const getWorksMapReturnSnapshot = () => {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

export const readWorksMapReturn = () => {
  try {
    return JSON.parse(getWorksMapReturnSnapshot());
  } catch {
    return null;
  }
};

export const saveWorksMapReturn = (entry) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(entry));
  } catch {}
};

export const clearWorksMapReturn = () => {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {}
};
