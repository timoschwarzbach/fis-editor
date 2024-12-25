import maplibregl from "maplibre-gl";
import { useEffect, useRef, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Label } from "~/components/ui/label";
import { exportMarker, getMarkerData, renderMarkerHtml } from "./RenderMarker";
import { markerStyle } from "./EditElementDialog";

type formInput = {
  direction: "row" | "column";
  gap: number;
  items: exportMarker[];
};

export function EditLayout({
  active,
  marker,
  setData,
}: {
  active: boolean;
  marker: maplibregl.Marker;
  setData: (data: markerStyle) => void;
}) {
  const defaultForm = {
    direction: "row" as "row" | "column",
    gap: 4,
    items: [],
  };
  const [formInput, setFormInput] = useState<formInput>(defaultForm);
  const preview = useRef<HTMLDivElement>(null);

  function updatePreview() {
    if (!preview.current) return;
    preview.current.innerHTML = renderLayoutFirstLevelDraggable(formInput);
    setData({ type: "layout", data: formInput });
  }

  function loadStyleFromMarker() {
    try {
      const { data } = getMarkerData(marker);
      if (!isLayoutDataType(data)) {
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
    </div>
  );
}

function renderLayoutFirstLevelDraggable(data: {
  direction: "row" | "column";
  gap: number;
  items: exportMarker[];
}) {
  return renderToStaticMarkup(
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
      {data.items.map((marker, index) => {
        try {
          return (
            <div
              key={index}
              dangerouslySetInnerHTML={{
                __html: renderMarkerHtml(marker.type, marker.data),
              }}
            />
          );
        } catch {
          return <>error rendering marker</>;
        }
      })}
    </div>,
  );
}

function isLayoutDataType(data: any): data is formInput {
  return (
    typeof data.direction === "string" &&
    typeof data.gap === "number" &&
    Array.isArray(data.items)
  );
}
