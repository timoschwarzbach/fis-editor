import maplibregl from "maplibre-gl";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { set } from "zod";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Slider } from "~/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { EditLineIcon } from "./EditLineIcon";
import { EditGeneralIcon } from "./EditGeneralIcon";

type formInput = {
  color: string;
  text: string;
  shape: string;
  scale: number;
};

export function EditElementDialog({
  isOpen,
  marker,
  close,
}: {
  isOpen: boolean;
  marker: maplibregl.Marker;
  close: () => void;
}) {
  const [newMarker, setNewMarker] = useState<HTMLElement | null>(null);
  const [defaultScreen, setDefaultScreen] = useState<string>("line");

  function loadCorrectScreen() {
    try {
      const element = marker.getElement().firstChild as HTMLElement;
      const type = element.getAttribute("data-type");
      if (!type) return;
      setDefaultScreen(type);
    } catch (e) {
      console.log("error loading screen");
      console.error(e);
    }
  }

  useEffect(() => {
    if (isOpen) {
      loadCorrectScreen();
    }
  }, [isOpen, marker]);

  return (
    <Dialog defaultOpen open={isOpen} onOpenChange={close}>
      <DialogContent className="text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Icon</DialogTitle>
          <DialogDescription>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga, rem?
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue={defaultScreen}>
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
              isOpen={isOpen}
              setNewMarker={setNewMarker}
            />
          </TabsContent>
          <TabsContent value="icon">
            <EditGeneralIcon
              marker={marker}
              isOpen={isOpen}
              setNewMarker={setNewMarker}
            />
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button
            variant="destructive"
            onClick={() => {
              marker.remove();
              close();
            }}
          >
            Delete
          </Button>
          <Button
            type="submit"
            onClick={() => {
              if (!newMarker) return;
              changeMarker(marker, newMarker);
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

function changeMarker(marker: maplibregl.Marker, newElement: HTMLElement) {
  const element = marker.getElement().firstChild;
  if (!element) throw "No html";
  element.replaceWith(newElement);
}
