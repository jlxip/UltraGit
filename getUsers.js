exports.getUsers = (db, callback) => {
	Q = 'SELECT * FROM USERS'
	db.query(Q, function(err, recv) {
		users = []
		for(var i=0;i<recv.length;i++) {
			users.push({ user: recv[i].USERNAME , pwd: recv[i].PASSWORD })
		}
		callback(users)
	})
}