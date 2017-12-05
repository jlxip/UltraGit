// The permissions levels are explained in dbconnection.js
getPermissions = (db, user, repo, callback) => {	// A method to get the permission level of an user in a given repo.
	db.all("SELECT LEVEL FROM PERMISSIONS WHERE USER=$user AND REPO=$repo", {$user: user, $repo: repo}, (err, row) => {	// Give me the level.
		if(err) {
			console.log('Error reading database.')
			return
		}
		if(row.length == 0) callback(0)	// No rows? Then I assume the level is 0.
		else callback(row[0].LEVEL)	// A row? Well, the level will be LEVEL.
	})
}

exports.isReadable = (db, user, repo, callback) => {	// A method to know whether a repo is readable by an user.
	getPermissions(db, user, repo, (r) => {	// Call the method above.
		callback(r > 0)	// The repository will be readable if the level is greater than 0.
	})
}

exports.isWritable = (db, user, repo, callback) => {
	getPermissions(db, user, repo, (r) => {	// Call the method above.
		callback(r > 1)	// The repository will be writable if the level is greater than 1.
	})
}