import { Routes, Route, useLocation } from "react-router-dom";
import Home from './pages/Home';
import TrendingTwitter from './pages/TrendingTwitter';
import GeoInfo from './pages/GeoInfo';
import Visualisations from './pages/Visualisations';
import { AnimatePresence } from "framer-motion";
import StreamData from "./pages/StreamData";

const App = () => {
  const location = useLocation()
  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        <Route index element={<Home />} />
        <Route path="trending" element={<TrendingTwitter />} />
        <Route path="map" element={<GeoInfo />} />
        <Route path="visuals" element={<Visualisations />} />
        <Route path="stream" element={<StreamData />} />
        {/* <Route path="*" element={<NoPage />} /> */}
      </Routes>
    </AnimatePresence>
  );
}

export default App;
