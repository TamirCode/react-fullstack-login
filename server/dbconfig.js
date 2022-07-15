const mysql = require("mysql")
const util = require('util')

const con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "newproject123"
})

con.connect(err => {
	if (err) {
		return console.log(err)
	}
	console.log("connected to mysql server")
})

// change con.query to async await syntax
const SQL = util.promisify(con.query).bind(con)

module.exports = SQL