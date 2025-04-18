import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import AppBar from './components/AppBar'
import Map from './pages/Maps'
import Order from './pages/Order'
import Deliverable from './pages/Deliverable'
import Driver from './pages/Driver'
import Init from './components/Init'
import { RecoilEnv, useRecoilValue } from 'recoil'
import Login from './pages/Login'

import { token } from './store/atoms/tokenAtom'
import Signup from './pages/Signup'
import MyAccount from './pages/MyAccount'
import Reset from './pages/Reset'
import VerifyEmail from './pages/VerifyEmail'



function App() {
  const tokenKey = useRecoilValue<string | null>(token)
  RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false
  return (
    <div className='w-full h-full'>
      <Router>
        <div className='flex flex-col h-full'>
        <AppBar></AppBar>
        <Init></Init>
        <div className='h-full overflow-scroll'>
        <Routes >
          <Route path='/*' element={tokenKey == null ? <Login></Login> : <Map></Map>} />
          <Route path='/orders' element={tokenKey == null ? <Login></Login> : <Order></Order>} />
          <Route path='/delerables' element={tokenKey == null ? <Login></Login> : <Deliverable></Deliverable>} />
          <Route path='/drivers' element={tokenKey == null ? <Login></Login> : <Driver></Driver>} />
          <Route path='/login' element={<Login></Login>} />
          <Route path='/reset' element={<Reset></Reset>} />
          <Route path='/verify' element={<VerifyEmail></VerifyEmail>} />
          <Route path='/signup' element={<Signup></Signup>} />
          <Route path='/account' element={tokenKey == null ? <Login></Login> : <MyAccount></MyAccount>} />
        </Routes>
        </div>
        </div>
      </Router>

    </div>
  )
}

export default App
