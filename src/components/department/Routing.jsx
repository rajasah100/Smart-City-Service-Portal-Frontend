import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

const Routing = ({ start, end }) => {
    const map = useMap();

    useEffect(() => {
        if (!start || !end) return;

        const routing = L.Routing.control({
            waypoints: [
                L.latLng(start[0], start[1]),
                L.latLng(end[0], end[1]),
            ],

            routeWhileDragging: false,

            addWaypoints: false,

            draggableWaypoints: false,

            fitSelectedRoutes: true,

            show: false,

            lineOptions: {
                styles: [
                    {
                        color: "#0f4c81",
                        weight: 6,
                    },
                ],
            },
        }).addTo(map);

        return () => map.removeControl(routing);
    }, [map, start, end]);

    return null;
};

export default Routing;