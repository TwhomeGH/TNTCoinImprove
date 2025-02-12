import { PlayerFeedback } from "../core/PlayerFeedback";
import { floorVector3 } from "./utilities/math/floorVector";
import { fill } from "./utilities/blocks/fill";
import { clearBlocks } from "./utilities/blocks/clearing";
import { getRelativeBlockLocation } from "./utilities/blocks/relative";
import { applyToBlocks, iterateBlocks } from "./utilities/blocks/iteration";
import { isBlockAir, isBlockOnBorder, isBlockOnBoundary, isBlockOnBottomLayer, isBlockOnPerimeter } from "./utilities/blocks/state";
/**
 * @class TNTCoinStructure
 * @classdesc the structure of the TNT Coin.
 */
export class TNTCoinStructure {
    _player;
    _dimension;
    _feedback;
    _structureKey;
    _fillBlockName = "minecraft:stone";
    _fillTickInterval = 1;
    _fillBlocksPerTick = 50;
    _isFilling = false;
    _protectedBlockLocations = new Set();
    _airBlockLocations = new Set();
    _filledBlockLocations = new Set();
    _barrierBlockLocations = new Set();
    /**
    * Creates a new instance of the TNTCoinGameStructure class.
    * @param {Player} player The player to create the structure for.
    */
    constructor(player) {
        this._structureKey = `tnt_coin_structure-${player.name}`;
        this._player = player;
        this._dimension = player.dimension;
        this._feedback = new PlayerFeedback(player);
    }
    /**
     * Get the structure key
     */
    get structureKey() {
        return this._structureKey;
    }
    /**
     * Set the structure properties
     * @param {string} newProperties the new properties
     */
    set structureProperties(newProperties) {
        try {
            this._player.setDynamicProperty(this._structureKey, newProperties);
        }
        catch (error) {
            console.error(`Failed to set structure data for player ${this._player.name}: `, error);
        }
    }
    /**
     * Get the structure properties
     * @returns {StructureProperties} the structure properties
     */
    get structureProperties() {
        try {
            const data = this._player.getDynamicProperty(this._structureKey);
            if (!data) {
                this._feedback.error("No structure data found.");
                return;
            }
            ;
            return JSON.parse(data);
        }
        catch (error) {
            console.error(`Failed to get structure data for player ${this._player.name}: `, error);
        }
    }
    /**
     * Gets the fill settings for the TNT coin structure.
     * @returns {{ blockName: string, tickInterval: number, blocksPerTick: number }} The fill settings.
     */
    get fillSettings() {
        return { blockName: this._fillBlockName, tickInterval: this._fillTickInterval, blocksPerTick: this._fillBlocksPerTick };
    }
    /**
     * Set the fill settings
     */
    set fillSettings({ blockName, tickInterval, blocksPerTick }) {
        this._fillBlockName = blockName;
        this._fillTickInterval = tickInterval;
        this._fillBlocksPerTick = blocksPerTick;
    }
    /**
     * Gets a value indicating whether the structure is currently being filled.
     * @returns {boolean} `true` if the structure is being filled, `false` otherwise.
     */
    get isFilling() {
        return this._isFilling;
    }
    /**
     * Get the width of the structure
     * @returns {number} the width of the structure
     */

    get structurelimitWidth(){
        return this.structureProperties.limitWidth;
    }
    
    get structureWidth() {
        return this.structureProperties.width;
    }
    /**
     * Get the height of the structure
     * @returns {number} the height of the structure
     */
    
    get structurelimitHeight() {
        return this.structureProperties.limitHeight;
    }
    
    get structureHeight() {
        return this.structureProperties.height;
    }
    /**
     * Get the center of the structure
     * @returns {Vector3} the center of the structure
     */
    get structureCenter() {
        const { centerLocation, width } = this.structureProperties;
        const x = centerLocation.x + Math.floor(width / 2);
        const y = centerLocation.y;
        const z = centerLocation.z + Math.floor(width / 2);
        return floorVector3({ x, y, z });
    }
    /**
     * Get the protected block locations
     * @returns {Set<string>} the protected block locations
     */
    get protectedBlockLocations() {
        return this._protectedBlockLocations;
    }
    /**
     * Get the filled locations
     * @returns {Set<string>} the filled block locations
     */
    get filledBlockLocations() {
        return this._filledBlockLocations;
    }
    /**
     * Get the air block locations
     * @returns {Vector3[]} the air block locations
     */
    get airBlockLocations() {
        return Array.from(this._airBlockLocations)
            .filter((location) => {
            const blockLocation = JSON.parse(location);
            return isBlockAir(this._dimension, blockLocation);
        })
            .map((location) => JSON.parse(location));
    }
    /**
    * Get the blocks to clear
    * @returns {Vector3[]} the block locations to clear
    */
    get blocksToClear() {
        const blocksToClear = [];
        const { width, height, centerLocation } = this.structureProperties;
        applyToBlocks({ x: 1, y: 1, z: 1 }, (blockPosition) => {
            if (!isBlockAir(this._dimension, blockPosition))
                blocksToClear.push(blockPosition);
        }, width - 1, height, centerLocation);
        return blocksToClear;
    }
    /**
     * Generates a random location within or on top of the structure.
     * @param {number} offset
     * The offset from the edges to avoid.
     * @param {boolean} onTop
     * If `true`, generates a random Y on top of the structure.
     * If `false`, generates a random Y within the structure's height.
     * @returns {Vector3}
     * A random location within or on top of the structure's bounds.
     * @remarks The default value of `onTop` is `false`.
     */
    randomLocation(offset, onTop = false) {
        const { centerLocation, width, height } = this.structureProperties;
        const { x, y, z } = centerLocation;
        const randomX = x + offset + Math.floor(Math.random() * (width - 2 * offset));
        const randomZ = z + offset + Math.floor(Math.random() * (width - 2 * offset));
        let randomY;
        if (onTop) {
            const randomOffset = Math.floor(Math.random() * 3) + 4;
            randomY = y + height + randomOffset;
        }
        else {
            randomY = y + offset + Math.floor(Math.random() * (height - 2 * offset));
        }
        return floorVector3({ x: randomX, y: randomY, z: randomZ });
    }
    /**
    * Generate protected structure.
    * @returns {Promise<void>} a promise that resolves when the protected structure is generated.
    */
    async generateProtectedStructure() {
        let protectedBlocks = [];
        try {
            this.iterateProtectedBlockLocations({ x: 0, y: 0, z: 0 }, (blockLocation, blockName) => {
                protectedBlocks.push({ blockName, blockLocation });
            });
            await this.generateProtectedBlocks(protectedBlocks);
        }
        catch (error) {
            throw error;
        }
    }
    /**
    * Generates protected blocks.
    * @param {Array<{ blockName: string; blockLocation: Vector3 }>} blocks The blocks to generate.
    * @returns {Promise<void>} a promise that resolves when all blocks have been generated.
    */
    async generateProtectedBlocks(blocks) {
        const chunkSize = 100;
        for (const block of blocks) {
            try {
                await fill(this._dimension, block.blockName, [block.blockLocation], chunkSize, {
                    onSetBlock: (location) => this._protectedBlockLocations.add(JSON.stringify(location)),
                });
            }
            catch (error) {
                throw error;
            }
        }
    }
    /**
    * Gets the locations of the protected blocks.
    * @param {Vector3} startingPosition where's location to start
    * @param {(blockLocation: Vector3, blockName: string) => void} handleBlock handle block location
    */
    iterateProtectedBlockLocations(startingPosition, handleBlock) {
        this._airBlockLocations.clear();
        const { width, height, centerLocation, blockOptions } = this.structureProperties;
        const { baseBlockName, sideBlockName, floorBlockName } = blockOptions;
        const heightMinRange = this._dimension.heightRange.min;
        const heightMaxRange = this._dimension.heightRange.max;
        try {
            iterateBlocks(startingPosition, (blockLocation) => {
                const { x, y, z } = blockLocation;
                // Check if block is out of bounds
                if (y < heightMinRange || y > heightMaxRange) {
                    throw new Error('Block out of bounds.');
                }
                const blockPosition = JSON.stringify(getRelativeBlockLocation(centerLocation, blockLocation));
                const isOnPerimeter = isBlockOnPerimeter(blockLocation, width, height);
                const isOnBottomLayer = isBlockOnBottomLayer(y);
                const isOnBoundary = isBlockOnBoundary(y, height);
                const isOnBorder = isBlockOnBorder({ x, z }, width);
                let blockName = null;
                if (isOnBottomLayer) {
                    blockName = isOnBorder ? baseBlockName : floorBlockName;
                }
                else if (isOnPerimeter) {
                    blockName = isOnBoundary ? baseBlockName : sideBlockName;
                }
                if (blockName) {
                    handleBlock(JSON.parse(blockPosition), blockName);
                    this._protectedBlockLocations.add(blockPosition);
                }
                else {
                    this._airBlockLocations.add(blockPosition);
                }
            }, width, height);
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * Generate barrier blocks on top of the structure.
     */
    async generateBarriers() {
        let barrierBlocks = [];
        const { width, height, centerLocation } = this.structureProperties;
        const barrierHeight = 7;
        iterateBlocks({ x: 0, y: 0, z: 0 }, (blockLocation) => {
            const isOnPerimeter = isBlockOnBorder(blockLocation, width);
            const isTopLayer = blockLocation.y === (barrierHeight - 1);
            if (isOnPerimeter || isTopLayer) {
                const absoluteLocation = {
                    x: centerLocation.x + blockLocation.x,
                    y: centerLocation.y + height + blockLocation.y,
                    z: centerLocation.z + blockLocation.z
                };
                barrierBlocks.push(absoluteLocation);
                this._protectedBlockLocations.add(JSON.stringify(absoluteLocation));
            }
        }, width, barrierHeight);
        try {
            await fill(this._dimension, 'minecraft:barrier', barrierBlocks, 100, {
                onSetBlock: (location) => this._barrierBlockLocations.add(JSON.stringify(location)),
            });
        }
        catch (error) {
            console.error('Failed to generate barriers:', error);
        }
    }
    /**
     * Clear barrier blocks around the structure.
     */
    async clearBarriers() {
        try {
            const blocksToClear = Array.from(this._barrierBlockLocations)
                .map(location => JSON.parse(location));
            await clearBlocks(this._dimension, blocksToClear, 100);
            blocksToClear.forEach(location => {
                this._protectedBlockLocations
                    .delete(JSON.stringify(location));
            });
            this._barrierBlockLocations.clear();
        }
        catch (error) {
            console.error('Failed to clear barriers:', error);
        }
    }
    /**
    * Clear the protected structure
    * @returns {Promise<void>} a promise that resolves when the protected structure is cleared.
    */
    async clearProtedtedStructure() {
        if (!this._protectedBlockLocations.size)
            return;
        const blocksToClear = Array.from(this._protectedBlockLocations)
            .map((location) => JSON.parse(location));
        try {
            await clearBlocks(this._dimension, blocksToClear, 100);
            this._protectedBlockLocations.clear();
            this._feedback.playSound('mob.wither.break_block');
        }
        catch (error) {
            throw new Error(`Failed to clear protected structure: ${error}`);
        }
    }
    /**
    * Fills the empty locations within the structure.
    * @returns {Promise<void>} A promise that resolves when the filling is complete.
    */
    async fill() {
        if (this._isFilling) {
            this._feedback.warning("Already filling blocks.", { sound: 'item.shield.block' });
            return;
        }
        ;
        if (this._airBlockLocations.size === 0) {
            this._feedback.error("No locations  to fill.", { sound: 'item.shield.block' });
            return;
        }
        this._isFilling = true;
        const ON_SET_BLOCK_SOUND = 'block.bamboo.place';
        const ON_SET_BLOCK_PARTICLE = 'minecraft:wind_explosion_emitter';
        const ON_COMPLETE_SOUND = 'random.levelup';
        try {
            await fill(this._dimension, this._fillBlockName, this.airBlockLocations, this._fillBlocksPerTick, {
                delayInTicks: this._fillTickInterval,
                isFilling: () => this._isFilling,
                setFilling: (isFilling) => (this._isFilling = isFilling),
                onSetBlock: (blockLocation) => {
                    const { x, y, z } = blockLocation;
                    this._dimension.spawnParticle(ON_SET_BLOCK_PARTICLE, { x, y: y + 1, z });
                    this._player.playSound(ON_SET_BLOCK_SOUND);
                },
                onComplete: () => this._player.playSound(ON_COMPLETE_SOUND),
            });
        }
        catch (error) {
            console.error('Failed to fill blocks: ', error);
        }
    }
    /**
    * Stops the filling process.
    */
    fillStop() {
        if (this._isFilling)
            this._isFilling = false;
    }
    /**
    * Clears all filled blocks.
    * @returns {Promise<void>} A promise that resolves when all filled blocks have been cleared.
    */
    async clearFilledBlocks() {
        if (!this._filledBlockLocations.size)
            return;
        const SOUND = 'mob.wither.break_block';
        try {
            await clearBlocks(this._dimension, this.blocksToClear, 100);
            this._feedback.playSound(SOUND);
        }
        catch (error) {
            console.error(`Failed to clear filled blocks: `, error);
            this._feedback.error("Failed to clear blocks.");
        }
    }
    /**
    * Checks if the structure is fully filled.
    * @returns {boolean} `true` if the structure is fully filled, `false` otherwise.
    */
    isStructureFilled() {
        this._filledBlockLocations.clear();
        const { width, height, centerLocation } = this.structureProperties;
        try {
            applyToBlocks({ x: 1, y: 1, z: 1 }, (blockLocation) => {
                if (!isBlockAir(this._dimension, blockLocation))
                    this._filledBlockLocations.add(JSON.stringify(blockLocation));
            }, width - 1, height, centerLocation);
            return this._filledBlockLocations.size === this._airBlockLocations.size;
        }
        catch (error) {
            console.error(`Failed to check fill status: `, error);
            return false;
        }
    }
}
