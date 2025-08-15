"use client";
import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Link,
  File,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Utility to detect file type
// const getFileType = (type) => {
//   if (type.startsWith("image/")) return "image";
//   if (type.startsWith("video/")) return "video";
//   if (type === "application/pdf") return "pdf";
// };

const getFileType = (type) => {
  switch (true) {
    case type.startsWith("image/"):
      return "image";
    case type.startsWith("video/"):
      return "video";
    case type === "application/pdf":
      return "pdf";
    case type.startsWith("link"):
      return "link";
    default:
      return "file"; // fallback icon
  }
};
export const EmblaCarousel = ({ materialData = [] }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [fullscreenIndex, setFullscreenIndex] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      const index = emblaApi.selectedScrollSnap();
      setSelectedIndex(index);
    };

    onSelect(); // ✅ Force update immediately after mount
    emblaApi.on("select", onSelect);
    return () => emblaApi.off("select", onSelect);
  }, [emblaApi]);

  const progress =
    materialData.length > 0
      ? ((selectedIndex + 1) / materialData.length) * 100
      : 0;

  return (
    <div className="embla w-full h-full ">
      {/* Main Carousel */}
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container flex w-full">
          {materialData.map((item, index) => {
            const type = getFileType(item.type);
            return (
              <div
                className="embla__slide flex-[0_0_100%] sm:px-4 relative "
                key={item.id || index}
              >
                {/* Fullscreen Trigger */}
                <button
                  onClick={() => setFullscreenIndex(index)}
                  className="hover:cursor-pointer absolute top-2 right-2 z-10 p-2 bg-white/80 rounded-full hover:bg-white"
                  title="Fullscreen"
                >
                  <Maximize2 size={18} />
                </button>

                <div className="max-h-[500px] w-full rounded-md overflow-hidden flex items-center justify-center bg-gray-100">
                  {type === "image" && (
                    <Image
                      src={item.url}
                      alt={item.name || `Image ${index + 1}`}
                      width={1920}
                      height={1080}
                      className="object-contain max-h-[500px] w-full"
                    />
                  )}
                  {type === "video" && (
                    <video
                      controls
                      className="w-full max-h-[500px] rounded-md"
                      src={item.url}
                    />
                  )}
                  {type === "pdf" && (
                    <iframe
                      src={item.url}
                      className="w-full h-[500px] rounded-md"
                    />
                  )}
                  {type === "file" && (
                    <div className="w-full h-[500px] gap-2 rounded-md bg-gray-100 flex items-center justify-center">
                      <div className="p-2 border rounded-md bg-white shadow-sm">
                        <File size={20} className=" " />
                      </div>
                      <p className="text-center text-gray-500 text-sm truncate w-[200px]">
                        {item.name}
                      </p>
                    </div>
                  )}
                  {type === "link" && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="sm:w-full gap-2 h-[500px] rounded-md bg-gray-100 flex items-center justify-center">
                        <Button variant="outline" size="icon">
                          <Link size={20} />
                        </Button>
                        <p className="text-center text-gray-500 text-sm truncate w-[200px]">
                          {item.name}
                        </p>
                      </div>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 items-center justify-between mt-4">
        <div className="flex gap-2 mt-4">
          <Button
            onClick={scrollPrev}
            variant="outline"
            size="icon"
            className="hover:cursor-pointer"
          >
            <ChevronLeft size={20} />
          </Button>
          <Button
            onClick={scrollNext}
            variant="outline"
            size="icon"
            className="hover:cursor-pointer"
          >
            <ChevronRight size={20} />
          </Button>
        </div>

        <ProgressPrimitive.Root
          className="relative mt-4 h-2 w-full overflow-hidden rounded bg-gray-200"
          value={progress}
        >
          <ProgressPrimitive.Indicator
            className="h-full bg-black transition-all"
            style={{ width: `${progress}%` }}
          />
        </ProgressPrimitive.Root>
      </div>

      {/* Fullscreen Modal */}
      <Dialog
        open={fullscreenIndex !== null}
        onOpenChange={() => setFullscreenIndex(null)}
      >
        <DialogContent
          showoverlay="false"
          className="min-w-screen min-h-screen p-0 bg-white"
        >
          <DialogTitle hidden />
          <DialogClose className="absolute z-10 right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            <X className="h-4 w-4 text-red-500" size={40} />{" "}
            {/* 👈 Change color here */}
            <span className="sr-only">Close</span>
          </DialogClose>
          {fullscreenIndex !== null && (
            <FullscreenCarousel
              materialData={materialData}
              startIndex={fullscreenIndex}
              onClose={() => setFullscreenIndex(null)}
              onIndexChange={(i) => setFullscreenIndex(i)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Fullscreen Carousel Component
const FullscreenCarousel = ({
  materialData,
  startIndex,
  onClose,
  onIndexChange,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ startIndex });

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      const i = emblaApi.selectedScrollSnap();
      onIndexChange(i);
    };
    emblaApi.on("select", onSelect);
    onSelect();
    return () => emblaApi.off("select", onSelect);
  }, [emblaApi, onIndexChange]);

  return (
    <div className="embla__viewport w-full h-full " ref={emblaRef}>
      <div className="embla__container flex h-full ">
        {materialData.map((item, i) => {
          const type = getFileType(item.type);
          return (
            <div
              key={i}
              className="embla__slide flex-[0_0_100%] flex items-center justify-center bg-black sm:px-4 "
            >
              {type === "image" && (
                <Image
                  src={item.url}
                  alt={item.name || `Image ${i}`}
                  width={1920}
                  height={1080}
                  className="w-full h-full object-contain max-h-screen"
                />
              )}
              {type === "video" && (
                <video
                  controls
                  className="w-full h-full object-contain max-h-screen"
                  src={item.url}
                />
              )}
              {type === "pdf" && (
                <iframe src={item.url} className="w-full h-screen" />
              )}
              {type === "file" && (
                <div className="w-full h-[500px] rounded-md bg-gray-100 flex items-center justify-center">
                  <File size={20} />
                  <p>{item.name}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
