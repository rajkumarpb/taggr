const bytenode = require("bytenode");
const filesystem = require("../filesystem");
const image = require("../image");
const store = require("../store");
const services = require("../services");

// @ts-ignore-next-line
require("../store/types");

/**
 * Generate main data structure from image path list
 *
 * @param {string[]} imagePathList
 * @returns {Promise<ImageHashMapType|{}>} imageHashMap
 */
const generateImageHashMap = async (imagePathList) => {
  const imageHashMap = {};

  for (const imagePath of imagePathList) {
    const hash = await filesystem.generateMD5HashFromFile(imagePath);
    imageHashMap[hash] = {
      hash,
      // TODO: improvement add http:// images when in dev
      path: filesystem.normalizeUrl(imagePath),
      rawPath: imagePath,
      tags: null,
      location: null,
    };
  }

  return imageHashMap;
};

/**
 * Transfrom the imageHashMap to imageList
 *
 * @param {ImageHashMapType|{}} imageHashMap
 * @returns {Object[]} imageList
 */
function transformImageMaptoImageList(imageHashMap) {
  return Object.keys(imageHashMap).map((key) => ({
    ...imageHashMap[key],
  }));
}

/**
 * Singelton class, acts as ORM
 */
class Project {
  constructor() {
    this.isProcessingActive = false;
  }

  async create(path) {
    this.isProcessingActive = true;

    // locate pic paths
    console.time("imagePathsToProcess");
    const imagePathsToProcess = await filesystem.recursivelyFindImages(path);
    console.timeEnd("imagePathsToProcess");

    // generate in memory structure, while calculating the hashes
    console.time("generateImageHashMap");
    const imageHashMap = await generateImageHashMap(imagePathsToProcess);
    console.timeEnd("generateImageHashMap");

    // populate FE
    services.services.updateImages({
      images: transformImageMaptoImageList(imageHashMap),
      imagesWithLocation: [],
    });

    // Store in BE

    // process images
    // const toProcess = imagePathsToProcess.length;
    // while (this.isProcessingActive && imagePathsToProcess.length) {
    //   const imagePath = imagePathsToProcess.shift();
    //   const hash = filesystem.generateMD5HashFromString(imagePath);

    //   services.services.updateTask({
    //     name: `Processing ${toProcess} memories!`,
    //     isOngoing: true,
    //     percentage: Math.ceil(
    //       ((toProcess - imagePathsToProcess.length) * 100) / toProcess
    //     ),
    //   });

    //   imageHashMap[hash] = {
    //     ...imageHashMap[hash],
    //     ...(await image.process(imagePath)),
    //   };
    // }

    // if (!this.isProcessingActive) return;

    // update store
    // store.setProject({ rootFolder: path, imageHashMap });

    // update task to stopped
    // services.services.updateTask({
    //   isOngoing: false,
    // });

    // // send location pictures
    // services.services.updateImages({
    //   images: transformImageMaptoImageList(imageHashMap),
    //   imagesWithLocation: transformImageMaptoImageList(
    //     store.getImagesWithLocation()
    //   ),
    // });

    this.isProcessingActive = false;
  }

  destroy() {
    this.isProcessingActive = false;
    store.resetStore();
  }
}

const projectSingelton = new Project();

module.exports = {
  create: projectSingelton.create,
  destroy: projectSingelton.destroy,
};
