getPermissions = (db, user, repo, callback) => {
	Q = 'SELECT LEVEL FROM PERMISSIONS WHERE USER=:user AND REPO=:repo'
	db.query(Q, {user: user, repo: repo}, function(err, recv) {
		if (err) throw err;
		if(recv.length == 0) {
			callback(0)
		} else {
			callback(recv[0].LEVEL)
		}
	});
}

exports.isReadable = (db, user, repo, callback) => {
	getPermissions(db, user, repo, (r) => {
		callback(r > 0)
	})
}

exports.isWritable = (db, user, repo, callback) => {
	getPermissions(db, user, repo, (r) => {
		callback(r > 1)
	})
}