import './App.css'
import KeyVisualizer from './KeyVis'
import RandomButtons from './RandomBtn'
// import T from "./T";;

function App() {

  return (
    <>
      <RandomButtons maxCount={19} />
      {/* <T /> */}
      <KeyVisualizer />
    </>
  )
}

export default App
