"use client";

import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";
import { EditMap } from "./EditMap";
import { AddElement } from "./AddElement";
import { Sidebar } from "./Sidebar";
import { MarkerLogicList } from "./MarkerLogic";

export type markerItem = { id: string; marker: maplibregl.Marker };

export default function Map() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<maplibregl.Map | null>(null);
  const [markerList, setMarkerList] = useState<markerItem[]>([]); // track all markers

  useEffect(() => {
    if (map) return;
    if (!mapContainer.current) return;
    setMap(
      new maplibregl.Map({
        container: mapContainer.current,
        style: "/map.json",
        center: [9.993768, 53.552534],
        zoom: 15,
        attributionControl: false,
      }),
    );
  }, []);

  useEffect(() => {
    if (!map) return;
    map.on("load", () => {
      loadLineOverlay(map);
    });
  }, [map]);

  return (
    <>
      <div className="flex max-w-3xl flex-row gap-4">
        {map && <EditMap map={map} />}
        {map && <AddElement map={map} setMarkerList={setMarkerList} />}
        {map && (
          <Sidebar
            map={map}
            markerList={markerList}
            setMarkerList={setMarkerList}
          />
        )}
        {map && (
          <MarkerLogicList
            map={map}
            markerList={markerList}
            setMarkerList={setMarkerList}
          />
        )}
      </div>
      <div className="aspect-video w-full">
        <div ref={mapContainer} className="h-full w-full bg-red-600"></div>
      </div>
    </>
  );
}

// Elmshorn 5000: 552213
// U2: 15858436
// S75 -> Münster: 1723831
// Tram 7: 2425311
function loadLineOverlay(map: maplibregl.Map, lineid: string = "2425311") {
  try {
    console.log("loading line overlay", lineid);

    // removing previous layers if they exist
    map.getSource("current") && map.removeSource("current");
    map.getLayer("current-line") && map.removeLayer("current-line");
    map.getLayer("current-circle") && map.removeLayer("current-circle");

    // adding new line as source
    map
      .addSource("current", {
        type: "geojson",
        data: `/routes/${lineid}.geojson`,
      })
      .addLayer({
        id: "current-line",
        type: "line",
        source: "current",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: {
          "line-color": "#d6322e",
          "line-width": 8,
        },
      })
      .addLayer({
        id: "current-circle",
        type: "circle",
        source: "current",
        filter: ["==", "public_transport", "stop_position"],
        paint: {
          "circle-color": "#f1f5f9",
          "circle-radius": 10,
          "circle-stroke-width": 4,
          "circle-stroke-color": "#1e293b",
        },
      });
  } catch (e) {
    console.error("adding layer failed", e);
  }
}
