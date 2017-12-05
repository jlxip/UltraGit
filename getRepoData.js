getRepoData = (db, name, callback) => {
	db.all("SELECT * FROM REPOS WHERE NAME=$name", {$name: name}, (err, rows) => {
		if(err) {
			console.log('Error reading database.')
			return
		}
		callback(rows)
	})
}

exports.getAnonRead = (db, name, callback) => {
	getRepoData(db, name, (rows) => {
		if(rows.length == 0) callback(false)
		else callback(rows[0].ANONREAD == 1)
	})
}