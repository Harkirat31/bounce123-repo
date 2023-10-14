import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import AppBar from './components/AppBar'
import Home from './pages/Home'
import Order from './pages/Order'
import Deliverable from './pages/Deliverable'
import Employee from './pages/Employee'
import { useEffect } from 'react'
import { rentItemsState } from './store/atoms/rentItemsAtom'
import { useSetRecoilState } from 'recoil'

import { BASE_URL } from '../config.ts'


function App() {
  const setRentingItems = useSetRecoilState(rentItemsState)
  useEffect(() => {
    const url = `${BASE_URL}/admin/getRentingItems`
    fetch(url, {
      method: "GET"
    }).then(result => {
      console.log(result)
      result.json().then(
        (jsonData) => {
          console.log(jsonData)
          setRentingItems({
            isLoading: false,
            value: jsonData
          })
        }
      ).catch((error) => {
        console.log(error)
      })
    }).catch((error) => console.log("error"))
    // setTimeout(() => {
    //   setRentingItems({
    //     isLoading: true,
    //     value: [{
    //       title: "Animal Kingdom",
    //       rentingItemId: "id_Renting Item",
    //       capacity: 30,
    //       category: "Bouncy Castle",
    //       deliveryPrice: 110,
    //       sideItems: [{
    //         sideItemId: "id",
    //         count: 2,
    //         sideItemTitle: "Blower"
    //       }]
    //     }]
    //   })
    // }, 2000)
  }, [])
  return (
    <div className='w-full'>
      <Router>
        <AppBar></AppBar>
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
