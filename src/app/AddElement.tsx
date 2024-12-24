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
  const [dialog, setDialog] = useState<{
    marker: maplibregl.Marker | null;
    open: boolean;
  }>({ marker: null, open: false });

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
          marker.getElement().addEventListener("contextmenu", () => {
            console.log(
              "marker contextmenu sollte sich öffen mit der möglichkeit zu bearbeiten oder zu löschen",
            );
          });
          marker.getElement().addEventListener("click", () => {
            setDialog({ marker: marker, open: true });
          });
        }}
      >
        Neu
      </Button>
      {dialog.marker && (
        <EditElementDialog
          isOpen={dialog.open}
          marker={dialog.marker}
          close={() => setDialog({ ...dialog, open: false })}
          setMarkerList={setMarkerList}
        />
      )}
    </div>
  );
}
