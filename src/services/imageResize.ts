const LARGE_MAX_SIZE = 1600;
const THUMBNAIL_MAX_SIZE = 400;
const LARGE_QUALITY = 0.82;
const THUMBNAIL_QUALITY = 0.75;

export type ResizedImageSet = {
  large: Blob;
  thumbnail: Blob;
};

function loadImageFromFile(file: File): Promise<{ img: HTMLImageElement; objectUrl: string }> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve({ img, objectUrl });
    img.onerror = () => reject(new Error("이미지를 불러올 수 없습니다."));
    img.src = objectUrl;
  });
}

function drawResizedCanvas(img: HTMLImageElement, maxSize: number): HTMLCanvasElement {
  let { naturalWidth: width, naturalHeight: height } = img;

  if (width > height && width > maxSize) {
    height = Math.round((height * maxSize) / width);
    width = maxSize;
  } else if (height >= width && height > maxSize) {
    width = Math.round((width * maxSize) / height);
    height = maxSize;
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("이미지 처리를 위한 Canvas를 생성할 수 없습니다.");
  }
  ctx.drawImage(img, 0, 0, width, height);
  return canvas;
}

function canvasToJpegBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("이미지 압축에 실패했습니다."));
      },
      "image/jpeg",
      quality,
    );
  });
}

export async function createResizedImages(file: File): Promise<ResizedImageSet> {
  const { img, objectUrl } = await loadImageFromFile(file);
  try {
    const largeCanvas = drawResizedCanvas(img, LARGE_MAX_SIZE);
    const thumbnailCanvas = drawResizedCanvas(img, THUMBNAIL_MAX_SIZE);
    const [large, thumbnail] = await Promise.all([
      canvasToJpegBlob(largeCanvas, LARGE_QUALITY),
      canvasToJpegBlob(thumbnailCanvas, THUMBNAIL_QUALITY),
    ]);
    return { large, thumbnail };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
