import { useState } from 'react'
import Header from "./components/Header"
import Cocktail from "./components/Cocktail"
import Footer from "./components/Footer"

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Header />
      <Cocktail />
      {/* <Footer /> */}
    </div>
  )
}

export default App
