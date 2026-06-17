const GALLERY_STORAGE_KEY = "pixel-draw-gallery";
const GALLERY_ARCHIVE_STORAGE_KEY = "pixel-draw-gallery-archive";
const MAX_GALLERY_ITEMS = 9;
const MAX_ARCHIVE_ITEMS = 60;

const galleryGrid = document.querySelector("#galleryGrid");
const galleryCount = document.querySelector("#galleryCount");
const archiveCount = document.querySelector("#archiveCount");
const emptyMessage = document.querySelector("#emptyMessage");
const clearGalleryButton = document.querySelector("#clearGallery");
const previewModal = document.querySelector("#previewModal");
const modalImage = document.querySelector("#modalImage");
const modalMeta = document.querySelector("#modalMeta");
const modalTitle = document.querySelector("#modalTitle");
const saveNotice = document.querySelector(".save-notice");

const GRID_COLUMNS = 50;
const GRID_ROWS = 20;
const PREVIEW_CELL_SIZE = 16;

let noticeTimeoutId = 0;
let artworks = [];

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
  return [...items].sort(function (a, b) {
    return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
  });
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function loadGallery() {
  artworks = sortByDateDesc(loadStorageList(GALLERY_STORAGE_KEY)).slice(0, MAX_GALLERY_ITEMS);
}

function renderPlaceholder(index) {
  return (
    '<article class="gallery-card gallery-card--placeholder">' +
    '<div class="placeholder-art" aria-hidden="true"></div>' +
    "<h3>Пустой слот " +
    (index + 1) +
    "</h3>" +
    "<p>Сохрани рисунок в редакторе, и он появится здесь.</p>" +
    "</article>"
  );
}

function renderArtworkCard(artwork, index) {
  return (
    '<article class="gallery-card" data-artwork-id="' +
    artwork.id +
    '">' +
    '<img class="gallery-card__image" src="' +
    artwork.dataUrl +
    '" alt="Работа ' +
    (index + 1) +
    '">' +
    "<h3>Работа " +
    (index + 1) +
    "</h3>" +
    "<p>Сохранено: " +
    formatDate(artwork.savedAt) +
    "</p>" +
    '<button data-action="open" data-id="' +
    artwork.id +
    '">Открыть</button>' +
    '<button data-action="delete" data-id="' +
    artwork.id +
    '">Удалить</button>' +
    "</article>"
  );
}

function renderGallery() {
  const placeholdersCount = Math.max(0, MAX_GALLERY_ITEMS - artworks.length);
  const cards = [
    ...artworks.map(renderArtworkCard),
    ...Array.from({ length: placeholdersCount }, function (_, index) {
      return renderPlaceholder(index + artworks.length);
    }),
  ];

  galleryGrid.innerHTML = cards.join("");
  galleryCount.textContent = artworks.length + " / " + MAX_GALLERY_ITEMS;
  emptyMessage.hidden = artworks.length > 0;
}

function findArtwork(id) {
  return artworks.find(function (artwork) {
    return artwork.id === id;
  });
}

function openArtwork(id) {
  const artwork = findArtwork(id);
  if (!artwork) return;

  modalTitle.textContent = "Сохранённый рисунок";
  modalImage.src = artwork.dataUrl;
  modalMeta.textContent = formatDate(artwork.savedAt) + " · " + artwork.format;
  previewModal.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeModal() {
  previewModal.hidden = true;
  modalImage.src = "";
  document.body.style.overflow = "";
}

function deleteArtwork(id) {
  const shouldDelete = window.confirm("Удалить эту работу из локальной галереи?");
  if (!shouldDelete) return;

  artworks = artworks.filter(function (item) {
    return item.id !== id;
  });

  saveStorageList(GALLERY_STORAGE_KEY, artworks);
  closeModal();
  renderGallery();
}

function clearGallery() {
  const shouldClear = window.confirm("Очистить все активные работы?");
  if (!shouldClear) return;

  artworks = [];
  saveStorageList(GALLERY_STORAGE_KEY, artworks);
  closeModal();
  renderGallery();
}

function showSaveNotice(message, type = "success") {
  window.clearTimeout(noticeTimeoutId);
  saveNotice.textContent = message;
  saveNotice.classList.toggle("is-error", type === "error");
  saveNotice.classList.add("is-visible");

  noticeTimeoutId = window.setTimeout(function () {
    saveNotice.classList.remove("is-visible");
  }, 4200);
}

function isQuotaExceeded(error) {
  return (
    error &&
    (error.name === "QuotaExceededError" || error.name === "NS_ERROR_DOM_QUOTA_REACHED" || error.code === 22 || error.code === 1014)
  );
}

function makeArchiveRecord(artwork) {
  const archiveRecord = { ...artwork };
  delete archiveRecord.dataUrl;

  archiveRecord.archivedAt = new Date().toISOString();
  archiveRecord.imageRemoved = true;
  return archiveRecord;
}

function saveArchiveItems(items) {
  if (!items.length) return;

  const archiveItems = items.map(makeArchiveRecord);
  const archive = [...archiveItems, ...loadStorageList(GALLERY_ARCHIVE_STORAGE_KEY)].slice(0, MAX_ARCHIVE_ITEMS);

  try {
    saveStorageList(GALLERY_ARCHIVE_STORAGE_KEY, archive);
  } catch (error) {
    console.warn("Архив не сохранён: в браузере мало места.", error);
  }
}

function saveArtworkToGallery(artwork) {
  const current = loadStorageList(GALLERY_STORAGE_KEY);
  let next = [artwork, ...current];
  const overflow = next.slice(MAX_GALLERY_ITEMS);

  next = next.slice(0, MAX_GALLERY_ITEMS);

  try {
    saveStorageList(GALLERY_STORAGE_KEY, next);
    saveArchiveItems(overflow);
  } catch (error) {
    if (isQuotaExceeded(error)) {
      throw new Error("В браузере закончилось место для локальной галереи.");
    }
    throw error;
  }
}

function serializeGrid() {
  return cells
    .map(function (cell) {
      return cell.dataset.colorCode || "0";
    })
    .join("");
}

function getPaletteSnapshot() {
  const palette = {};

  Object.entries(CODE_TO_COLOR).forEach(function ([code, colorState]) {
    palette[code] = colorState.background;
  });

  return palette;
}

function createPreviewFromPixelData(pixelData) {
  const canvas = document.createElement("canvas");
  canvas.width = GRID_COLUMNS * PREVIEW_CELL_SIZE;
  canvas.height = GRID_ROWS * PREVIEW_CELL_SIZE;

  const context = canvas.getContext("2d");
  context.imageSmoothingEnabled = false;

  for (let index = 0; index < pixelData.length; index++) {
    const colorCode = pixelData[index] || "0";
    const colorState = CODE_TO_COLOR[colorCode] || CODE_TO_COLOR["0"];
    const x = (index % GRID_COLUMNS) * PREVIEW_CELL_SIZE;
    const y = Math.floor(index / GRID_COLUMNS) * PREVIEW_CELL_SIZE;

    context.fillStyle = colorState.background;
    context.fillRect(x, y, PREVIEW_CELL_SIZE, PREVIEW_CELL_SIZE);
  }

  const dataUrl = canvas.toDataURL("image/webp", 0.9);
  return { dataUrl, format: "image/webp" };
}

function createArtworkRecord() {
  const pixelData = serializeGrid();
  const preview = createPreviewFromPixelData(pixelData);

  return {
    id: "pixel-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8),
    savedAt: new Date().toISOString(),
    format: preview.format,
    dataUrl: preview.dataUrl,
    pixelData,
    columns: GRID_COLUMNS,
    rows: GRID_ROWS,
    palette: getPaletteSnapshot(),
  };
}

async function saveFieldAsImage() {
  if (!field) {
    showSaveNotice("Поле для рисования не найдено.", "error");
    return;
  }

  saveImageButton.disabled = true;

  try {
    const artwork = createArtworkRecord();
    saveArtworkToGallery(artwork);

    const dataUrl = await domtoimage.toPng(field);
    downloadDataUrl(dataUrl, "pixel-draw.png");

    showSaveNotice("Рисунок сохранён в браузере и добавлен в галерею.");
  } catch (error) {
    console.error("Не удалось сохранить изображение:", error);
    showSaveNotice("Не удалось сохранить рисунок. Возможно, в браузере мало места.", "error");
  } finally {
    saveImageButton.disabled = false;
  }
}

galleryGrid.addEventListener("click", function (event) {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  if (button.dataset.action === "open") {
    openArtwork(button.dataset.id);
  }

  if (button.dataset.action === "delete") {
    deleteArtwork(button.dataset.id);
  }
});

clearGalleryButton.addEventListener("click", clearGallery);
saveImageButton.addEventListener("click", saveFieldAsImage);

previewModal.addEventListener("click", function (event) {
  if (event.target.closest("[data-close-modal]")) {
    closeModal();
  }
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && !previewModal.hidden) {
    closeModal();
  }
});

loadGallery();
renderGallery();
