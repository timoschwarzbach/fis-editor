import { MutableRefObject, useEffect, useRef } from "react";

export function EditMap({
  map,
}: {
  map: MutableRefObject<maplibregl.Map | null>;
}) {
  const zoomInput = useRef<HTMLInputElement>(null);
  const latInput = useRef<HTMLInputElement>(null);
  const lonInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!map.current) return;
    const zoomListener = () => {
      const input = zoomInput.current;
      if (!input) return;
      const zoom = map.current?.getZoom();
      input.value = (zoom || input.value).toString();
    };
    const moveListener = () => {
      const [lat, lon] = [latInput.current, lonInput.current];
      if (!lat || !lon) return;
      const postition = map.current?.getCenter();
      lat.value = (postition?.lat || lat).toString();
      lon.value = (postition?.lng || lon).toString();
    };
    map.current.on("zoomend", zoomListener);
    map.current.on("move", moveListener);
    return () => {
      if (!map.current) return;
      map.current.off("zoomend", zoomListener);
      map.current.off("move", moveListener);
    };
  });

  const onPositionInputBlur = () => {
    const lat =
      parseFloat(latInput.current?.value!) ||
      map.current?.getCenter()?.lat ||
      0;
    const lon =
      parseFloat(lonInput.current?.value!) ||
      map.current?.getCenter()?.lng ||
      0;
    try {
      map.current?.setCenter([lat, lon]);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-1">
      <span>Zoom</span>
      <input
        ref={zoomInput}
        type="number"
        className="col-span-2 rounded-sm text-center text-black"
        onBlur={() => {
          try {
            const zoom = parseFloat(zoomInput.current?.value!);
            if (zoom < 0 || zoom > 20) return;
            map.current?.setZoom(zoom);
          } catch (e) {
            console.error(e);
          }
        }}
      />
      <span>Center</span>
      <input
        ref={latInput}
        type="number"
        className="rounded-sm text-center text-black" /* lat */
        onBlur={onPositionInputBlur}
      />
      <input
        ref={lonInput}
        type="number"
        className="rounded-sm text-center text-black" /* lon */
        onBlur={onPositionInputBlur}
      />
      <span>Rotation</span>
      <span className="col-span-2">-</span>
      <span>Tilt</span>
      <span className="col-span-2">-</span>
    </div>
  );
}
