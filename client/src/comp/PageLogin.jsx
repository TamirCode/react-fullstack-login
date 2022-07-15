import { useRef, useState } from "react"
import { TextField, Button, IconButton, InputAdornment } from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material"

export default function PageLogin({ setUpdate, domain }) {

	const [inputValues, setInputValues] = useState({ username: "", password: "" })
	const [inputErrors, setInputErrors] = useState({ username: "", password: "" })
	const inputRefs = { username: useRef(null), password: useRef(null) }
	const [infoMsg, setInfoMsg] = useState({ color: "blue", msg: "" })
	const [showPassword, setShowPassword] = useState(false)

	function inputChange(e, input) {
		setInputValues(prev => {
			prev[input] = e.target.value
			return prev
		})
		setInputErrors(prev => ({ ...prev, [input]: "" }))
	}

	async function submit(e) {
		e.preventDefault()
		try {
			const res = await fetch(domain + "/login/", {
				method: "post",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ username: inputValues.username, password: inputValues.password }),
				credentials: "include"
			})

			const data = await res.json()

			if (data.err) {
				console.log(data.err)
				let firstError = [] // indices of useRef list to determine first invalid input and focus() it
				let inputErrorsTemp = { username: false, password: false, confirmPassword: false }

				if (data.code === "missing") {
					if (!inputValues.username.length) {
						firstError.push("username")
						inputErrorsTemp.username = "This field is required"
					}
					if (!inputValues.password.length) {
						firstError.push("password")
						inputErrorsTemp.password = "This field is required"
					}
				} else if (data.code === "doesnt_exist") {
					firstError.push("username")
					inputErrorsTemp.username = "Username doesn't exist."
				} else if (data.code === "wrong_pass") {
					firstError.push("password")
					inputErrorsTemp.password = "Wrong password."
				} else {
					setInfoMsg({ color: "red", msg: `${data.err}` })
				}

				setInputErrors(inputErrorsTemp)

				// focus() on first input with error
				if (firstError.length) { inputRefs[firstError[0]].current.focus() }

				return
			}

			console.log(data)
			setInfoMsg({ color: "green", msg: `${data.msg} ${data.username}` })
			setUpdate(prev => !prev)
		} catch (error) {
			setInfoMsg({ color: "red", msg: "Server failed, try again." })
		}
	}

	return (
		<form onSubmit={submit} className="form-login-register">
			<h1>LOGIN</h1>

			<TextField
				label="Username"
				type="text"
				maxLength="20"
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

			<Button type="submit" variant="contained">Login</Button>

			<h3 style={{ color: infoMsg.color }}>{infoMsg.msg}</h3>
		</form>
	)
}