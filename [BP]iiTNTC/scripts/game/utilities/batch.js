import { system } from "@minecraft/server";
/**
* process an array of items in batches.
* @template T the type of items to be processed
* @template R the type of the results after processing an item.
* @param {T[]} items the array of items to process.
* @param {number} batchSize the size of each batch.
* @param {(item: T) => Promise<R> | R} processItem the function to process each item.
* @param {Object} [options] an object containing options for the batch processing.
* @param {number} [options.delayInTicks] the delay in ticks between each batch.
* @param {() => boolean} [options.shouldContinue] a function that returns whether the batch processing should continue.
* @param {(batchResults?: R[], batchNumber?: number, totalBatches?: number) => void} [options.onBatchComplete]  a function that is called when a batch is complete.
* @param {(results: R[]) => void} [options.onComplete] a function that is called when the batch processing is complete.
* @returns {Promise<R[]>} a promise that resolves with the results of processing each item.
*/
export async function batch(items, batchSize, processItem, options = {}) {
    const results = [];
    const totalBatches = Math.ceil(items.length / batchSize);
    for (let i = 0; i < items.length; i += batchSize) {
        if (options.shouldContinue && !options.shouldContinue())
            break;
        const batch = items.slice(i, i + batchSize);
        try {
            const batchResults = await Promise.all(batch.map(processItem));
            results.push(...batchResults);
            if (options.onBatchComplete) {
                options.onBatchComplete(batchResults, Math.floor(i / batchSize) + 1, totalBatches);
            }
        }
        catch (error) {
            console.error(error);
        }
        if (options.delayInTicks && (i + batchSize) < items.length) {
            await new Promise(resolve => {
                system.runTimeout(() => resolve(), options.delayInTicks);
            });
        }
    }
    if (options.onComplete && (results.length === items.length))
        options.onComplete(results);
    return results;
}
