// IMAGE URL
export const getImageURL = (image: any, STRAPI_URL: string): string => {


  const imageData = Array.isArray(image) ? image[0] : image;

  if (!imageData?.url) return "";

  const imageUrl =
    imageData.formats?.medium?.url ||
    imageData.formats?.small?.url ||
    imageData.url;

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  return `${STRAPI_URL}${imageUrl}`;
}