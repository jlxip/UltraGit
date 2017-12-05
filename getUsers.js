// TODO: Improve this. A lot.
exports.getUsers = (db, callback) => {	// A method to get all the users
	db.all("SELECT * FROM USERS", (err, allRows) => {	// Get all users.
		if(err) {
			console.log('Error reading database.')
			return
		}
		callback(allRows)	// Return an array with all users (username, password)
	})
}