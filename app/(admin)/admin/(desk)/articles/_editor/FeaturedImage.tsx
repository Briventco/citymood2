"use client";

import { Camera } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { mediaSrc } from "@/lib/admin/media-url";
import type { Media } from "@/lib/admin/types";
import { MediaPicker } from "../../../_components/MediaPicker";
import { FieldError, Notice, button, inputClass, labelClass, sectionLabelClass } from "../../../_components/ui";
import { usePhotoUpload } from "../../../_components/usePhotoUpload";

// Featured image with alt text (required to publish), caption, credit and a
// focal point. The focal point is set by clicking the photo, or with the arrow
// keys when it has focus. Alt, caption, credit and focal point belong to the
// photo (the media table), so they follow it into every story that uses it.

export type ImageMetaPatch = Partial<Pick<Media, "alt" | "caption" | "credit" | "focal_x" | "focal_y">>;

type Props = {
  image: Media | null;
  onSelect: (media: Media | null) => void;
  onMeta: (patch: ImageMetaPatch) => void;
  /** Show "Needed before publishing" emphasis after a publish attempt. */
  showErrors: boolean;
  variant: "desktop" | "mobile";
};

/** The photo's box inside a 16:9 (or 16:10) frame, drawn with object-contain so clicks map to the whole photo. */
function containRect(frameW: number, frameH: number, w: number, h: number) {
  const scale = Math.min(frameW / w, frameH / h);
  const width = w * scale;
  const height = h * scale;
  return { left: (frameW - width) / 2, top: (frameH - height) / 2, width, height };
}

function FocalPicker({ image, onMeta, ratio }: { image: Media; onMeta: Props["onMeta"]; ratio: string }) {
  const frame = useRef<HTMLButtonElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const w = image.width ?? 3;
  const h = image.height ?? 2;
  const rect = size ? containRect(size.w, size.h, w, h) : null;
  const set = (x: number, y: number) =>
    onMeta({ focal_x: Math.round(Math.min(1, Math.max(0, x)) * 100) / 100, focal_y: Math.round(Math.min(1, Math.max(0, y)) * 100) / 100 });

  return (
    <button
      ref={frame}
      type="button"
      aria-label={`Focal point: ${Math.round(image.focal_x * 100)}% across, ${Math.round(image.focal_y * 100)}% down. Click the photo or use the arrow keys to move it.`}
      onClick={(e) => {
        const el = frame.current!;
        const box = el.getBoundingClientRect();
        const r = containRect(box.width, box.height, w, h);
        set((e.clientX - box.left - r.left) / r.width, (e.clientY - box.top - r.top) / r.height);
      }}
      onKeyDown={(e) => {
        const step = e.shiftKey ? 0.1 : 0.05;
        const moves: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
        const m = moves[e.key];
        if (!m) return;
        e.preventDefault();
        set(image.focal_x + m[0], image.focal_y + m[1]);
      }}
      className={`relative block w-full cursor-crosshair overflow-hidden bg-cm-black ${ratio}`}
    >
      <Image src={mediaSrc(image)} alt="" fill sizes="(min-width: 1024px) 440px, 100vw" className="object-contain" />
      {rect && (
        <span
          aria-hidden="true"
          className="absolute size-7 -translate-x-1/2 -translate-y-1/2 border-2 border-cm-lime outline outline-1 outline-cm-black"
          style={{ left: rect.left + image.focal_x * rect.width, top: rect.top + image.focal_y * rect.height }}
        />
      )}
    </button>
  );
}

export function FeaturedImage({ image, onSelect, onMeta, showErrors, variant }: Props) {
  const camera = useRef<HTMLInputElement>(null);
  const gallery = useRef<HTMLInputElement>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const photo = usePhotoUpload();
  const altMissing = !!image && !image.alt.trim();
  const mobile = variant === "mobile";

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const media = await photo.upload(file, { credit: "CityMood" });
    if (media) onSelect(media);
  }

  const fileInputs = (
    <>
      <input ref={camera} type="file" accept="image/*" capture="environment" className="sr-only" tabIndex={-1} aria-hidden="true" onChange={onFile} />
      <input ref={gallery} type="file" accept="image/*" className="sr-only" tabIndex={-1} aria-hidden="true" onChange={onFile} />
    </>
  );

  const altField = image && (
    <div>
      <label htmlFor="image-alt" className={`${labelClass} flex items-center gap-1.5`}>
        Alt text <span className="font-semibold text-cm-meta">(required)</span>
      </label>
      <input
        id="image-alt"
        value={image.alt}
        onChange={(e) => onMeta({ alt: e.target.value })}
        placeholder="Describe what the photo shows"
        aria-invalid={altMissing || undefined}
        aria-describedby={altMissing ? "image-alt-error" : undefined}
        className={`${inputClass} ${altMissing ? "border-2 border-cm-black" : ""}`}
      />
      {altMissing && (
        <FieldError id="image-alt-error">{showErrors ? "Add alt text to publish this story" : "Needed before publishing"}</FieldError>
      )}
    </div>
  );

  const textField = (id: "caption" | "credit", label: string) =>
    image && (
      <div>
        <label htmlFor={`image-${id}`} className={labelClass}>
          {label}
        </label>
        <input id={`image-${id}`} value={image[id]} onChange={(e) => onMeta({ [id]: e.target.value })} className={inputClass} />
      </div>
    );

  const picker = (
    <MediaPicker
      open={pickerOpen}
      title="Choose the featured photo"
      onClose={() => setPickerOpen(false)}
      onPick={(m) => {
        setPickerOpen(false);
        onSelect(m);
      }}
    />
  );

  const status = (
    <>
      {photo.uploading && (
        <p role="status" className="mt-1.5 text-[13px] font-bold">
          Resizing and uploading…
        </p>
      )}
      {photo.error && (
        <div className="mt-2">
          <Notice tone="error">{photo.error}</Notice>
        </div>
      )}
    </>
  );

  if (!image) {
    return (
      <div>
        <p id="featured-image-label" className={`${sectionLabelClass} mb-2`}>
          {mobile ? "Photo" : "Featured image"}
        </p>
        {fileInputs}
        <div className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed border-cm-ad-border bg-cm-paper p-4 ${mobile ? "aspect-[16/10]" : "aspect-[16/7]"}`}>
          <Camera aria-hidden="true" className="size-9" strokeWidth={1.6} />
          <div className="flex flex-wrap justify-center gap-2">
            {mobile ? (
              <>
                <button type="button" onClick={() => camera.current?.click()} disabled={photo.uploading} className={button.dark}>
                  Take photo
                </button>
                <button type="button" onClick={() => gallery.current?.click()} disabled={photo.uploading} className={button.secondary}>
                  Choose
                </button>
              </>
            ) : (
              <>
                <button type="button" onClick={() => gallery.current?.click()} disabled={photo.uploading} className={button.secondary}>
                  Upload photo
                </button>
                <button type="button" onClick={() => setPickerOpen(true)} className={button.secondary}>
                  Choose from library
                </button>
              </>
            )}
          </div>
        </div>
        <p className="mt-1.5 text-[13px] text-cm-meta">Photos are resized on upload to save data.</p>
        {status}
        {picker}
      </div>
    );
  }

  const actions = (
    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
      <span className="text-cm-meta">{mobile ? "Tap the photo to set its focal point." : "Click the photo to set its focal point."}</span>
      <div className="ml-auto flex gap-2">
        <button type="button" onClick={() => (mobile ? gallery.current?.click() : setPickerOpen(true))} className={button.outline}>
          Replace
        </button>
        <button type="button" onClick={() => onSelect(null)} className={button.outline}>
          Remove
        </button>
      </div>
    </div>
  );

  if (mobile) {
    return (
      <div className="flex flex-col gap-3">
        <p className={sectionLabelClass}>Photo</p>
        {fileInputs}
        <div>
          <FocalPicker image={image} onMeta={onMeta} ratio="aspect-[16/10]" />
          {actions}
          {status}
        </div>
        {altField}
      </div>
    );
  }

  return (
    <div>
      <p className={`${sectionLabelClass} mb-2`}>Featured image</p>
      {fileInputs}
      <div className="flex flex-wrap gap-5">
        <div className="min-w-0 flex-[3_1_300px]">
          <FocalPicker image={image} onMeta={onMeta} ratio="aspect-video" />
          {actions}
          {status}
        </div>
        <div className="flex min-w-0 flex-[2_1_220px] flex-col gap-3">
          {altField}
          {textField("caption", "Caption")}
          {textField("credit", "Credit")}
        </div>
      </div>
      {picker}
    </div>
  );
}

/** Caption and credit, for the mobile "More details" section. */
export function ImageDetailFields({ image, onMeta }: { image: Media; onMeta: Props["onMeta"] }) {
  return (
    <>
      {(["caption", "credit"] as const).map((id) => (
        <div key={id}>
          <label htmlFor={`image-${id}`} className={labelClass}>
            {id === "caption" ? "Photo caption" : "Photo credit"}
          </label>
          <input id={`image-${id}`} value={image[id]} onChange={(e) => onMeta({ [id]: e.target.value })} className={inputClass} />
        </div>
      ))}
    </>
  );
}
