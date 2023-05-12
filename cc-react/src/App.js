import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Today from './pages/Today'
import GeoInfoMap from './pages/GeoInfoMap';
import Layout from "./pages/Layout";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="today" element={<Today />} />
          <Route path="map" element={<GeoInfoMap />} />
          {/* <Route path="*" element={<NoPage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
