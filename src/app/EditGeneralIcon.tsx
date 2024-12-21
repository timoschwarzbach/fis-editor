import maplibregl from "maplibre-gl";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Button } from "~/components/ui/button";
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

const durationTable: Record<number, string> = {
  0: "0.5s",
  1: "1s",
  2: "2s",
  3: "5s",
  4: "10s",
};

export function EditGeneralIcon({
  isOpen,
  marker,
  setNewMarker,
}: {
  isOpen: boolean;
  marker: maplibregl.Marker;
  setNewMarker: (marker: HTMLElement) => void;
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
  const iconPreview = useRef<HTMLDivElement>(null);

  function updatePreview() {
    if (!iconPreview.current) return;
    iconPreview.current.innerHTML = GenerateIconHtml(formInput);
    setNewMarker(iconPreview.current.firstChild as HTMLElement);
  }

  function loadDefaultStyle() {
    try {
      const element = marker.getElement().firstChild as HTMLElement;
      const type = element.getAttribute("data-type");
      if (type !== "icon") return;
      const style = element.getAttribute("data-style");
      console.log(style);
      if (!style) return;
      setFormInput(JSON.parse(style));
    } catch (e) {
      console.log("error loading default style");
      console.error(e);
    }
  }

  useEffect(() => {
    if (isOpen) {
      setFormInput(defaultForm);
    }
    loadDefaultStyle();
  }, [marker, isOpen]);

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
          ref={iconPreview}
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

function GenerateIconHtml(data: formInput) {
  return renderToStaticMarkup(
    <div
      data-type="icon"
      data-style={JSON.stringify(data)}
      style={{
        backgroundColor: data.color,
        scale: data.scale,
        rotate: data.rotation + "deg",
      }}
      className="flex h-16 w-16 justify-center rounded-full bg-primary p-4 align-middle text-lg font-bold text-white"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 384 512"
        style={{
          animationName: data.animated ? "bounce-arrow" : "none",
          animationDuration: durationTable[4 - data.duration],
        }}
        className="animate-bounce-arrow fill-white"
      >
        <path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2 160 448c0 17.7 14.3 32 32 32s32-14.3 32-32l0-306.7L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z" />
      </svg>
    </div>,
  );
}
