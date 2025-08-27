import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
   <BrowserRouter>
   <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/DSA_Sheets" element={<DSASheets />} />
    <Route path="/DSA_Sheets/:id" element={<DSASheetTracker />} />
   </Routes>
   </BrowserRouter>
  )
}

export default App
