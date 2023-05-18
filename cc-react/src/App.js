import { Routes, Route, useLocation } from "react-router-dom";
import Home from './pages/Home';
import Today from './pages/Today'
import GeoInfo from './pages/GeoInfo';
import Visualisations from './pages/Visualisations';
import { AnimatePresence } from "framer-motion";

const App = () => {
  const location = useLocation()
  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        <Route index element={<Home />} />
        <Route path="today" element={<Today />} />
        <Route path="map" element={<GeoInfo />} />
        <Route path="visuals" element={<Visualisations />} />
        {/* <Route path="*" element={<NoPage />} /> */}
      </Routes>
    </AnimatePresence>
  );
}

export default App;
