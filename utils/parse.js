
/**
 * Allows to parse all data from VK API requests with `offset` param.
 * `funcArgs` should have `count` property.
 * @param {Function} vkApiFunction VK API request function with `offset` param. 
 * @param {Function} callback Async function which will be called each time when `vkApiFunction` function will give response.
 * @param {Object} funcArgs  Arguments to call `vkApiFunction`. Should have `count` property.
 */
export async function parse(vkApiFunction, callback, funcArgs) {
    const response = await vkApiFunction(funcArgs);
    await callback(response);
    if (response.count > funcArgs.count) { // if we need more requests to get all data
        let extraRequestsCount = Math.floor(response.count / funcArgs.count);
        for (let i = 0; i < extraRequestsCount; i++) {
            funcArgs.offset = funcArgs.count * (i + 1)
            await callback(await vkApiFunction(funcArgs));
        }
    }
}