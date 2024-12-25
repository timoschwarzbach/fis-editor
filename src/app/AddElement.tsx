import maplibregl from "maplibre-gl";
import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "~/components/ui/button";
import { EditElementDialog } from "./EditElementDialog";
import { markerItem } from "./Map";

export function AddElement({
  map,
  setMarkerList,
}: {
  map: maplibregl.Map;
  setMarkerList: Dispatch<SetStateAction<markerItem[]>>;
}) {
  return (
    <div className="flex">
      <Button
        variant="default"
        onClick={(e) => {
          e.preventDefault();
          const marker = new maplibregl.Marker({
            draggable: true,
          })
            .setLngLat(map.getCenter())
            .addTo(map);
          setMarkerList((markerList) => [
            ...markerList,
            { id: crypto.randomUUID(), marker },
          ]);
        }}
      >
        Neu
      </Button>
    </div>
  );
}
