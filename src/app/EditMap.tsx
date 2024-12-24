import { useEffect, useState } from "react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export function EditMap({ map }: { map: maplibregl.Map }) {
  const [mapData, setMapData] = useState({
    zoom: 0,
    lat: 0,
    lon: 0,
    rotation: 0,
    tilt: 0,
  });
  useEffect(() => {
    if (!map) return;
    const zoomListener = () => {
      const zoom = map.getZoom();
      if (!zoom) return;
      setMapData((mapData) => ({ ...mapData, zoom }));
    };
    const moveListener = () => {
      const postition = map.getCenter();
      if (!postition) return;
      setMapData((mapData) => ({
        ...mapData,
        lat: postition.lat,
        lon: postition.lng,
      }));
    };
    const rotationListener = () => {
      const rotation = map.getBearing();
      if (!rotation) return;
      setMapData((mapData) => ({ ...mapData, rotation }));
    };
    const tiltListener = () => {
      const tilt = map.getPitch();
      if (!tilt) return;
      setMapData((mapData) => ({ ...mapData, tilt }));
    };
    map.on("zoom", zoomListener);
    map.on("move", moveListener);
    map.on("rotate", rotationListener);
    map.on("pitch", tiltListener);

    // load initial values
    zoomListener();
    moveListener();
    rotationListener();
    tiltListener();
    return () => {
      if (!map) return;
      map.off("zoom", zoomListener);
      map.off("move", moveListener);
      map.off("rotate", rotationListener);
      map.off("pitch", tiltListener);
    };
  }, [map]);

  const onPositionInputBlur = () => {
    const lat = mapData.lat;
    const lon = mapData.lon;
    try {
      map.setCenter([lat, lon]);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-1">
      <Label htmlFor="zoom">Zoom</Label>
      <Input
        type="number"
        id="zoom"
        placeholder="Zoom"
        value={mapData.zoom}
        className="col-span-2"
        onChange={(e) => {
          const zoom = parseFloat(e.target.value);
          setMapData({ ...mapData, zoom });
        }}
        onBlur={() => {
          try {
            const zoom = mapData.zoom;
            if (zoom < 0 || zoom > 20) return;
            map.setZoom(zoom);
          } catch (e) {
            console.error(e);
          }
        }}
      />
      <Label>Center</Label>
      <Input
        type="number"
        id="lat"
        placeholder="Latitude"
        value={mapData.lat}
        onChange={(e) => {
          const lat = parseFloat(e.target.value);
          setMapData({ ...mapData, lat });
        }}
        onBlur={onPositionInputBlur}
      />
      <Input
        type="number"
        id="lon"
        placeholder="Longitude"
        value={mapData.lon}
        onChange={(e) => {
          const lon = parseFloat(e.target.value);
          setMapData({ ...mapData, lon });
        }}
        onBlur={onPositionInputBlur}
      />
      <Label htmlFor="rotation">Rotation</Label>
      <Input
        type="number"
        id="rotation"
        placeholder="Rotation"
        value={mapData.rotation}
        className="col-span-2"
        onChange={(e) => {
          const rotation = parseFloat(e.target.value);
          setMapData({ ...mapData, rotation });
        }}
        onBlur={() => {
          try {
            const rotation = mapData.rotation % 360;
            map.setBearing(rotation);
          } catch (e) {
            console.error(e);
          }
        }}
      />
      <Label htmlFor="tilt">Tilt</Label>
      <Input
        type="number"
        id="tilt"
        placeholder="Tilt"
        value={mapData.tilt}
        className="col-span-2"
        onChange={(e) => {
          const tilt = parseFloat(e.target.value);
          setMapData({ ...mapData, tilt });
        }}
        onBlur={() => {
          try {
            const tilt = mapData.tilt;
            if (tilt < 0 || tilt > 60) return;
            map.setPitch(tilt);
          } catch (e) {
            console.error(e);
          }
        }}
      />
    </div>
  );
}
