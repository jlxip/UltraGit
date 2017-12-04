var dbconnection = require('./dbconnection.js')
var getUsers = require('./getUsers.js')
// FUTURE: var getRepoData = require('./getRepoData.js')
var getPermissions = require('./getPermissions.js')
var Server = require('node-git-server')
var fs = require('fs')

exports.UltraGitServer = class {
	constructor() {
		this.db = null
		this.reposPath = null
	}

	dbconnect(dbname, callback) {
		dbconnection.dbconnect(dbname, (db) => {
			this.db = db
			callback()
		})
	}

	checkReposPath(callback) {
		fs.exists(this.reposPath, (r) => {
			if(r) {
				callback()
			} else {
				fs.mkdir(this.reposPath, (err) => {
					if(err) console.log('The path could not be created.')
					else callback()
				})
			}
		})
	}

	init(dbname, reposPath, port, callback) {
		this.dbconnect(dbname, () => {
			this.reposPath = reposPath
			this.checkReposPath(() => {
				const repos = new Server(reposPath, {
					autoCreate: false,
					authenticate: (type, repo, user, pwd, next) => {
						return new Promise((resolve, reject) => {
							getUsers.getUsers(this.db, (users) => {
								for(var i=0;i<users.length;++i) {
									if(users[i].USERNAME == user && users[i].PASSWORD == pwd) {
										return resolve()
									}
								}

								return reject('Invalid username or password.')
							})
						})
					}
				})

				repos.on('fetch', (fetch) => {
					getPermissions.isReadable(this.db, fetch.username, fetch.repo, (r) => {
						if(r) fetch.accept()
						else fetch.reject()	// This prints in the client-side an awful error.
					})
				})

				repos.on('push', (push) => {
					getPermissions.isWritable(this.db, push.username, push.repo, (r) => {
						if(r) push.accept()
						else push.reject()
					})
				})

				repos.listen(port, callback)
			})
		})
	}
}