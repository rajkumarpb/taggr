const { store, autoEffect } = require("@risingstack/react-easy-state");

const { generateMD5Hash } = require("./utils");

const defaultImages = [
  {
    hash: "1",
    path: "/home/alain/Downloads/test_pictures/foto_340.jpg",
    tags: ["cat", "dog"],
  },
  {
    hash: "3",
    path: "/home/alain/Downloads/test_pictures/foto_341.jpg",
    tags: ["cat", "dog"],
  },
];

/**
 * @type {uiStoreType} appStore
 */
let uiStore = store({
  currentPage: "START_PAGE",
  tagSearchValue: "",
  filteredImageList: defaultImages,
});

// const queueExecutor = async (imagePath) => {
//   console.log("EXECUTING: ", imagePath);
//   console.time("loadImage");
//   let img = await loadImage(imagePath);
//   console.timeEnd("loadImage");

//   let canvas = new OffscreenCanvas(img.width, img.height);
//   canvas.getContext("2d").drawImage(img, 0, 0);

//   let imageData = canvas
//     .getContext("2d")
//     .getImageData(0, 0, img.width, img.height);

//   workers.imageTaggingWorker.postMessage({
//     path: imagePath,
//     data: imageData,
//   });

//   // clean up for garbage collector
//   img = null;
//   canvas = null;
//   imageData = null;

//   // set timeout to allow worker callback to be triggered: TODO: performance: consider returning all the calculations at once from the worker.
//   await new Promise((r) => setTimeout(r, 200));
// };

// const triggerImageTagsCalculation = async (imagePathsList) => {
//   console.log("triggerImageTagsCalculation", imagePathsList.length);

//   // setup worker listener
//   workers.imageTaggingWorker.onmessage = ({ data }) => {
//     setImageTags(data.path, data.tags);
//   };

//   const { Queue } = require("./utils");
//   const imageRenderingQueue = new Queue(queueExecutor);

//   imagePathsList.forEach(
//     async (imagePath) => await imageRenderingQueue.add(imagePath)
//   );
// };

// const setImageTags = (imagePath, tags) => {
//   console.log("setImageTags", `${imagePath}: ${tags}`);
//   const imageHash = generateMD5Hash(imagePath);

//   if (uiStore.imageHashMap[imageHash]) {
//     // update if existing
//     uiStore.imageHashMap[imageHash].tags = tags;
//   } else {
//     // initialize if non existing
//     uiStore.imageHashMap[imageHash] = {
//       hash: imageHash,
//       path: imagePath,
//       tags,
//     };
//   }
// };

// const setTagSearchValue = (searchValue) => {
//   console.log("setTagSearchValue: ", searchValue);
//   uiStore.tagSearchValue = searchValue;

//   if (searchValue === "") {
//     // TODONOW: calculate default values and store in variable, not mock
//     uiStore.filteredImageList = defaultImages;
//     return;
//   }

//   const filteredImages = [];
//   let found = 0; // only calculate the first 15 tag matches

//   Object.keys(uiStore.imageHashMap).some((key) => {
//     const tags = uiStore.imageHashMap[key].tags;

//     if (tags.filter((tag) => tag.includes(searchValue)).length > 0) {
//       filteredImages.push(uiStore.imageHashMap[key]);

//       found++;
//     }
//     if (found > 15) {
//       return true;
//     }
//   });

//   console.log(filteredImages.length);

//   uiStore.filteredImageList = filteredImages;
// };

// // EXPERIMENT

// const imagePath = "/home/alain/Desktop/a/0.jpg";

// async function loadImage(path) {
//   return new Promise((resolve, reject) => {
//     const img = new Image();
//     img.onerror = (err) => reject(err);
//     img.onload = () => resolve(img);
//     img.src = path;
//   });
// }

module.exports = uiStore;
