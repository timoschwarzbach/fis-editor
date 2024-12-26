import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { Label } from "~/components/ui/label";
import { renderMarkerHtml } from "./RenderMarker";
import { EditElementDialog, markerStyle } from "./EditElementDialog";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

type formInput = {
  direction: "row" | "column";
  gap: number;
  items: markerStyle[];
};

export function EditLayout({
  active,
  marker,
  output,
}: {
  active: boolean;
  marker: markerStyle;
  output: MutableRefObject<markerStyle>;
}) {
  const defaultForm = {
    direction: "row" as "row" | "column",
    gap: 4,
    items: [],
  };
  const [formInput, setFormInput] = useState<formInput>(defaultForm);

  // load the form from current data
  function loadStyleFromMarker() {
    try {
      if (!isLayoutDataType(marker.data)) {
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
    output.current = { type: "layout", data: formInput };
  }, [formInput]);

  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="preview" className="text-right">
          Preview layout
        </Label>
        <div className="col-span-3 flex h-20 items-center justify-center">
          <LayoutFirstLevelDraggable data={formInput} update={setFormInput} />
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="direction" className="text-right">
          Direction
        </Label>
        <Select
          onValueChange={(value) => {
            if (value === "row" || value === "column") {
              setFormInput({ ...formInput, direction: value });
            }
          }}
          value={formInput.direction}
        >
          <SelectTrigger className="col-span-3">
            <SelectValue id="icon" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Direction</SelectLabel>
              <SelectItem value="row">Horizontal</SelectItem>
              <SelectItem value="column">Vertical</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function LayoutFirstLevelDraggable({
  update,
  data,
}: {
  update: Dispatch<SetStateAction<formInput>>;
  data: {
    direction: "row" | "column";
    gap: number;
    items: markerStyle[];
  };
}) {
  return (
    <div
      data-type="layout"
      data-style={JSON.stringify(data)}
      style={{
        display: "flex",
        flexDirection: data.direction,
        alignItems: "center",
        justifyContent: "center",
        gap: data.gap,
      }}
    >
      {data.items.map((marker, index) => (
        <LayoutElement
          key={index}
          item={marker}
          index={index}
          update={update}
        />
      ))}
    </div>
  );
}

function LayoutElement({
  item,
  index,
  update,
}: {
  item: markerStyle;
  index: number;
  update: Dispatch<SetStateAction<formInput>>;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        variant="outline"
        className="p-2"
        onClick={() => {
          setOpen(true);
        }}
      >
        <div
          dangerouslySetInnerHTML={{
            __html: renderMarkerHtml(item.type, item.data),
          }}
        />
      </Button>
      <EditElementDialog
        isOpen={open}
        pseudoMarker={item}
        close={() => {
          setOpen(false);
        }}
        change={(marker) => {
          if (!marker) {
            // remove marker
            update((prev) => ({
              ...prev,
              items: prev.items.filter((_, i) => i !== index),
            }));
          } else {
            // update marker
            update((prev) => ({
              ...prev,
              items: prev.items.map((m, i) => (i === index ? marker : m)),
            }));
          }
        }}
      />
    </>
  );
}

function isLayoutDataType(data: any): data is formInput {
  return (
    typeof data.direction === "string" &&
    typeof data.gap === "number" &&
    Array.isArray(data.items)
  );
}
