import { floorVector3 } from "../math/floorVector";
/**
* calculates the new position of a block by adding the block's current location to a given position.
* @param {Vector3} relativePosition the given relative position to be added to the block's current location.
* @param {Vector3} blockLocation the current location of the block.
* @returns {Vector3} the new location of the block.
*/
export function getRelativeBlockLocation(relativePosition, blockLocation) {
    return floorVector3({
        x: relativePosition.x + blockLocation.x,
        y: relativePosition.y + blockLocation.y,
        z: relativePosition.z + blockLocation.z,
    });
}
