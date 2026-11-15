// 작품 목록/배치도에서 작품 상세로 이동할 때, 돌아올 주소(카테고리·배치도 상태)와 스크롤 위치를 저장
const STORAGE_KEY = "atc-works-return";

export const getWorksReturnSnapshot = () => {
  try {
    return sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
};

export const readWorksReturn = () => {
  try {
    return JSON.parse(getWorksReturnSnapshot());
  } catch {
    return null;
  }
};

export const saveWorksReturn = (entry) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(entry));
  } catch {}
};

export const clearWorksReturn = () => {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {}
};
