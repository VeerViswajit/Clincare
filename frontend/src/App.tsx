// import React from 'react'
// import { Button } from './components/ui'
import SignUp from './pages/Signup/Signup'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/Home/HomePage'
import LoginPage from './pages/Login/LoginPage'


const routes = (
  <Router>
    <Routes>
      <Route path="/Home" element={<HomePage />}/>
      <Route path="/" element={<LoginPage />}/>
      <Route path="/signup" element={<SignUp />}/>
    </Routes>
  </Router>
);
const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-t from-gray-500 via-gray-700 to-gray-900 text-lg text-white">
      
      {routes}
    </div>
  )
}

export default App