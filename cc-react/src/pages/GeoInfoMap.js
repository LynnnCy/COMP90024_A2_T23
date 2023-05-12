import { useEffect, useState } from "react";
import MapBoxVisualisation from "../Components/MapBoxVisualisation";

const GeoInfoMap = () => {
    const [data, setData] = useState(null);
    useEffect(() => {
        setData(import('../sudo_vic_lga_attributes.json'))
    }, []);

return (
    data !== null ? <MapBoxVisualisation data={data} /> : null
);
}

export default GeoInfoMap;