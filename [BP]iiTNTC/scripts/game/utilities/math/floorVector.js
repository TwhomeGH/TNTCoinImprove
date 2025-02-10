/**
* rounds the x, y, and z components of the given vector to the nearest whole number.
* @param {Vector3} vector the vector to round.
* @returns {Vector3} a new vector with the rounded components.
*/
export function floorVector3(vector) {
    return {
        x: Math.floor(vector.x),
        y: Math.floor(vector.y),
        z: Math.floor(vector.z)
    };
}
