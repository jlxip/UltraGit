exports.getUsers = (db, callback) => {
	db.all("SELECT * FROM USERS", (err, allRows) => {
		if(err) {
			console.log('Error reading database.')
			return
		}
		callback(allRows)
	})
}