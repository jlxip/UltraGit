# UltraGit
_The easiest way to create an uncomplicated private git server._
<br><br>
UltraGit is a package written in nodejs thanks to [this amazing project](https://github.com/gabrielcsapo/node-git-server) by [gabrielcsapo](https://github.com/gabrielcsapo).
<br><br>
UltraGit is a fast and easy to deploy git server. It uses MariaDB as database to store the users information and permissions.

## Install
```
npm install ultragit
```

## Usage
First, create a new MariaDB database with the name you want, and leave it empty.<br>
Then, it's as easy as this:<br>
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
Finally, run it, and you're ready to go.<br>
```
node index.js
```
