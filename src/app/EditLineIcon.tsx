import { MutableRefObject, useEffect, useState } from "react";
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
import { markerStyle } from "./EditElementDialog";
import { renderLineIcon } from "./RenderMarker";

type formInput = {
  color: string;
  text: string;
  shape: string;
  scale: number;
};

export function EditLineIcon({
  active,
  marker,
  output,
}: {
  active: boolean;
  marker: markerStyle;
  output: MutableRefObject<markerStyle>;
}) {
  const defaultForm = {
    color: "#ff0000",
    text: "S1",
    shape: "rectangle",
    scale: 1,
  };
  const [formInput, setFormInput] = useState<formInput>(defaultForm);

  // load the form from current data
  function loadStyleFromMarker() {
    try {
      if (!isLabelDataType(marker.data)) {
        throw "data not in correct format";
      }
      setFormInput(marker.data);
    } catch {}
  }
  useEffect(() => {
    if (active) {
      setFormInput(defaultForm);
    }
    loadStyleFromMarker();
  }, [marker, active]);

  // update parent dialog's data when form changes
  useEffect(() => {
    output.current = { type: "label", data: formInput };
  }, [formInput]);

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="preview" className="text-right">
          Preview
        </Label>
        <div className="col-span-3 flex h-20 items-center justify-center">
          {renderLineIcon(formInput)}
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

function isLabelDataType(data: any): data is formInput {
  return (
    typeof data.color === "string" &&
    typeof data.text === "string" &&
    typeof data.shape === "string" &&
    typeof data.scale === "number"
  );
}
