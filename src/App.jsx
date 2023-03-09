import { useState } from 'react'
import Header from "./components/Header"
import Cocktail from "./components/Cocktail"

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Header />
      <Cocktail />
    </div>
  )
}

export default App
