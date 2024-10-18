import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" />
          <Route path="/signin" />
          <Route path="/blog/:id" />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
