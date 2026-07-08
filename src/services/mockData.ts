import type { OutfitPhoto } from "../types/outfit";

function placeholderImage(bg: string, label: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500">
    <rect width="100%" height="100%" fill="${bg}" />
    <text x="50%" y="50%" font-size="28" fill="white" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif">${label}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function createSeedPhotos(userId: string): OutfitPhoto[] {
  const now = new Date();
  const daysAgo = (n: number) => new Date(now.getTime() - n * 24 * 60 * 60 * 1000).toISOString();

  const seed: Omit<OutfitPhoto, "imageUrl" | "thumbnailUrl">[] = [
    {
      id: "seed-1",
      userId,
      imagePath: "",
      thumbnailPath: "",
      createdAt: daysAgo(1),
      updatedAt: daysAgo(1),
      season: "winter",
      items: [
        { id: "seed-1-top", photoId: "seed-1", category: "top", subType: "knit", color: "cream" },
        { id: "seed-1-bottom", photoId: "seed-1", category: "bottom", subType: "slacks", color: "black" },
        { id: "seed-1-shoes", photoId: "seed-1", category: "shoes", subType: "dress_shoes", color: "black" },
        { id: "seed-1-outer", photoId: "seed-1", category: "outer", subType: "coat", color: "navy" },
      ],
      tags: ["출근룩"],
      memo: "겨울 출근룩",
    },
    {
      id: "seed-2",
      userId,
      imagePath: "",
      thumbnailPath: "",
      createdAt: daysAgo(5),
      updatedAt: daysAgo(5),
      season: "summer",
      items: [
        { id: "seed-2-top", photoId: "seed-2", category: "top", subType: "t_shirt", color: "white" },
        { id: "seed-2-bottom", photoId: "seed-2", category: "bottom", subType: "shorts", color: "beige" },
        { id: "seed-2-shoes", photoId: "seed-2", category: "shoes", subType: "sneakers", color: "white" },
        { id: "seed-2-outer", photoId: "seed-2", category: "outer", subType: "none", color: "none" },
      ],
      tags: ["데일리룩"],
      memo: "여름 데일리룩",
    },
    {
      id: "seed-3",
      userId,
      imagePath: "",
      thumbnailPath: "",
      createdAt: daysAgo(10),
      updatedAt: daysAgo(10),
      season: "spring_fall",
      items: [
        { id: "seed-3-top", photoId: "seed-3", category: "top", subType: "shirt", color: "sky_blue" },
        { id: "seed-3-bottom", photoId: "seed-3", category: "bottom", subType: "jeans", color: "denim" },
        { id: "seed-3-shoes", photoId: "seed-3", category: "shoes", subType: "sneakers", color: "gray" },
        { id: "seed-3-outer", photoId: "seed-3", category: "outer", subType: "jacket", color: "khaki" },
      ],
      tags: ["데이트룩"],
      memo: "",
    },
  ];

  const colors: Record<string, string> = {
    "seed-1": "#33415c",
    "seed-2": "#a9927d",
    "seed-3": "#5e6472",
  };

  return seed.map((photo) => ({
    ...photo,
    imageUrl: placeholderImage(colors[photo.id], "예시 사진"),
    thumbnailUrl: placeholderImage(colors[photo.id], "예시"),
  }));
}
