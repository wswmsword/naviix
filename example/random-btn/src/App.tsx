import './App.css'
import KeyVisualizer from './KeyVis'
import RandomButtons from './RandomBtn'

function App() {

  return (
    <>
      <RandomButtons maxCount={30} />
      <KeyVisualizer />
    </>
  )
}

export default App
