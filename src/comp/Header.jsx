import { Link } from "react-router-dom"
import Button from '@mui/material/Button'

const button_sx = {
	color: "white",
	fontSize: "17px",
	"&:hover": {
		backgroundColor: '#1b80e3',
	}
}

export default function Header({ setUpdate, loggedIn, currentUser }) {

	async function logout() {
		const res = await fetch("http://localhost:1000/logout/", {
			method: "post",
			credentials: "include"
		})

		const data = await res.json()

		if (data.err) {
			console.log(data.err)
		} else {
			console.log(data.msg)
		}

		setUpdate(prev => !prev)
	}

	return (
		<header>
			{
				loggedIn
					?
					// LOGGED IN
					<nav>
						{/* <Link to="/">Home</Link> */}
						<Button component={Link} to="/" variant="text" sx={button_sx}>Home</Button>
						{currentUser.role === "admin" && <Button component={Link} to="/admin" variant="text" sx={button_sx}>Admin Page</Button>
						}
						<Button onClick={logout} variant="contained" sx={button_sx}>Logout ({currentUser.username})</Button>
					</nav>
					:
					// NOT LOGGED IN
					<nav>
						<Button component={Link} to="/register" variant="text" sx={button_sx}>Register</Button>
						<Button component={Link} to="/login" variant="text" sx={button_sx}>Login</Button>
					</nav>
			}
		</header>
	)
}