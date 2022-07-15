import { useRef, useState } from "react"
import { TextField, Button, IconButton, InputAdornment } from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material"

export default function PageRegister({ setUpdate, domain }) {

	const [inputValues, setInputValues] = useState({ username: "", password: "", confirmPassword: "" })
	const [inputErrors, setInputErrors] = useState({ username: "", password: "", confirmPassword: "" })
	const inputRefs = { username: useRef(null), password: useRef(null), confirmPassword: useRef(null) }
	const [infoMsg, setInfoMsg] = useState({ color: "blue", msg: "" })
	const [showPassword, setShowPassword] = useState(false)

	function inputChange(e, input) {
		setInputValues(prev => {
			prev[input] = e.target.value
			return prev
		})
		setInputErrors(prev => ({ ...prev, [input]: "" }))
	}

	function submit(e) {
		e.preventDefault()
		let firstError = [] // indices of useRef list to determine first invalid input and focus() it
		let inputErrorsTemp = { username: false, password: false, confirmPassword: false }

		if (!inputValues.username.length) {
			firstError.push("username")
			inputErrorsTemp.username = "This field is required"
		} else if (!/^\w+$/.test(inputValues.username)) {
			firstError.push("username")
			inputErrorsTemp.username = "Allowed characters: a-z, 1-9, and underscore."
		}

		if (!inputValues.password.length) {
			firstError.push("password")
			inputErrorsTemp.password = "This field is required"
		} else if (!/^\w+$/.test(inputValues.password)) {
			firstError.push("password")
			inputErrorsTemp.password = "Allowed characters: a-z, 1-9, and underscore."
		}

		if (!inputValues.confirmPassword.length) {
			firstError.push("confirmPassword")
			inputErrorsTemp.confirmPassword = "This field is required"
		} else if (inputValues.confirmPassword !== inputValues.password) {
			firstError.push("confirmPassword")
			inputErrorsTemp.confirmPassword = "Passwords do not match."
		}

		setInputErrors(inputErrorsTemp)

		if (firstError.length) {
			// focus() on first input with error
			inputRefs[firstError[0]].current.focus()
		} else {
			// validation test passed
			submitFetch()
		}
	}

	async function submitFetch() {
		try {
			const res = await fetch(domain + "/register/", {
				method: "post",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({
					username: inputValues.username,
					password: inputValues.password
				}),
				credentials: "include"
			})

			const data = await res.json()

			if (data.err) {
				if (data.code === "taken") {
					setInputErrors(prev => ({ ...prev, username: "Username already taken" }))
					inputRefs.username.current.focus()
				}
			} else {
				setInfoMsg({ color: "green", msg: `${data.msg}` })
			}

			setUpdate(prev => !prev)
		} catch (error) {
			console.log(error)
			setInfoMsg({ color: "red", msg: "Something went wrong with server." })
		}
	}

	return (
		<form onSubmit={submit} className="form-login-register">
			<h1>REGISTER</h1>

			<TextField
				label="Username"
				type="text"
				maxLength={5}
				inputRef={inputRefs.username}
				variant="outlined"
				onChange={e => inputChange(e, "username")}
				error={Boolean(inputErrors.username)}
				helperText={inputErrors.username}
			/>

			<TextField
				label="Password"
				maxLength="45"
				inputRef={inputRefs.password}
				variant="outlined"
				onChange={e => inputChange(e, "password")}
				error={Boolean(inputErrors.password)}
				helperText={inputErrors.password}
				type={showPassword ? "text" : "password"}
				InputProps={{
					endAdornment:
						<InputAdornment position="end">
							<IconButton edge="end" aria-label="toggle password visibility" onClick={() => setShowPassword(!showPassword)}>
								{showPassword ? <VisibilityOff /> : <Visibility />}
							</IconButton>
						</InputAdornment>
				}}
			/>

			<TextField
				label="Confirm Password"
				maxLength="45"
				inputRef={inputRefs.confirmPassword}
				variant="outlined"
				onChange={e => inputChange(e, "confirmPassword")}
				error={Boolean(inputErrors.confirmPassword)}
				helperText={inputErrors.confirmPassword}
				type={showPassword ? "text" : "password"}
				InputProps={{
					endAdornment:
						<InputAdornment>
							<IconButton edge="end" aria-label="toggle password visibility" onClick={() => setShowPassword(!showPassword)}>
								{showPassword ? <VisibilityOff /> : <Visibility />}
							</IconButton>
						</InputAdornment>
				}}
			/>

			<Button type="submit" variant="contained">Register</Button>
			<h4 style={{ color: infoMsg.color }}>{infoMsg.msg}</h4>
		</form>
	)
}