import { VK } from 'vk-io';

const vk = new VK({
    token: process.env.VK_API_TOKEN
});

export {vk}

