import "./App.css";
import MainPlot from "./components/MainPlot";
import AttrJson from "./data/attr.json";
import RawJson from "./data/raw.json";

function App() {
  return (
    <div className="App">
      <MainPlot attr={AttrJson} raw={RawJson} />
    </div>
  );
}

export default App;
