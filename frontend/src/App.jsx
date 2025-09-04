import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import DSASheets from './pages/DSASheets'
import DSASheetTracker from './pages/DSASheetTracker'
function App() {

  return (
   <BrowserRouter>
   <Routes>
    <Route path="/resources/master/admin/en" element={<Home />} />
    <Route path="/DSA_Sheets" element={<DSASheets />} />
    <Route path="/DSA_Sheets/:id" element={<DSASheetTracker />} />
   </Routes>
   </BrowserRouter>
  )
}

export default App
