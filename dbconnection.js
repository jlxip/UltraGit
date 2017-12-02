var Client = require('mariasql');
const async = require('async')

exports.dbconnect = (host, user, password, dbname, callback) => {
	var c = new Client({
		host: host,
		user: user,
		password: password,
		db: dbname
	})
	checkTables(c, () => {
		callback(c)
	})
}

checkTables = (db, callback) => {
	Q = 'SELECT 1 FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = \'REPOS\''
	db.query(Q, function(err, recv) {
		if(recv.info.numRows == 0) {
			createTables(db, () => {
				console.log('DB initialized.')
				callback()
			})
		} else callback()
	})
}

createTables = (db, callback) => {
	Q = [
	"CREATE TABLE `PERMISSIONS` (`ID` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY, `USER` varchar(32) NOT NULL, `REPO` varchar(128) NOT NULL, `P_READ` int(11) NOT NULL DEFAULT '0', `P_WRITE` int(11) NOT NULL DEFAULT '0') ENGINE=InnoDB DEFAULT CHARSET=utf8",
	"CREATE TABLE `REPOS` (`NAME` varchar(128) CHARACTER SET utf8 NOT NULL PRIMARY KEY) ENGINE=InnoDB DEFAULT CHARSET=utf8",
	"CREATE TABLE `USERS` (`USERNAME` varchar(32) CHARACTER SET utf8 NOT NULL PRIMARY KEY, `PASSWORD` varchar(128) CHARACTER SET utf8 NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8"
	]

	async.forEachOf(Q, (dataElement, i, inner_callback) => {
		db.query(dataElement, inner_callback)
	}, () => {
		callback()
	})
}