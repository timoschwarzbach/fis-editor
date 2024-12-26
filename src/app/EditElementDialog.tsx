import maplibregl from "maplibre-gl";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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
import { EditLayout } from "./EditLayout";

export type markerStyle = {
  type: string;
  data: object;
};

export function EditElementDialog({
  isOpen,
  marker,
  pseudoMarker,
  close,
  setMarkerList,
  change,
}:
  | {
      isOpen: boolean;
      marker: maplibregl.Marker;
      pseudoMarker?: undefined;
      close: () => void;
      setMarkerList: Dispatch<
        SetStateAction<{ id: string; marker: maplibregl.Marker }[]>
      >;
      change?: undefined;
    }
  | {
      isOpen: boolean;
      marker?: undefined;
      pseudoMarker: markerStyle;
      close: () => void;
      setMarkerList?: undefined;
      change: (marker: markerStyle | null) => void;
    }) {
  const output = useRef<markerStyle>({ type: "", data: {} }); // this is output
  const [screen, setScreen] = useState<string>("line");

  useEffect(() => {
    if (isOpen && marker) {
      // try to set the screen to the correct one according to the marker
      const { type } = getMarkerData(marker);
      if (type !== "") {
        setScreen(type);
      }
    }
    if (isOpen && pseudoMarker) {
      setScreen(pseudoMarker.type);
    }
  }, [isOpen, marker, pseudoMarker]);

  const getMarker = useCallback(() => {
    if (marker) {
      return getMarkerData(marker) as markerStyle;
    }
    return pseudoMarker;
  }, []);

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
            <TabsTrigger value="layout" key="layout">
              Layout
            </TabsTrigger>
          </TabsList>
          <TabsContent value="line">
            <EditLineIcon
              marker={getMarker()}
              active={screen === "line"}
              output={output}
            />
          </TabsContent>
          <TabsContent value="icon">
            <EditGeneralIcon
              marker={getMarker()}
              active={screen === "icon"}
              output={output}
            />
          </TabsContent>
          <TabsContent value="layout">
            <EditLayout
              marker={getMarker()}
              active={screen === "layout"}
              output={output}
            />
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={() => {
              if (marker) {
                setMarkerList((markerList) =>
                  markerList.filter((m) => m.marker !== marker),
                );
                marker.remove();
                close();
              }
              if (pseudoMarker) {
                change(null);
                close();
              }
            }}
          >
            Delete
          </Button>
          <Button
            type="submit"
            onClick={() => {
              if (marker) {
                if (!output) return;
                const html = renderMarkerHtml(
                  output.current.type,
                  output.current.data,
                );
                replaceMarkerHtml(marker, html);
                close();
              }
              if (pseudoMarker) {
                change(output.current);
                close();
              }
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
