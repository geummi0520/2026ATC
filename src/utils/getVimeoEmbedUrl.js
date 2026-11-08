// vimeo.com/{id} 또는 비공개 링크 vimeo.com/{id}/{hash}를 player embed 주소로 변환합니다.
export const getVimeoEmbedUrl = (videoUrl) => {
  const match = videoUrl?.match(/vimeo\.com\/(\d+)(?:\/([\da-z]+))?/i);
  if (!match) return null;

  const [, id, hash] = match;
  return `https://player.vimeo.com/video/${id}${
    hash ? `?h=${hash}` : ""
  }?autoplay=1&muted=1`;
};
