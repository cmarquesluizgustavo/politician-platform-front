import React from 'react'
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom'
import NetworkPage from './pages/NetworkPage'
import SpecificInfluencePage from './pages/InfluencesOverTime'

const App: React.FC = () => {
	return (
		<Router>
			<div>
				<nav>
					<ul>
						<li>
							<Link to="/">Home</Link>
						</li>
						<li>
							<Link to="/network">Network</Link>
							<Link to="/specific-influence">
								Influence Over Time
							</Link>
						</li>
						{/* Adicione links para outras páginas conforme necessário */}
					</ul>
				</nav>
				<Routes>
					<Route path="/network" Component={NetworkPage} />
					<Route
						path="/specific-influence"
						Component={SpecificInfluencePage}
					/>
					{/* Adicione rotas para outras páginas conforme necessário */}
				</Routes>
			</div>
		</Router>
	)
}

export default App
