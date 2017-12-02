var dbconnection = require('./dbconnection.js')
var getUsers = require('./getUsers.js')
var getRepos = require('./getRepos.js')
var Server = require('node-git-server')
var fs = require('fs')

exports.UltraGitServer = class {
	constructor() {
		this.db = null
		this.reposPath = null
	}

	dbconnect(host, user, password, dbname, callback) {
		dbconnection.dbconnect(host, user, password, dbname, (db) => {
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

	init(reposPath, port, callback) {
		this.reposPath = reposPath
		this.checkReposPath(() => {
			const repos = new Server(reposPath, {
				autoCreate: false,
				authenticate: (type, repo, user, pwd, next) => {
					console.log(type)
					return new Promise((resolve, reject) => {
						getUsers.getUsers(this.db, (users) => {
							var gotit = false
							for(var i=0;i<users.length;++i) {
								if(users[i].user == user && users[i].pwd == pwd) {
									gotit = true
								}
							}
	
							if(gotit) {
								console.log(user+':'+pwd+' is doing '+type+' on '+repo) // DEBUG
								return resolve()
							}
							return reject('Invalid username or password.')
						})
					})
				}
			})

			repos.on('push', (push) => {
				console.log('Doing push')
				push.accept()
			})

			repos.on('fetch', (fetch) => {
				console.log('Doing fetch')
				fetch.accept()
			})

			repos.listen(port, () => {
				console.log(`Starting server at http://localhost:${port}`)
			})
			/*getUsers.getUsers(this.db, (users) => {
				getRepos.getRepos(this.db, users, (repos) => {
					var opts = {
						repos: repos,
						port: port,
						repoLocation: reposPath,
						logging: true
					}

					new GitServer(opts)
				})
			})*/
		})
	}
}