import { getRelativeBlockLocation } from "./relative";
/**
* Iterates through blocks in a specified area and applies a callback function to each block location.
* @param {Vector3} startingPosition The starting position of the iteration.
* @param {(blockLocation: Vector3) => void} callback The function to apply to each block location.
* @param {number} width The width of the area to iterate through.
* @param {number} height The height of the area to iterate through.
*/
export function iterateBlocks(startingPosition, callback, width, height) {
    let isError = false;
    for (let blockZ = startingPosition.z; blockZ < width && !isError; blockZ++) {
        for (let blockX = startingPosition.x; blockX < width && !isError; blockX++) {
            try {
                for (let blockY = startingPosition.y; blockY < height && !isError; blockY++) {
                    callback({ x: blockX, y: blockY, z: blockZ });
                }
            }
            catch (error) {
                isError = true;
                throw error;
            }
        }
    }
}
/**
* Iterates through blocks in a specified area and applies a callback function to each block location.
* @param {Vector3} startingPosition The starting position of the iteration.
* @param {(blockLocation: Vector3) => void} callback The function to apply to each block location.
* @param {number} width The width of the area to iterate through.
* @param {number} height The height of the area to iterate through.
* @param {Vector3} relativeLocation The location to use for calculating the block locations.
*/
export function applyToBlocks(startingPosition, callback, width, height, relativeLocation) {
    iterateBlocks(startingPosition, (blockLocation) => {
        callback(getRelativeBlockLocation(relativeLocation, blockLocation));
    }, width, height);
}
