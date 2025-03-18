import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes,  Route} from 'react-router-dom'
import Login from './pages/Login'
import Chat from './pages/Chat'
import ProfileUpdate from './pages/ProfileUpdate'

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Login/>} />
        <Route path='/chat' element={<Chat/>} />
        <Route path='/profile' element={<ProfileUpdate/>} />

      </Routes>
    </>
  )
}

export default App
