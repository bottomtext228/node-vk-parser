import { vk } from "../vkapi/index.js";
import { parse } from "../utils/parse.js";
import { splitArray } from "../utils/utils.js";
import { writeFileSync } from 'fs';
import { APILimits } from "../vkapi/limits.js";

export async function parseFriends(userId, saveFolder) {
    let fileContent = '';

    const downloadFriendsFromResponse = async (response) => {
        const friendsList = response.items;
        const chunks = splitArray(friendsList, APILimits.USERS_GET);

        for (const chunk of chunks) {
            const friends = await vk.api.users.get({ user_ids: chunk });
            for (const friend of friends) {
                fileContent += `${friend.first_name} ${friend.last_name} | https://vk.com/id${friend.id}\n`;
            }
        }
    }

    await parse(vk.api.friends.get, downloadFriendsFromResponse, { user_id: userId, count: APILimits.FRIENDS_GET });
    writeFileSync(saveFolder + '/friends.txt', fileContent); 
}
