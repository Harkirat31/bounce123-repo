import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import AppBar from './components/AppBar'
import Home from './pages/Maps'
import Order from './pages/Order'
import Deliverable from './pages/Deliverable'
import Driver from './pages/Driver'
import Init from './components/Init'


function App() {
  return (
    <div className='w-full'>
      <Router>
        <AppBar></AppBar>
        <Init></Init>
        <Routes>
          <Route path='/*' element={<Home></Home>} />
          <Route path='/orders' element={<Order />} />
          <Route path='/delerables' element={<Deliverable />} />
          <Route path='/drivers' element={<Driver />} />
        </Routes>
      </Router>

    </div>
  )
}

export default App
