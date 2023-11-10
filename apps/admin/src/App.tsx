import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import AppBar from './components/AppBar'
import Map from './pages/Maps'
import Order from './pages/Order'
import Deliverable from './pages/Deliverable'
import Driver from './pages/Driver'
import Init from './components/Init'
import { RecoilEnv } from 'recoil'



function App() {
  RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false
  return (
    <div className='w-full'>
      <Router>
        <AppBar></AppBar>
        <Init></Init>
        <Routes>
          <Route path='/*' element={<Map></Map>} />
          <Route path='/orders' element={<Order />} />
          <Route path='/delerables' element={<Deliverable />} />
          <Route path='/drivers' element={<Driver />} />
        </Routes>
      </Router>

    </div>
  )
}

export default App
