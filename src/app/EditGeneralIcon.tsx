import maplibregl from "maplibre-gl";
import { useEffect, useRef, useState } from "react";
import { Checkbox } from "~/components/ui/checkbox";
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
import { markerStyle } from "./EditElementDialog";
import { getMarkerData, renderMarkerHtml } from "./RenderMarker";

type formInput = {
  color: string;
  stroke: string;
  icon: string;
  shape: string;
  animated: boolean;
  duration: number;
  scale: number;
  rotation: number;
};

export function EditGeneralIcon({
  active,
  marker,
  setData,
}: {
  active: boolean;
  marker: maplibregl.Marker;
  setData: (data: markerStyle) => void;
}) {
  const defaultForm = {
    color: "#272c34",
    stroke: "#ffffff",
    icon: "arrow",
    shape: "circle",
    animated: true,
    duration: 2,
    scale: 1,
    rotation: 0,
  };
  const [formInput, setFormInput] = useState<formInput>(defaultForm);
  const preview = useRef<HTMLDivElement>(null);

  function updatePreview() {
    if (!preview.current) return;
    preview.current.innerHTML = renderMarkerHtml("icon", formInput);
    setData({ type: "icon", data: formInput });
  }

  function loadStyleFromMarker() {
    try {
      const { data } = getMarkerData(marker);
      if (!isIconDataType(data)) {
        throw "data not in correct format";
      }
      setFormInput(data);
    } catch {}
  }

  useEffect(() => {
    if (active) {
      setFormInput(defaultForm);
    }
    loadStyleFromMarker();
  }, [marker, active]);

  useEffect(() => {
    updatePreview();
  }, [formInput]);

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="preview" className="text-right">
          Preview
        </Label>
        <div
          ref={preview}
          className="col-span-3 flex h-20 items-center justify-center"
        >
          <span>Loading...</span>
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="colorText" className="text-right">
          Background
        </Label>
        <Input
          id="color"
          type="color"
          value={formInput.color}
          onChange={(e) => {
            setFormInput({ ...formInput, color: e.target.value });
          }}
        />
        <Input
          id="colorText"
          type="text"
          value={formInput.color}
          onChange={(e) => {
            setFormInput({
              ...formInput,
              color: e.target.value,
            });
          }}
          className="col-span-2"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="strokeText" className="text-right">
          Stroke
        </Label>
        <Input
          id="stroke"
          type="color"
          value={formInput.stroke}
          onChange={(e) => {
            setFormInput({ ...formInput, stroke: e.target.value });
          }}
        />
        <Input
          id="strokeText"
          type="text"
          value={formInput.stroke}
          onChange={(e) => {
            setFormInput({
              ...formInput,
              stroke: e.target.value,
            });
          }}
          className="col-span-2"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="icon" className="text-right">
          Icon
        </Label>
        <Select
          onValueChange={(value) => {
            setFormInput({ ...formInput, icon: value });
          }}
          value={formInput.icon}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue id="icon" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Icons</SelectLabel>
              <SelectItem value="arrow">Arrow</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="construction">Construction</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="shape" className="text-right">
          Shape
        </Label>
        <Select
          onValueChange={(value) => {
            setFormInput({ ...formInput, shape: value });
          }}
          value={formInput.shape}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue id="shape" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Shapes</SelectLabel>
              <SelectItem value="circle">Circle (Default)</SelectItem>
              <SelectItem value="rounded">Rounded</SelectItem>
              <SelectItem value="square">Square</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="animated" className="text-right">
          Animation
        </Label>
        <Checkbox
          id="animated"
          checked={formInput.animated}
          onClick={(e) => {
            setFormInput({ ...formInput, animated: !formInput.animated });
          }}
        />
        <Slider
          id="duration"
          className="col-span-2"
          disabled={!formInput.animated}
          value={[formInput.duration]}
          min={0}
          max={4}
          step={1}
          onValueChange={(value) => {
            setFormInput({ ...formInput, duration: value[0] ?? 2 });
          }}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="size" className="text-right">
          Size
        </Label>
        <Slider
          id="size"
          className="col-span-3"
          value={[formInput.scale]}
          max={2}
          step={0.1}
          onValueChange={(value) => {
            setFormInput({ ...formInput, scale: value[0] ?? 1 });
          }}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="rotation" className="text-right">
          Rotation
        </Label>
        <Slider
          id="rotation"
          className="col-span-3"
          value={[formInput.rotation]}
          max={360}
          step={45}
          onValueChange={(value) => {
            setFormInput({ ...formInput, rotation: (value[0] ?? 0) % 360 });
          }}
        />
      </div>
    </div>
  );
}

function isIconDataType(data: any): data is formInput {
  return (
    typeof data.color === "string" &&
    typeof data.stroke === "string" &&
    typeof data.icon === "string" &&
    typeof data.shape === "string" &&
    typeof data.animated === "boolean" &&
    typeof data.duration === "number" &&
    typeof data.scale === "number" &&
    typeof data.rotation === "number"
  );
}
