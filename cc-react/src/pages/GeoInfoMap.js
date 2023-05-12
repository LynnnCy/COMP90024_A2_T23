import { useEffect, useState } from "react";
import MapBoxVisualisation from "../Components/MapBoxVisualisation";
import PageTransition from '../Components/PageTransition';
import LoadingSpinner from '../Components/LoadingSpinner';

const GeoInfoMap = () => {
    const [data, setData] = useState(null);
    useEffect(() => {
        setData(import('../sudo_vic_lga_attributes.json'))
    }, []);

return (
    <PageTransition>
        {data !== null ? <MapBoxVisualisation data={data} /> : <LoadingSpinner />}
    </PageTransition>
);
}

export default GeoInfoMap;