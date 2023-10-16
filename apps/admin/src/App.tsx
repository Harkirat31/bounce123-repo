import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import AppBar from './components/AppBar'
import Home from './pages/Home'
import Order from './pages/Order'
import Deliverable from './pages/Deliverable'
import Employee from './pages/Employee'
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
          <Route path='/employees' element={<Employee />} />
        </Routes>
      </Router>

    </div>
  )
}

export default App
