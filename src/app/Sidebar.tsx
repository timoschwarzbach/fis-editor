import { useState } from "react";
import { Button } from "~/components/ui/button";
import { markerItem } from "./Map";
import { set } from "zod";

type exportMarker = {
  lat: number;
  lon: number;
  type: string;
  data: any;
};

export function Sidebar({
  map,
  markerList,
  setMarkerList,
}: {
  map: maplibregl.Map;
  markerList: markerItem[];
  setMarkerList: (markerList: markerItem[]) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="destructive"
        onClick={() => {
          markerList.forEach((marker) => {
            marker.marker.remove();
          });
          setMarkerList([]);
        }}
      >
        Reset
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          const markerData = markerList.map((marker) => {
            const { lng, lat } = marker.marker.getLngLat();
            const element = marker.marker.getElement()
              .firstChild as HTMLElement;
            const type = element.getAttribute("data-type");
            const data = JSON.parse(element.getAttribute("data-style") ?? "");
            return {
              lat: lat,
              lon: lng,
              type: type,
              data: data,
            } as exportMarker;
          });

          const { lng, lat } = map.getCenter();
          const zoom = map.getZoom();

          const exportJson = JSON.stringify({
            map: {
              center: [lng, lat],
              zoom: zoom,
            },
            markers: markerData,
          });
          console.log(exportJson);
          navigator.clipboard.writeText(exportJson);
        }}
      >
        Export
      </Button>
      {/* <Button
        variant="outline"
        onClick={() => {
          setDummy(dummy + 1);
        }}
      >
        Refresh
      </Button>
      {markerList.map((marker) => {
        return <p key={marker.id}>wow {marker.id}</p>;
      })} */}
    </div>
  );
}
