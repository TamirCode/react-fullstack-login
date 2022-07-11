import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'
import PageLogin from './comp/PageLogin'
import PageRegister from './comp/PageRegister'
import Header from './comp/Header'
import PageHome from './comp/PageHome'
import PageAdmin from './comp/PageAdmin'

const domain = "http://localhost:1000"

export default function App() {
	const [update, setUpdate] = useState(false)
	const [loggedIn, setLoggedIn] = useState(false)
	const [currentUser, setCurrentUser] = useState({})
	// Loading: true,false  Error: true,true  Finished: false,false 
	const [loadingState, setLoadingState] = useState({ isLoading: true, isError: false })
	const [loadingStateHome, setLoadingStateHome] = useState({ isLoading: true, isError: false })

	useEffect(() => {
		(async () => {
			try {
				const res = await fetch(domain + "/loggedin", { credentials: "include" })
				const data = await res.json()
				if (data.loggedIn) {
					setLoggedIn(true)
					// data: { username: "blah", role: "blah" }
					setCurrentUser(data)
					fetchData()
				} else {
					setLoggedIn(false)
					setCurrentUser({})
				}
				setLoadingState({ isLoading: false, isError: false })
			} catch (error) {
				setLoadingState({ isLoading: true, isError: true })
			}
		})()
	}, [update])

	async function fetchData() {
		try {
			// const res = await fetch(domain + "/flights", { credentials: "include" })
			// const data = await res.json()
			// if (data.err) {
			// 	throw new Error("server failed to fetch data")
			// }
			// setDataArray(data))
			setLoadingStateHome({ isLoading: false, isError: false })
		} catch (error) {
			console.warn(error)
			setLoadingStateHome({ isLoading: true, isError: true })
		}
	}

	return (
		<>
			{
				loadingState.isLoading
					?
					<>
						{
							loadingState.isError
								?
								<>
									<header></header>
									<main><h1>Failed to connect to server, try refreshing.</h1></main>
								</>
								:
								<>
									<header></header>
									<main><h1>LOADING...</h1></main>
								</>
						}
					</>
					:
					<Router>
						<Header loggedIn={loggedIn} setUpdate={setUpdate} currentUser={currentUser} />
						<main>
							{
								loggedIn
									?
									<Routes>
										<Route path="/" element={
											<PageHome update={update} currentUser={currentUser} loadingStateHome={loadingStateHome} />
										} />
										{currentUser.role === "admin" && <Route path="/admin" element={<PageAdmin />} />}
										<Route path="*" element={<Navigate to="/" />} />
									</Routes>
									:
									<Routes>
										<Route path="/register" element={<PageRegister setUpdate={setUpdate} />} />
										<Route path="/login" element={<PageLogin setUpdate={setUpdate} />} />
										<Route path="/*" element={<Navigate to="/login" />} />
									</Routes>
							}
						</main>
					</Router>
			}
		</>
	)
}