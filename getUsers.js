exports.getUsers = (db, callback) => {
	Q = 'SELECT * FROM USERS'
	db.query(Q, function(err, recv) {
		users = []
		for(var i=0;i<recv.length;i++) {
			users.push({ username: recv[i].USERNAME , password: recv[i].PASSWORD })
		}
		callback(users)
	})
}