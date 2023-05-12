import { Routes, Route, useLocation } from "react-router-dom";
import Home from './pages/Home';
import Today from './pages/Today'
import GeoInfoMap from './pages/GeoInfoMap';
import { AnimatePresence } from "framer-motion";

const App = () => {
  const location = useLocation()
  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
          <Route index element={<Home />} />
          <Route path="today" element={<Today />} />
          <Route path="map" element={<GeoInfoMap />} />
          {/* <Route path="*" element={<NoPage />} /> */}
      </Routes>
    </AnimatePresence>
  );
}

export default App;
