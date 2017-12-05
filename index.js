var dbconnection = require('./dbconnection.js')	// For connecting to the database.
var checkUser = require('./checkUser.js')	// For checking users in the database.
var getRepoData = require('./getRepoData.js')	// For getting the data of a given repository.
var getPermissions = require('./getPermissions.js')	// For getting permissions.
var Server = require('node-git-server')	// The package this one is based on.
var fs = require('fs')	// To manage the directory which contains the repositories.

exports.UltraGitServer = class {	// A classy class.
	constructor() {	// Declare some 'global' variables.
		this.db = null
		this.reposPath = null
	}

	dbconnect(dbname, callback) {	// Connect to the database.
		dbconnection.dbconnect(dbname, (db) => {	// Call the method in dbconnection.js
			this.db = db	// Set the variable 'db' to the received one.
			callback()	// Go back.
		})
	}

	checkReposPath(callback) {	// Check if the directory which contains the repositories exist.
		fs.exists(this.reposPath, (r) => {	// Does it exist?
			if(r) {	// It exists.
				callback()	// Go back.
			} else {	// It doesn't exist.
				fs.mkdir(this.reposPath, (err) => {	// Created
					if(err) console.log('The path could not be created. Check your writing permissions.')
					else callback()	// Go back.
				})
			}
		})
	}

	login(user, next) {	// A method for asking the client to log in.
		user((username, password) => {	// Log in, client. And give me your username and password.
			checkUser.checkUser(this.db, username, password, (result) => {	// Does the user exist?
				next(username, result)	// Yes. Correct combination of username and password.
			})
		})
	}

	init(dbname, reposPath, port, callback) {	// Let the magic begin.
		this.dbconnect(dbname, () => {	// Connect to the database.
			this.reposPath = reposPath	// Set the reposPath variable to the given one.
			this.checkReposPath(() => {	// Check if it exists. Otherwise, create it.
				const repos = new Server(reposPath, {	// Create the git server
					autoCreate: false,	// Do NOT automatically create repositories.
					authenticate: (type, repo, user, next) => {	// When an user connects to a repository.
						if(type == 'push') {	// Push
							this.login(user, (username, loginResult) => {	// Does the username exist?
								if(loginResult) {	// Yep.
									getPermissions.isWritable(this.db, username, repo, (r) => {	// Can the user push?
										if(r) next();	// Yes.
										else next('You have not writing permissions on this repo.');
									})
								} else {	// Doesn't look like it.
									next('Invalid username or password.')
								}
							})
						} else {	// Fetch (clone)
							getRepoData.getAnonRead(this.db, repo, (anonRead) => {	// Can the repository be cloned by anone?
								if(anonRead) {	// Yep.
									next()	// Everything's fine. No need to log in.
								} else {	// Nop.
									this.login(user, (username, loginResult) => {	// Make the client enter username and password.
										if(loginResult) {	// The user exists.
											getPermissions.isReadable(this.db, username, repo, (r) => {	// Can the user clone?
												if(r) next();	// Yes.
												else next('You have not reading permissions on this repo.')
											})
										} else {	// The user does not exist.
											next('Invalid username or password.')
										}
									})
								}
							})
						}
					}
				})

				repos.listen(port, callback)	// Start listening. Maybe someone knocks the door.
			})
		})
	}
}