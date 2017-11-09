var dbconnection = require('./dbconnection.js')
var getUsers = require('./getUsers.js')
var getRepos = require('./getRepos.js')
var GitServer = require('git-server')
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
			getUsers.getUsers(this.db, (users) => {
				getRepos.getRepos(this.db, users, (repos) => {
					var opts = {
						repos: repos,
						port: port,
						repoLocation: reposPath,
						logging: true
					}

					new GitServer(opts)
				})
			})
		})
	}
}