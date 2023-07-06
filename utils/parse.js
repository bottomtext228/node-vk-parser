
export async function parse(func, callback, funcArgs) {
    const response = await func(funcArgs);
    await callback(response);
    if (response.count > funcArgs.count) {
        let extraRequestsCount = Math.floor(response.count / funcArgs.count);
        for (let i = 0; i < extraRequestsCount; i++) {
            funcArgs.offset = funcArgs.count * (i + 1)
            await callback(await func(funcArgs));
        }
    }
}