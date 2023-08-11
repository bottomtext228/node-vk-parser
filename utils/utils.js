import { vk } from "../vkapi/index.js";
import http from "http";
import https from "https";
import { createWriteStream } from "fs";

/**
 * @param {String} url URL of the image to download.
 * @param {String} fullPath Full path of the downloaded file. 
 * @returns {Promise<String>} Promise resolved when the file is downloaded and rejected on error.
 */
export function downloadImageToUrl(url, filepath) {
    let client = http;
    if (url.toString().indexOf("https") === 0) {
        client = https;
    }
    return new Promise((resolve, reject) => {
        const request = client.get(url, (res) => { 
            
            if (res.statusCode === 200) {
                res.pipe(createWriteStream(filepath))
                    .on('error', reject)
                    .once('close', () => resolve(filepath));
            } else {
                // Consume response data to free up memory
                res.resume();
                reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));

            }
        });
        request.setTimeout(60e3, () => reject(new Error('TIMEOUT')));
        request.on('error', (error) => {
            reject(new Error(error.code));
        });
    });
}

/**
 * Extracts filename from URL. 
 * Example: `httpl://url.com/image.jpg?size=1280x720` will return `image.jpg`.
 * @param {String} url
 * @returns {String} Filename.
 */
export function extractFilename(url) {
    return url.split('/').pop().split('#')[0].split('?')[0];
}

/**
 * 
 * @param {Array} array Array to split.
 * @param {Number} chunkSize The size of the arrays by which the `array` would be splitted.
 * @returns {Array<Array<any>>} Array with arrays.
 */
export function splitArray(array, chunkSize) {
    const arrays = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        const chunk = array.slice(i, i + chunkSize);
        arrays.push(chunk);
    }
    return arrays;
}

/**
 * Checks if profile is can be accessed by current user and not deactivated/blocked/etc.
 * @param {Object} user VK user object.
 * @returns {Boolean} true if vk profile can be parsed or false.
 */
export function isProfileCanBeParsed(user) {
    return (user.can_access_closed && !user.deactivated);
}

/**
 * @param {String} url VK user page or account short name/id.
 * @returns {Promise<object>} Promise with a VK user object.
 */
export async function getUser(url) {
  
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

/**
 * Prints message with console.error in format `ERROR: message` where `ERROR:` is highlighted in red.
 * @param {String} message Message to print.
 */

export function printError(message) {
    console.error(`\x1b[31mError:\x1b[0m %s`, message);
}

/**
 * Prints message without trailing a new line and overwrites the last message sended by this function.
 * @param {String} message Message to print. 
 */
export function printAndOverwrite(message) {
    process.stdout.write(`\x1b[0G${message.padEnd(100)}`);
}

