import "./App.css";
import { PrimeReactProvider } from 'primereact/api';
import DataList from "./component/datalist";

function App() {
  return (
    <div>
      <h1 className="heading">Article Artwork</h1>
      <PrimeReactProvider>
        <DataList />
      </PrimeReactProvider>
    </div>
  );
}

export default App;
