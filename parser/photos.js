import { parse } from "../utils/parse.js";
import { vk } from "../vkapi/index.js";
import { mkdirSync } from 'fs';
import { downloadImageToUrl, extractFilename } from "../utils/utils.js";

export async function parsePhotos(user, saveFolder) {

    mkdirSync(saveFolder + '/photos/', { recursive: true });
    let image_id = 1;

    const downloadImagesFromResponse = (response) => {
        for (let i in response.items) {
            const item = response.items[i];
            const photo = item.sizes.sort((a, b) => (b.height + b.width) - (a.height + a.width))[0];
            downloadImageToUrl(photo.url, `${saveFolder}/photos/${image_id}_${extractFilename(photo.url)}`);
            image_id++;
        }
    }

    parse(vk.api.photos.getAll, downloadImagesFromResponse, { owner_id: user.id, count: 200 });
}
