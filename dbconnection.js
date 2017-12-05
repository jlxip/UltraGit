// For connecting to the database (sqlite3)

const sqlite3 = require('sqlite3')

exports.dbconnect = (dbname, callback) => {
	const db = new sqlite3.Database(dbname)	// Connect to the database or create one if necessary
	checkTables(db, () => {	// Check if the database is ready to be used.
		callback(db)	// All set. Keep going.
	})
}

checkTables = (db, callback) => {	// Is the database OK?
	db.all("SELECT 1 FROM sqlite_master WHERE type='table' AND name='REPOS'", (err, allRows) => {	// Does 'REPOS' table exist?
		if(err) {
			console.log('Error reading database.')
			return
		}
		if(allRows.length == 0) createTables(db, callback)	// It doesn't exist. Create all tables.
		else callback()
	})
}

createTables = (db, callback) => {	// Create the necessary tables for the program to work.
	db.serialize(() => {	// Wait until all the tables are created.
		/*
		HOW THE DATABASE IS STRUCTURED
		
		- REPOS
		-- NAME (text, primary key) - Name of the repository.
		-- ANONREAD (int, default: 0) - Can the repository be cloned by a non-logged in user?
		--- 0: No. Private.
		--- 1: Yes. Public.
		
		- USERS
		-- USERNAME (text, primary key)
		-- PASSWORD (text) - in plain text. I know.
		
		- PERMISSIONS
		-- ID (int, primary key, autoincrement)
		-- USER (text) - The user who the permission is assigned to.
		-- REPO (text) - The repository (context of the permission).
		-- LEVEL (int, default: 1) - The permission level.
		--- 0: No access at all.
		--- 1: Read access (clone)
		--- 2: Write access (push)
		*/
		Q = [
			"CREATE TABLE `PERMISSIONS` (`ID` INTEGER PRIMARY KEY AUTOINCREMENT, `USER` TEXT, `REPO` TEXT, `LEVEL` INT DEFAULT '1')",
			"CREATE TABLE `REPOS` (`NAME` TEXT PRIMARY KEY, `ANONREAD` INT DEFAULT '0')",
			"CREATE TABLE `USERS` (`USERNAME` TEXT PRIMARY KEY, `PASSWORD` TEXT)"
			]

		for(var i=0;i<Q.length;++i) db.run(Q[i])	// Run every statement
	})

	callback()	// Go back.
}