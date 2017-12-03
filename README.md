# UltraGit
> The easiest way to create an uncomplicated private or public git server, that's up to you.

[![Npm Version](https://img.shields.io/npm/v/ultragit.svg)](https://www.npmjs.com/package/ultragit)
![Dependencies](https://david-dm.org/jlxip/UltraGit.svg)

> UltraGit is a fast and easy to deploy git server written in Node.js. It uses MariaDB as database to store the users information and permissions.

## Install
```
npm install ultragit
```

## Usage
First, create a new MariaDB database with the name you want, and leave it empty.<br>
Then, it's as easy as this:

```javascript
const rugs = require('ultragit')

const ugs = new rugs.UltraGitServer()
const DB_IP = 'localhost'
const DB_USER = 'root'
const DB_PWD = 'password'
const DB_NAME = 'GIT'
const REPOS_PATH = '/opt/GIT/repos'
const PORT = 1221

ugs.dbconnect(DB_IP, DB_USER, DB_PWD, DB_NAME, () => {
    ugs.init(REPOS_PATH, PORT, () => {
      console.log('UltraGit running at http://localhost:' + PORT)
    })
})
```

Finally, run it, and you're ready to go.
```
node index.js
```

## Thanks
Thanks to [this amazing project](https://github.com/gabrielcsapo/node-git-server) by [gabrielcsapo](https://github.com/gabrielcsapo).
