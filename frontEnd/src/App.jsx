import { useState } from 'react'
import './App.css'
import Principal from './pages/Principal';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Principal />}></Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
