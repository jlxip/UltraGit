const sqlite3 = require('sqlite3')
const async = require('async')

exports.dbconnect = (dbname, callback) => {
	const db = new sqlite3.Database(dbname)
	checkTables(db, () => {
		callback(db)
	})
}

checkTables = (db, callback) => {
	db.all("SELECT 1 FROM sqlite_master WHERE type='table' AND name='REPOS'", (err, allRows) => {
		if(err) {
			console.log('Error reading database.')
			return
		}
		if(allRows.length == 0) createTables(db, callback)
		else callback()
	})
}

createTables = (db, callback) => {
	db.serialize(() => {
		Q = [
			"CREATE TABLE `PERMISSIONS` (`ID` INTEGER PRIMARY KEY AUTOINCREMENT, `USER` TEXT, `REPO` TEXT, `LEVEL` INT DEFAULT '1')",
			"CREATE TABLE `REPOS` (`NAME` TEXT PRIMARY KEY, `ANONREAD` INT DEFAULT '0')",
			"CREATE TABLE `USERS` (`USERNAME` TEXT PRIMARY KEY, `PASSWORD` TEXT)"
			]

		for(var i=0;i<Q.length;++i) db.run(Q[i])
	})

	callback()
}