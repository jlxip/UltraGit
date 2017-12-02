exports.getRepoData = (db, name, callback) => {
	Q = 'SELECT * FROM REPOS WHERE NAME=:name'
	db.query(Q, {name: name}, function(err, repo) {
		if (err) throw err;	// Nani?!
		callback(repo)
	});
}