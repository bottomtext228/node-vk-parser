# node-vk-parser
Parses data from [Vkontakte](https://vk.com) user's profile:
* Friends
* Groups
* Photos

# Usage 
VK API requires token to use most part of the API. You can get it [here](https://vkhost.github.io).
To get non-expiring token don't choose `vk.com` app.


Download source code and dependencies:
```console
git clone https://github.com/bottomtext228/node-vk-parser.git
cd node-vk-parser
npm i
```
Configure environment variables(VK API token):
```console
echo VK_API_TOKEN=token > .env 
```
Or create file `.env` in the folder and put your token there in the same format `VK_API_TOKEN=token`

Run:
```console
node index.js <user> <savepath>
```
where `<user>` can be URL or user id or short username.
Example: for account `https://vk.com/durov` you can use `https://vk.com/durov`, `durov`, `https://vk.com/id1`, `1`.


# Docker example usage

Build a container:

* from GitHub:
```console
docker build -t node-vk-parser github.com/bottomtext228/node-vk-parser.git#main
```

* from local sourses:
```console
docker build -t node-vk-parser .
```

Create a folder to save data from the parser.


Configure environment variables:
```console
echo VK_API_TOKEN=token > .env
```

To run the parser for user `https://vk.com/durov` and to save data in `C:\dockertest` the command would be:
```console
docker run --env-file ./.env -v c:/dockertest/:/app/parses/ node-vk-parser node index.js durov parses/
```

# Requirements
* Node
* npm