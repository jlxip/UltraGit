const async = require('async')

exports.getRepos = (db, users, callback) => {
	Q = 'SELECT NAME FROM REPOS'
	db.query(Q, function(err, repos) {
		if (err) throw err;	// Nani?!

		var returnRepos = []
		async.forEachOf(repos, (dataElement, i, inner_callback) => {
			Q = 'SELECT USER, P_READ, P_WRITE FROM PERMISSIONS WHERE REPO=:repo'
			db.query(Q, {repo: dataElement.NAME}, (err, rows) => {
				var thisRepo = {}
				thisRepo.anonRead = false	// Let the user choose this
				thisRepo.users = []
				thisRepo.name = dataElement.NAME

				for(var j=0;j<rows.length;j++) {
					var thisUser = {}
					for(var k=0;k<users.length;k++) {
						if(users[k].username == rows[j].USER) {
							thisUser.user = users[k]
							break
						}
					}
					thisUser.permissions = []
					if(rows[j].P_READ == 1) thisUser.permissions.push('R')
					if(rows[j].P_WRITE == 1) thisUser.permissions.push('W')

					thisRepo.users.push(thisUser)
				}

				returnRepos.push(thisRepo)
				inner_callback()
			})
		}, () => {
			callback(returnRepos)
		})
	});
}