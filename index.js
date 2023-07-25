import 'dotenv/config';
import { mkdirSync } from 'fs';
import { parseGroups } from './parser/groups.js';
import { parseFriends } from './parser/friends.js';
import { parsePhotos } from './parser/photos.js';
import { getUser, printError, isProfileCanBeParsed, printAndOverwrite } from './utils/utils.js';


async function run(profileUrl) {

    let user;
    try { // here goes the first API request, so we can check the VK API token 
        user = await getUser(profileUrl);
    } catch (error) {
        if (error.code == 5 || error.code == 1116) {
            printError('Invalid VK API token! You can get token here: https://vkhost.github.io');
        }
        return false;
    }

    if (!user) {
        printError(`User (${profileUrl}) is not found!`);
        return;
    }

    if (!isProfileCanBeParsed(user)) {
        printError(`User (ID: ${user.id}, ${user.first_name} ${user.last_name}) is blocked or cannot be accessed!`);
        return;
    }

    // `PATH/Name Surname Id`
    const saveFolder = `${process.argv[3] ? process.argv[3] + '/' : ''}${user.first_name} ${user.last_name} ${user.id}`;
    mkdirSync(saveFolder, { recursive: true });

    console.log(`Parsing user (ID: ${user.id}, ${user.first_name} ${user.last_name}).`);

    printAndOverwrite('Parsing groups...');
    await parseGroups(user.id, saveFolder);

    printAndOverwrite('Parsing friends...');
    await parseFriends(user.id, saveFolder);

    printAndOverwrite('Parsing photos...');
    await parsePhotos(user.id, saveFolder);

    printAndOverwrite(`\x1b[32mSuccess.\x1b[0m`);

}


run(process.argv[2]).catch(console.log);
