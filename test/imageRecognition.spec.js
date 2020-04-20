const { expect } = require("chai");
const { classifyImage } = require("../src/workers/tfImageClassification");

const imagePath = "/home/alain/src/privatus/test/images/beetle.jpg";

// TODONOW: move to workers
describe("imageRecognition.js", function () {
  it.skip("classifyImage()", async () => {
    const imageClassification = await classifyImage(imagePath);

    expect(imageClassification).to.deep.equal({
      "68d26b9ddf35a8b08d49dbee7ce37305": {
        path: imagePath,
        tags: [],
      },
    });
  });
});
