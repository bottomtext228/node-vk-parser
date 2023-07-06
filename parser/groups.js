import { vk } from "../vkapi/index.js";
import { parse } from "../utils/parse.js";
import { splitArray } from "../utils/utils.js";
import { writeFileSync } from 'fs';
import { APILimits } from "../vkapi/limits.js";

export async function parseGroups(user, saveFolder) {

    let fileContent = '';
    const downloadGroupsFromResponse = async (response) => {
        const groupList = response.items;
        const chunks = splitArray(groupList, APILimits.GROUPS_GET_BY_ID);
        for (const chunk of chunks) {
            const groups = await vk.api.groups.getById({ group_ids: chunk });
            for (const group of groups) {
                fileContent += `${group.name} | https://vk.com/club${group.id}\n`;
            }
        }    
    }

    await parse(vk.api.groups.get, downloadGroupsFromResponse, { user_id: user.id, count: APILimits.GROUPS_GET });
    writeFileSync(saveFolder + '/groups.txt', fileContent);
}
