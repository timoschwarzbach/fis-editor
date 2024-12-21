import maplibregl from "maplibre-gl";
import { MutableRefObject, useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { EditElementDialog } from "./EditElementDialog";

export function AddElement({
  map,
}: {
  map: MutableRefObject<maplibregl.Map | null>;
}) {
  const [dialog, setDialog] = useState<{
    marker: maplibregl.Marker | null;
    open: boolean;
  }>({ marker: null, open: false });
  useEffect(() => {
    if (!map.current) return;
    return () => {
      if (!map.current) return;
    };
  });

  return (
    <div className="flex">
      <Button
        variant="default"
        onClick={(e) => {
          e.preventDefault();
          if (!map.current) return;
          const marker = new maplibregl.Marker({
            draggable: true,
          })
            .setLngLat(map.current.getCenter())
            .addTo(map.current);
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
        />
      )}
    </div>
  );
}
