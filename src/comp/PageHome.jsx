export default function PageHome({ update, currentUser, loadingStateHome }) {


	return (
		<>
			{
				loadingStateHome.isLoading
					?
					<>
						{
							loadingStateHome.isError
								?
								<h1>Failed to connect to server, try refreshing.</h1>
								:
								<h1>LOADING...</h1>
						}
					</>
					:
					<>
						{
							currentUser.role === "admin" &&
							<>
								<h3>Welcome home admin</h3>
							</>
						}
						<h3>Home page component succesfully loaded</h3>
					</>
			}
		</>
	)
}