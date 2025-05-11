// Documentação para marcadores: https://docs.mapbox.com/mapbox-gl-js/api/markers/#marker#getelement
// Documentação para turfJS (Lib para colocar formas geométricas no mapa): https://turfjs.org/docs/api/circle

import "https://api.mapbox.com/mapbox-gl-js/v3.12.0/mapbox-gl.js"

class MapBox {
    #map;
    defaultMarkers = [];
    #playersLayerIds = [];

    constructor(container) {
        mapboxgl.accessToken = 'pk.eyJ1IjoiYnJ5YW4tcm8iLCJhIjoiY2x3ZTl5ZHZ4MWhiazJpa2h0NXFucTZ2diJ9.KygeJsIPYhDkEUZiow7P5Q';
        this.#map = new mapboxgl.Map({
            container: container,
            style: 'mapbox://styles/bryan-ro/cmahlmqfx018801s0cxzhcejv',
            projection: 'mercator',
            zoom: 1,
            center: [30, 15]
        });


        this.#map.addControl(new mapboxgl.NavigationControl(), 'top-left');
        this.#map.addControl(new mapboxgl.FullscreenControl(), 'top-left');
    }

    setDefaultMarker(cordinates, popupValue) {
        const marker = new mapboxgl.Marker({
            color: "#59168b"
        })
            .setLngLat(cordinates)
            .addTo(this.#map);

        this.defaultMarkers.push(marker);
        marker.getElement().style.cursor = "pointer";

        const popup = this.createPopUp(popupValue);

        marker.getElement().addEventListener('mouseenter', () => {
            popup.addTo(this.#map);
            popup.setLngLat(marker.getLngLat()); // Ajusta o popup na posição do marcador
        });

        // Remover o popup quando o mouse sai
        marker.getElement().addEventListener('mouseleave', () => {
            popup.remove();
        });

        return marker;
    }

    removeDefaultMarkers() {
        this.defaultMarkers.forEach(marker => {
            marker.getElement().remove();
        });
    }

    removeLastDefaultMarker() {
        this.defaultMarkers.pop().getElement().remove();
    }


    setPlayerArea(centerCoordinates, radius, id, intensity) {
        const circleGeoJSON = turf.circle(centerCoordinates, radius, {
            steps: 64,
            units: "kilometers",
        });

        this.#map.addSource(id, {
            type: "geojson",
            data: circleGeoJSON,
        });

        this.#map.addLayer({
            id,
            type: "fill",
            source: id,
            paint: {
                "fill-color": "#59168b",
                "fill-opacity": intensity,
            },
        });

        this.#playersLayerIds.push(id);
    }

    createPopUp(value) {
        const popup = new mapboxgl.Popup({
            closeButton: false,  // Não mostra o botão de fechar
            closeOnClick: false  // Não fecha ao clicar fora
        }).setHTML(value);

        return popup;
    }

    onload(loadFuncion) {
        this.#map.on("load", loadFuncion);
    }

    onclick(clickFunction) {
        this.#map.on("click", clickFunction);
    }
}

export default MapBox;