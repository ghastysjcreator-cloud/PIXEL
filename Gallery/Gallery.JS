const GALLERY_STORAGE_KEY = "pixel-draw-gallery";
const GALLERY_ARCHIVE_STORAGE_KEY = "pixel-draw-gallery-archive";
const MAX_GALLERY_ITEMS = 9;

let cards = document.querySelectorAll(".card")
let clear_gallery = document.querySelector(".clear-gallert")

function loadStorageList(key) {
  try {
    const rawValue = localStorage.getItem(key);
    const parsedValue = rawValue ? JSON.parse(rawValue) : [];
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch (error) {
    console.warn("Не удалось прочитать локальное хранилище:", error);
    return [];
  }
}

function saveStorageList(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function sortByDateDesc(items) {
  return [items].sort(function (a, b) {
    return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
  });
}
