// Documentação para marcadores: https://docs.mapbox.com/mapbox-gl-js/api/markers/#marker#getelement
// Documentação para turfJS (Lib para colocar formas geométricas no mapa): https://turfjs.org/docs/api/circle

// Latitude: -24,3436000
// Longitude: -46,6056333

// Latitude: -24,3739667
// Longitude: -46,8024500

// Latitude: -24,4902500
// Longitude: -46,6688333

// Latitude: -24,2352833,
// Longitude: -46,6906500


class MapBox {
    #map;
    defaultMarkers = [];
    #playersLayerIds = [];

    constructor() {
        mapboxgl.accessToken = 'pk.eyJ1IjoiYnJ5YW4tcm8iLCJhIjoiY2x3ZTl5ZHZ4MWhiazJpa2h0NXFucTZ2diJ9.KygeJsIPYhDkEUZiow7P5Q';
        this.#map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/bryan-ro/cmahlmqfx018801s0cxzhcejv',
            projection: 'mercator',
            zoom: 1,
            center: [30, 15]
        });


        this.#map.addControl(new mapboxgl.NavigationControl(), 'top-left');
        this.#map.addControl(new mapboxgl.FullscreenControl(), 'top-left');

        // this.onload(() => {
        //     this.setProhibitedArea([-46.806655, -24.375334], 1.5, 'queimadinha');
        //
        //     this.setGoodArea([-46.792585, -24.194505], .3, 'ilha-das-cabras');
        //     this.setGoodArea([-46.675694, -24.485472], 3, 'queimada-grande');
        //     this.setGoodArea([-46.690620, -24.237077], 1, 'lage-conceicao');
        //     this.setGoodArea([-46.690819, -24.136990], 0.3, 'pier-mongagua');
        //     this.setGoodArea([-46.6056333, -24.3436000], 4, 'parcel-reis');
        // })
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

const map = new MapBox()

map.setDefaultMarker([-46.792585, -24.194505], "<h1 style='color: red'>Teste<h1>")
map.onload(() => {
    map.setPlayerArea([-46.593359, -23.548301], 500, "teste", 0.3)
})

