exports.checkUser = (db, user, password, callback) => {
	db.all("SELECT 1 FROM USERS WHERE USERNAME=$user AND PASSWORD=$pwd", {$user: user, $pwd: password}, (err, allRows) => {	// Get the rows with the given username and password.
		if(err) {
			console.log('Error reading database.')
			return
		}

		// If the received array is empty, the combination of username and password is incorrect.
		// Otherwise. The user exists.
		callback(allRows.length != 0)
	})
}