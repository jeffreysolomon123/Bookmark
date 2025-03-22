import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Login from './Pages/Login';
import Home from './Pages/Home';
import SignUp from './Pages/SignUp';
import Dashboard from './Pages/Dashboard';

function App() {

  return (
    <div>
        <Router>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<SignUp />} />
            <Route path='/dashboard' element = {<Dashboard />} />
          </Routes>
        </Router>
    </div>
  )
}

export default App
