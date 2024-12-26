import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { markerItem } from "./Map";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { DialogDescription } from "@radix-ui/react-dialog";
import {
  getMarkerData,
  renderLayout,
  renderMarkerHtml,
  renderMarkerToJsx,
} from "./RenderMarker";
import { EditElementDialog } from "./EditElementDialog";
import maplibregl from "maplibre-gl";

type mergeDialogControlState = {
  visible: boolean;
  marker1: null | maplibregl.Marker;
  marker2: null | maplibregl.Marker;
};

export function MarkerLogicList({
  map,
  markerList,
  setMarkerList,
}: {
  map: maplibregl.Map;
  markerList: markerItem[];
  setMarkerList: Dispatch<SetStateAction<markerItem[]>>;
}) {
  const [merge, setMerge] = useState<mergeDialogControlState>({
    visible: false,
    marker1: null,
    marker2: null,
  });
  const detectMarkerIntersect = useCallback(
    (marker: maplibregl.Marker) => {
      const clientrect = marker.getElement().getBoundingClientRect();
      const dragged = {
        x: clientrect.x + (clientrect.right - clientrect.left) / 2,
        y: clientrect.y + (clientrect.bottom - clientrect.top) / 2,
      };
      const firstintersect = markerList.find((item) => {
        if (item.marker !== marker) {
          const ibrect = item.marker.getElement().getBoundingClientRect();
          return (
            dragged.x < ibrect.right &&
            dragged.x > ibrect.left &&
            dragged.y < ibrect.bottom &&
            dragged.y > ibrect.top
          );
        }
      });
      if (!firstintersect) return;
      setMerge({
        visible: true,
        marker1: marker,
        marker2: firstintersect.marker,
      });
    },
    [markerList],
  );

  return (
    <>
      {markerList.map((item) => (
        <MarkerLogic
          key={item.id}
          item={item}
          detectMarkerIntersect={detectMarkerIntersect}
          setMarkerList={setMarkerList}
        />
      ))}
      <MergeDialog
        map={map}
        merge={merge}
        setMarkerList={setMarkerList}
        isOpen={merge.visible}
        close={() => {
          setMerge((val) => {
            return { ...val, visible: false };
          });
        }}
      />
    </>
  );
}

function MarkerLogic({
  item,
  detectMarkerIntersect,
  setMarkerList,
}: {
  item: markerItem;
  detectMarkerIntersect: (marker: maplibregl.Marker) => void;
  setMarkerList: Dispatch<SetStateAction<markerItem[]>>;
}) {
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    // define handlers
    const contextMenuListener = () => {
      console.log(
        "marker contextmenu sollte sich öffen mit der möglichkeit zu bearbeiten oder zu löschen",
      );
    };
    const clickListener = () => {
      setEdit(true);
    };
    const dragendListener = () => {
      detectMarkerIntersect(item.marker);
    };

    // add handlers
    item.marker
      .getElement()
      .addEventListener("contextmenu", contextMenuListener);
    item.marker.getElement().addEventListener("click", clickListener);
    item.marker.on("dragend", dragendListener);

    // clean handlers
    return () => {
      item.marker
        .getElement()
        .removeEventListener("contextmenu", contextMenuListener);
      item.marker.getElement().removeEventListener("click", clickListener);
      item.marker.off("dragend", dragendListener);
    };
  }, [item, detectMarkerIntersect]);
  return (
    <EditElementDialog
      isOpen={edit}
      marker={item.marker}
      close={() => setEdit(false)}
      setMarkerList={setMarkerList}
    />
  );
}

function MergeDialog({
  map,
  merge,
  isOpen,
  close,
  setMarkerList,
}: {
  map: maplibregl.Map;
  merge: mergeDialogControlState;
  isOpen: boolean;
  close: () => void;
  setMarkerList: Dispatch<SetStateAction<markerItem[]>>;
}) {
  const mergeMarkers = useCallback(() => {
    if (!merge.marker1 || !merge.marker2) return;

    // get marker1 data
    const m1 = getMarkerData(merge.marker1);
    // get marker2 data
    const m2 = getMarkerData(merge.marker2);
    // create new marker
    const marker = new maplibregl.Marker({
      draggable: true,
    })
      .setLngLat([m2.lon, m2.lat])
      .addTo(map);
    // set marker to layout
    marker.getElement().innerHTML = renderMarkerHtml("layout", {
      direction: "row",
      gap: 4,
      items: [m1, m2],
    });

    // remove old markers, add new marker
    merge.marker1.remove();
    merge.marker2.remove();
    setMarkerList((markerList) => [
      ...markerList.filter(
        (item) => ![merge.marker1, merge.marker2].includes(item.marker),
      ),
      { id: crypto.randomUUID(), marker },
    ]);
  }, [merge.marker1, merge.marker2]);

  return (
    <Dialog defaultOpen open={isOpen} onOpenChange={close}>
      <DialogContent className="text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Merge</DialogTitle>
          <DialogDescription>
            You are about to merge these two markers. This will result in a
            joined layout that you can modify.
          </DialogDescription>
        </DialogHeader>
        <div className="flex grow flex-row justify-around">
          {renderMarkerToJsx(merge.marker1!)}
          <span>+</span>
          {renderMarkerToJsx(merge.marker2!)}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              close();
            }}
          >
            Back
          </Button>
          <Button
            variant="destructive"
            type="submit"
            onClick={() => {
              mergeMarkers();
              close();
            }}
          >
            Merge
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
