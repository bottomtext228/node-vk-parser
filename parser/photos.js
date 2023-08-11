import { parse } from "../utils/parse.js";
import { vk } from "../vkapi/index.js";
import { APILimits } from "../vkapi/limits.js";
import { mkdirSync } from 'fs';
import { downloadImageToUrl, extractFilename } from "../utils/utils.js";
import { utimes } from "utimes";

export async function parsePhotos(userId, saveFolder) {

    mkdirSync(saveFolder + '/photos/', { recursive: true });

    const promises = [];
    let image_id = 1;
    const downloadImagesFromResponse = async (response) => {
        // this function is called multiple times so we use `image_id` variable instead of the iterator from the `for` cycle
        for (const item of response.items) {
            const photo = item.sizes.sort((a, b) => (b.height + b.width) - (a.height + a.width))[0]; // get the biggest image
            
            promises.push(
                wrapper(downloadImageToUrl, [photo.url, `${saveFolder}/photos/${image_id}_${extractFilename(photo.url)}`, image_id],
                 item.date)
            );
            image_id++;
        }

    }
    await parse(vk.api.photos.getAll, downloadImagesFromResponse, { owner_id: userId, count: APILimits.PHOTOS_GET_ALL });
    await Promise.allSettled(promises); // wait until all photos are downloaded

    function wrapper(fn, args, date) {
        // if we call async function multiple times and use `.catch()` we can use a wrapper to know 
        // which function call throwed an exception
        // It's a bit messy to be honest
        return fn(...args).then(() => {
            utimes(args[1], {btime: date * 1e3}); // convert time from seconds to milliseconds
            // and set creation time of the photo when it's downloaded
        }).catch(error => {        
            // VK API can even return a photo, which is not available, so we will get a 404 error,
            // but there is nothing we can do with it
            

            // server sometimes would not respond or connection is reseted, so we try again
            if (error.message == 'TIMEOUT' || error.message == 'ECONNRESET') { 
                fn(...args).catch(e => { }); // try download once again without error handling 
            }

        }); 
    }

}
