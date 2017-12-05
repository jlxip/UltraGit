getRepoData = (db, name, callback) => {	// A method to get the row of a given repository
	db.all("SELECT * FROM REPOS WHERE NAME=$name", {$name: name}, (err, rows) => {	// Select all the columns of the repository in REPOS.
		if(err) {
			console.log('Error reading database.')
			return
		}
		callback(rows)	// Return them. As an array (which should be either length 0 or 1). Each element contains the name and the AnonRead.
	})
}

exports.getAnonRead = (db, name, callback) => {	// A method to get the ANONREAD column of a given repository
	getRepoData(db, name, (rows) => {	// Get all the data (method above)
		if(rows.length == 0) callback(false)	// No row found? Then I assume it's not ANONREAD-able.
		else callback(rows[0].ANONREAD == 1)	// The repository will be ANONREAD-able if ANONREAD is 1. Otherwise, it's not.
	})
}