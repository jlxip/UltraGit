getPermissions = (db, user, repo, callback) => {
	db.all("SELECT LEVEL FROM PERMISSIONS WHERE USER=$user AND REPO=$repo", {$user: user, $repo: repo}, (err, row) => {
		if(err) {
			console.log('Error reading database.')
			return
		}
		if(row.length == 0) callback(0)
		else callback(row[0].LEVEL)
	})
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