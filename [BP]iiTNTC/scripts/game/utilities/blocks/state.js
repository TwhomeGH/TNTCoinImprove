/**
* Checks if the block at the specified location in the given dimension is air.
* @param {Vector3} blockLocation The location of the block.
* @returns {boolean} `true` if the block is air, `false` otherwise.
*/
export function isBlockAir(dimension, blockLocation) {
    try {
        const blockAtLocation = dimension.getBlock(blockLocation);
        return blockAtLocation && blockAtLocation.typeId === "minecraft:air";
    }
    catch (error) {
        console.error(`Failed to get block at location: ${error}`);
        return false;
    }
}
/**
* checks if a given y-coordinate is on the boundary of a structure.
* @param {number} y the y-coordinate of block.
* @param {number} height the height of the structure.
* @returns {boolean} `true` if the block is on the boundary, `false` otherwise.
*/
export function isBlockOnBoundary(y, height) {
    return (y === 0) || (y === (height - 1));
}
/**
* checks if a given block location is on the border of a structure
* @param {{ x: number, z: number }} blockLocation the location of the block to check
* @param {number} width the width of the structure
* @returns {boolean} `true` if the block is on the border, `false` otherwise
*/
export function isBlockOnBorder(blockLocation, width) {
    const { x, z } = blockLocation;
    return x === 0 || z === 0 || x === (width - 1) || z === (width - 1);
}
/**
 * checks if the given y-coordinate is on the bottom layer of a structure
 * @param {number} y the y-coordinate of the block
 * @returns {boolean} `true` if the block is on the floor, `false` otherwise
 */
export function isBlockOnBottomLayer(y) {
    return y === 0;
}
/**
 * check the given y-coordinate is on the top layer of a structure
 * @param {number} y the y-coordinate of the block
 * @param height the height of the structure
 * @returns `true` if the block is on the top layer, `false` otherwise
 */
export function isBlockOnTopLayer(y, height) {
    return y === (height - 1);
}
/**
* checks if a given block location is on the top edge of a structure
* @param {Vector3} blockLocation the location of the block to check
* @param {number} width the width of the structure
* @param {number} height the height of the structure
* @returns {boolean} `true` if the block is on the top edge, `false` otherwise
*/
export function isBlockOnTopEdge(blockLocation, width, height) {
    const { x, y, z } = blockLocation;
    return isBlockOnTopLayer(y, height) && isBlockOnBorder({ x, z }, width);
}
/**
* Checks if a given block location is on the perimeter of a structure.
* The perimeter includes both the border and the top edge of the structure.
* @param {Vector3} blockLocation The location of the block to check.
* @param {number} width the width of the structure.
* @param {number} height the height of the structure.
* @returns {boolean} `true` if the block is on the perimeter, `false` otherwise.
*/
export function isBlockOnPerimeter(blockLocation, width, height) {
    return isBlockOnBorder({ x: blockLocation.x, z: blockLocation.z }, width) || isBlockOnTopEdge(blockLocation, width, height);
}
