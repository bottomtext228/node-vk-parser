
import { mkdirSync } from 'fs';
import { parseGroups } from './parser/groups.js';
import { parseFriends } from './parser/friends.js';
import { parsePhotos } from './parser/photos.js';
import { getUser } from './utils/utils.js';
import 'dotenv/config'
 






async function parseProfile(user) {
                      
    const saveFolder = `${process.argv[3] ? process.argv[3] + '/' : ''}${user.first_name} ${user.last_name} ${user.id}`;
    mkdirSync(saveFolder, {recursive: true});

    await Promise.all([parseFriends(user, saveFolder), parsePhotos(user, saveFolder), parseGroups(user, saveFolder)]);
}



async function run(profileUrl) {
    const user = await getUser(profileUrl);
    if (!user) {
        console.error(`\x1b[31mError:\x1b[0m User (${profileUrl}) is not found!`);
        return;
    }
    
    console.log(`Parsing user (ID: ${user.id}, ${user.first_name} ${user.last_name}).`);
    await parseProfile(user);
    console.log(`\x1b[32mSuccess.\x1b[0m`);
}

run(process.argv[2]).catch(console.log);


