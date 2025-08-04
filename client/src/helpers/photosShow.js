export const photosShow = (uploadPath) => {
    const imagePath = uploadPath?.replace(".", "");
    return imagePath;
}