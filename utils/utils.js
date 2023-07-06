import { vk } from "../vkapi/index.js";
import http from "http";
import https from "https";
import { createWriteStream } from "fs";


export function downloadImageToUrl(url, filename) {

    let client = http;
    if (url.toString().indexOf("https") === 0) {
        client = https;
    }
    return new Promise((resolve, reject) => {
        client.get(url, (res) => {
            res.pipe(createWriteStream(filename))
                .on('error', reject)
                .once('close', () => resolve(filename))
        })
    })
};

export function extractFilename(uri) {
    return uri.split('/').pop().split('#')[0].split('?')[0];
}


export function splitArray(array, chunkSize) {
    const arrays = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        const chunk = array.slice(i, i + chunkSize);
        arrays.push(chunk);
    }
    return arrays;
}

// maybe use https://negezor.github.io/vk-io/ru/guide/utils.html#resolveresource ?
export async function getUser(url) {
    /*
    works with account url and account short name/id 
    */
    const urlPath = url.substring(url.lastIndexOf('/') + 1);
    var userIdOrShortName;
    if (urlPath.startsWith('id')) {
        userIdOrShortName = urlPath.substring(2);
    }
    else {
        // user have short name 
        userIdOrShortName = urlPath;
    }

    const user = (await vk.api.users.get({ user_ids: [userIdOrShortName] }))[0];
    return user;
}
