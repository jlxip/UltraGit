var dbconnection = require('./dbconnection.js')
var getUsers = require('./getUsers.js')
var getRepoData = require('./getRepoData.js')
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

	login(user, next) {
		user((username, password) => {
			getUsers.getUsers(this.db, (users) => {
				var result = false

				for(var i=0;i<users.length;++i) {
					if(users[i].USERNAME == username && users[i].PASSWORD == password) {
						result = true
						break
					}
				}

				next(username, result)
			})
		})
	}

	init(dbname, reposPath, port, callback) {
		this.dbconnect(dbname, () => {
			this.reposPath = reposPath
			this.checkReposPath(() => {
				const repos = new Server(reposPath, {
					autoCreate: false,
					authenticate: (type, repo, user, next) => {
						if(type == 'push') {	// Push
							this.login(user, (username, loginResult) => {
								if(loginResult) {
									getPermissions.isWritable(this.db, username, repo, (r) => {
										if(r) next();
										else next('You have not writing permissions on this repo.');
									})
								} else {
									next('Invalid username or password.')
								}
							})
						} else {	// Fetch
							getRepoData.getAnonRead(this.db, repo, (anonRead) => {
								if(anonRead) {
									next()
								} else {
									this.login(user, (username, loginResult) => {
										if(loginResult) {
											getPermissions.isReadable(this.db, username, repo, (r) => {
												if(r) next();
												else next('You have not reading permissions on this repo.')
											})
										} else {
											next('Invalid username or password.')
										}
									})
								}
							})
						}
					}
				})

				repos.listen(port, callback)
			})
		})
	}
}