export const BOOK_COLORS = [
  "#8B5E3C",
  "#2C5F4F",
  "#5C4B51",
  "#7B6B5C",
  "#4A5D5E",
  "#6B4E3D",
  "#3D5A5B",
  "#8B7355",
  "#556B6F",
  "#6E5B4F",
];

export const getRandomBookColor = () => {
  return BOOK_COLORS[Math.floor(Math.random() * BOOK_COLORS.length)];
};
