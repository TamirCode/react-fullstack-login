// npm i express cors express-session mysql

const exp = require("express")
const cors = require("cors")
const session = require("express-session")
const SQL = require("./dbconfig")

const app = exp()

app.use(exp.json())

app.use(cors({
	origin: "http://localhost:3000",
	credentials: true
}))

app.use(session({
	secret: "blah",
	name: "ts3",
	saveUninitialized: true,
	resave: false,
	cookie: { maxAge: 1000 * 60 * 60 * 24 }
}))

/*
const res = await fetch("http://localhost:1000/register", {
	method: "post",
	headers: {"content-type": "application/json"},
	body: JSON.stringify({ username, password }),
	credentials: "include"
})
*/
app.post("/register", async (req, res) => {
	const { username, password } = req.body

	if (!username || !password) {
		return res.status(400).send({ err: "Missing info (username, password)", code: "missing" })
	}

	try {
		await SQL(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, password])

		return res.send({ msg: "Account created successfully." })
	} catch (err) {
		if (err.code === "ER_DUP_ENTRY") {
			return res.status(409).send({ err: "Username already taken.", code: "taken" })
		}
		console.log(err)
		return res.status(500).send({ err: err.sqlMessage, code: err.code })
	}
})

/*
const res = await fetch("http://localhost:1000/login", {
	method: "post",
	headers: {"content-type": "application/json"},
	body: JSON.stringify({ username, password }),
	credentials: "include"
})
*/
app.post("/login", async (req, res) => {
	const { username, password } = req.body

	if (!username || !password) {
		return res.status(400).send({ err: "Missing info (username, password)", code: "missing" })
	}

	try {
		const query = await SQL(`SELECT * FROM users WHERE username = ?`, username)

		if (!query.length) {
			return res.status(404).send({ err: "Username doesn't exist", code: "doesnt_exist" })
		}

		if (query[0].password != password) {
			return res.status(422).send({ err: "Wrong password", code: "wrong_pass" })
		}

		// exclude password
		let { role, date_created } = query[0]

		req.session.user = { username, role, date_created }

		return res.send({ msg: "Logged in successfully.", username })

	} catch (err) {
		console.log(err)
		return res.status(500).send({ err: err.sqlMessage, code: err.code })
	}
})

// const res = await fetch("http://localhost:1000/loggedin", { credentials: "include" })
app.get("/loggedin", async (req, res) => {
	if (req.session.user) {
		// update user data
		try {
			let query = await SQL(`
				SELECT username, role, date_created
				FROM users WHERE username = ?
			`, req.session.user.username)

			if (!query.length) {
				req.session.destroy()
				return res.send({ err: "user not found, destroyed session.", code: "user_not_found" })
			}

			req.session.user = { ...query[0] }
			
			res.send({
				loggedIn: true,
				...req.session.user
			})
		} catch (err) {
			return res.status(500).send({ err: err.sqlMessage, code: err.code })
		}
	} else {
		res.send({
			loggedIn: false,
		})
	}
})

/*
const res = await fetch("http://localhost:1000/logout", {
	method: "post",
	credentials: "include"
})
*/
app.post("/logout", (req, res) => {
	if (!req.session.user) {
		return res.status(401).send({ err: "must be logged" })
	}
	req.session.destroy()
	res.send({ msg: "Logged out successfully." })
})


app.listen(1000, () => console.log("localhost:1000"))