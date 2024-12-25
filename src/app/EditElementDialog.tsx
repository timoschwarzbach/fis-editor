import maplibregl from "maplibre-gl";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { EditLineIcon } from "./EditLineIcon";
import { EditGeneralIcon } from "./EditGeneralIcon";
import { getMarkerData, renderMarkerHtml } from "./RenderMarker";

export type markerStyle = {
  type: string;
  data: object;
};

export function EditElementDialog({
  isOpen,
  marker,
  close,
  setMarkerList,
}: {
  isOpen: boolean;
  marker: maplibregl.Marker;
  close: () => void;
  setMarkerList: Dispatch<
    SetStateAction<{ id: string; marker: maplibregl.Marker }[]>
  >;
}) {
  const [data, setData] = useState<markerStyle | null>(null);
  const [screen, setScreen] = useState<string>("line");

  useEffect(() => {
    if (isOpen) {
      // try to set the screen to the correct one according to the marker
      const { type } = getMarkerData(marker);
      if (type !== "") {
        setScreen(type);
      }
    }
  }, [isOpen, marker]);

  // if (screen === "layout") {
  //   return <>layout todo</>;
  // }

  return (
    <Dialog defaultOpen open={isOpen} onOpenChange={close}>
      <DialogContent className="text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Icon</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga, rem?
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue={screen}>
          <TabsList>
            <TabsTrigger value="line" key="line">
              Line
            </TabsTrigger>
            <TabsTrigger value="icon" key="icon">
              Icon
            </TabsTrigger>
          </TabsList>
          <TabsContent value="line">
            <EditLineIcon
              marker={marker}
              active={screen === "line"}
              setData={setData}
            />
          </TabsContent>
          <TabsContent value="icon">
            <EditGeneralIcon
              marker={marker}
              active={screen === "icon"}
              setData={setData}
            />
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={() => {
              setMarkerList((markerList) =>
                markerList.filter((m) => m.marker !== marker),
              );
              marker.remove();
              close();
            }}
          >
            Delete
          </Button>
          <Button
            type="submit"
            onClick={() => {
              if (!data) return;
              const html = renderMarkerHtml(data.type, data.data);
              replaceMarkerHtml(marker, html);
              close();
            }}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function replaceMarkerHtml(marker: maplibregl.Marker, html: string) {
  const element = marker.getElement();
  if (!element) throw "no html";
  element.innerHTML = html;
}
