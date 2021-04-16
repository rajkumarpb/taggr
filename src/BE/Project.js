import path from "path";

import { MESSAGE_CREATORS } from "../shared/message-passing";
import FE_ROUTES from "../shared/fe-routes";
import { ImageFactory, ImageHashMapFactory } from "../shared/entities";
import logger from "../shared/logger";

import messageHandler from "./message-handler";

import generateFileHash from "./utils/generate-file-hash";
import normalizePath from "./utils/normalize-path";
import findImagePaths from "./utils/find-images-in-path";
import preProcessImages from "./utils/pre-process-images";
import envPaths from "./utils/env-paths";
import db from "./utils/db";
import loadImage from "./utils/load-image";

import { getTags } from "./ml/calculate-tags";
// const { filterImages } = require("./filter");

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
 * Cental entity in the BE.
 * Holds the business logic.
 */
class Project {
  constructor() {
    this.imageMap = ImageHashMapFactory();
  }

  /**
   * Initialize taggr project
   * @param {string} rootPath
   */
  async create(rootPath) {
    logger.log("[BE] create(): ", rootPath);

    // 0. update FE route
    messageHandler.postMessage(
      MESSAGE_CREATORS.FE_setRoute(FE_ROUTES.PRE_PROCESSING_PAGE)
    );

    // 1. Locate image paths in project
    const imagePathsInProject = await findImagePaths(rootPath);

    // 2. Generate in memory structure, and calculate the file hashes
    for (const imagePath of imagePathsInProject) {
      const hash = await generateFileHash(imagePath);
      this.imageMap[hash] = ImageFactory({
        hash,
        path: normalizePath(path.join(envPaths.data, `${hash}.jpg`)),
        rawPath: imagePath,
        tags: null,
        location: null,
      });
    }

    logger.log(this.imageMap);

    // 3. Optimize images
    logger.time("preProcessImages");
    await preProcessImages(this.imageMap, envPaths.data);
    logger.timeEnd("preProcessImages");

    // 4. Store images in DB, load results for processed ones
    logger.time("db");
    const storedImageMap = db.get("images");
    Object.keys(this.imageMap).map((hash) => {
      if (storedImageMap && storedImageMap[hash] && storedImageMap[hash].tags) {
        // load data from DB, for the already processed images
        this.imageMap[hash] = {
          ...this.imageMap[hash],
          tags: storedImageMap[hash].tags,
          location: storedImageMap[hash].location,
        };
      }
    });
    db.set("images", this.imageMap);
    logger.timeEnd("db");

    // 5. update images in FE
    messageHandler.postMessage(
      MESSAGE_CREATORS.FE_updateImages(
        transformImageMaptoImageList(this.imageMap)
      )
    );

    // 6. update route in FE
    messageHandler.postMessage(
      MESSAGE_CREATORS.FE_setRoute(FE_ROUTES.DASHBOARD_PAGE)
    );

    this.process();
  }

  /**
   * ML the shit out of the images (if needed)
   */
  async process() {
    // only process the un-processed ones
    const imageHashToProcess = Object.keys(this.imageMap).filter((hash) => {
      if (this.imageMap[hash].tags) return false;

      return true;
    });

    // ML process
    for (const hash of imageHashToProcess) {
      const image = await loadImage(this.imageMap[hash].path);

      const tags = await getTags(image);
      logger.log("tags: ", tags);

      // store results
      db.set(`images.${hash}`, { ...this.imageMap[hash], tags });
    }

    return;
    // TODONOW: notify FE of pre-process and process progress
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
  }

  /**
   * Filter images
   *
   * @param {FilterType} filters
   * @returns {{images: ImageType[], imagesWithLocation: ImageType[]}} images
   */
  filterImages(filters) {
    return filterImages(this.imageMap, filters);
  }

  destroy() {
    // reset project
  }
}

export default new Project();
