// Documentação para marcadores: https://docs.mapbox.com/mapbox-gl-js/api/markers/#marker#getelement
// Documentação para turfJS (Lib para colocar formas geométricas no mapa): https://turfjs.org/docs/api/circle

import "https://api.mapbox.com/mapbox-gl-js/v3.12.0/mapbox-gl.js";
import Supercluster from 'https://esm.run/supercluster';

class MapBox {
    #map;
    defaultMarkers = [];
    #clusterIndex;
    #currentZoom;


    constructor(container) {
        mapboxgl.accessToken = 'pk.eyJ1IjoiYnJ5YW4tcm8iLCJhIjoiY2x3ZTl5ZHZ4MWhiazJpa2h0NXFucTZ2diJ9.KygeJsIPYhDkEUZiow7P5Q';
        this.#map = new mapboxgl.Map({
            container: container,
            style: 'mapbox://styles/bryan-ro/cmahlmqfx018801s0cxzhcejv',
            projection: 'mercator',
            zoom: .8,
            center: [0, 20]
        });


        this.#map.addControl(new mapboxgl.NavigationControl(), 'top-left');
        this.#map.addControl(new mapboxgl.FullscreenControl(), 'top-left');
    }

    setDefaultMarker(cordinates) {
        const marker = new mapboxgl.Marker({
            color: "#59168b"
        })
            .setLngLat(cordinates)
            .addTo(this.#map);

        this.defaultMarkers.push(marker);
        marker.getElement().style.cursor = "pointer";

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


    loadData(players) {
        const pontosGeoJSON = {
            type: 'FeatureCollection',
            features: players.map(jogador => ({
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [jogador.lon, jogador.lat]
                },
                properties: {
                    id: Math.random().toString(36).substring(7)
                }
            }))
        };

        this.#clusterIndex = new Supercluster({radius: 40, maxZoom: 16});
        this.#clusterIndex.load(pontosGeoJSON.features);
        return pontosGeoJSON.features.length;
    }


    updateMapPoints() {
        if (!this.#clusterIndex) return;

        const bounds = this.#map.getBounds();
        const zoom = this.#map.getZoom();
        this.#currentZoom = zoom;

        const bbox = [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()];
        const clusters = this.#clusterIndex.getClusters(bbox, Math.floor(zoom));
        
        if (this.#map.getSource('players')) {
            this.#map.getSource('players').setData({
                type: 'FeatureCollection',
                features: clusters
            });
        }
    }

    loadClusters() {
            this.#map.addSource('players', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: []
                },
                cluster: false
            });

            this.#map.addLayer({
                id: 'clusters',
                type: 'circle',
                source: 'players',
                filter: ['has', 'point_count'],
                paint: {
                    'circle-color': "#56408C",
                    'circle-radius': [
                        'step',
                        ['get', 'point_count'],
                        20,
                        10, 25,
                        100, 30
                    ],
                    'circle-opacity': [
                        'step',
                        ['get', 'point_count'],
                        0.4,
                        100, 0.6,
                        500, 0.8,
                        1000, 0.9
                    ],
                }
            });

            this.#map.addLayer({
                id: 'cluster-count',
                type: 'symbol',
                source: 'players',
                filter: ['has', 'point_count'],
                layout: {
                    'text-field': ['get', 'point_count_abbreviated'],
                    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                    'text-size': 12
                }
            });

            this.#map.addLayer({
                id: 'unclustered-point',
                type: 'circle',
                source: 'players',
                filter: ['!', ['has', 'point_count']],
                paint: {
                    'circle-color': '#56408C',
                    'circle-radius': 8,
                }
            });
    }

    onload(loadFuncion) {
        this.#map.on("load", loadFuncion);
    }

    onclick(clickFunction) {
        this.#map.on("click", clickFunction);
    }

    onzoom(zoomFunc) {
        this.#map.on('zoomend', zoomFunc);
    }

    onmove(moveFunc) {
        this.#map.on('moveend', moveFunc);
    }
}

export default MapBox;