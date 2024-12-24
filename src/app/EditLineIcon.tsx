import maplibregl from "maplibre-gl";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Button } from "~/components/ui/button";
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
  text: string;
  shape: string;
  scale: number;
};

export function EditLineIcon({
  isOpen,
  marker,
  setNewMarker,
}: {
  isOpen: boolean;
  marker: maplibregl.Marker;
  setNewMarker: (marker: HTMLElement) => void;
}) {
  const defaultForm = {
    color: "#ff0000",
    text: "S1",
    shape: "rectangle",
    scale: 1,
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
      if (type !== "label") return;
      const style = element.getAttribute("data-style");
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
          Color
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
        <Label htmlFor="name" className="text-right">
          Text
        </Label>
        <Input
          id="name"
          value={formInput.text}
          onChange={(e) => {
            setFormInput({ ...formInput, text: e.target.value });
          }}
          className="col-span-3"
        />
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
              <SelectItem value="rectangle">Rectangle (Default)</SelectItem>
              <SelectItem value="rounded">Rounded</SelectItem>
              <SelectItem value="trapezoid">Trapezoid</SelectItem>
              <SelectItem value="ferry">Ferry</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
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
        <Label className="text-right">Templates</Label>
        <Button
          variant="outline"
          onClick={() => {
            setFormInput({
              color: "#33A342",
              text: "S1",
              shape: "rounded",
              scale: 1,
            });
          }}
        >
          S-Bahn
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setFormInput({
              color: "#1569B1",
              text: "U1",
              shape: "rectangle",
              scale: 1,
            });
          }}
        >
          U-Bahn
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setFormInput({
              color: "#DC2221",
              text: "5",
              shape: "trapezoid",
              scale: 1,
            });
          }}
        >
          Bus (HH)
        </Button>
        <div></div>
        <Button
          variant="outline"
          onClick={() => {
            setFormInput({
              color: "#009ed4",
              text: "61",
              shape: "ferry",
              scale: 1,
            });
          }}
        >
          Boat (HH)
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setFormInput({
              color: "#272c34",
              text: "Text",
              shape: "rectangle",
              scale: 1,
            });
          }}
        >
          Label
        </Button>
      </div>
    </div>
  );
}

const TrapezoidStyle = {
  paddingTop: 0,
  paddingBottom: 0,
  WebkitClipPath:
    "polygon(80% 0, 100% 50%, 80% 100%, 20% 100%, 0% 50%, 20% 0%)",
  clipPath: "polygon(80% 0, 100% 50%, 80% 100%, 20% 100%, 0% 50%, 20% 0%)",
};
const FerryStyle = {
  WebkitClipPath: "polygon(0 0, 100% 0, 80% 100%, 20% 100%)",
  clipPath: "polygon(0 0, 100% 0, 80% 100%, 20% 100%)",
};
const RoundedStyle = {
  borderRadius: 9999,
};

const ShapeStyles: Record<string, CSSProperties> = {
  trapezoid: TrapezoidStyle,
  ferry: FerryStyle,
  rounded: RoundedStyle,
};

function GenerateIconHtml({
  color,
  text,
  shape,
  scale,
}: {
  color: string;
  text: string;
  shape: string;
  scale: number;
}) {
  return renderToStaticMarkup(
    <div
      data-type="label"
      data-style={JSON.stringify({
        color: color,
        text: text,
        shape: shape,
        scale: scale,
      })}
      style={{ backgroundColor: color, scale, ...ShapeStyles[shape] }}
      className="px-4 py-1 text-lg font-bold text-white"
    >
      {text}
    </div>,
  );
}
