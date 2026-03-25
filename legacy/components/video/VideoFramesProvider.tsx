"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { framePath, framePathV2, TOTAL_FRAMES } from "./videoShared";

function loadSequence(
  pathFn: (i: number) => string,
  label: string
): Promise<HTMLImageElement[]> {
  const imgs: HTMLImageElement[] = [];
  const promises: Promise<void>[] = [];
  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const img = new Image();
    img.decoding = "async";
    imgs.push(img);
    promises.push(
      new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () =>
          reject(new Error(`Failed to load ${label}: ${pathFn(i)}`));
        img.src = pathFn(i);
      })
    );
  }
  return Promise.all(promises).then(() => imgs);
}

type Ctx = {
  loaded: boolean;
  images: HTMLImageElement[] | null;
  loadedReverse: boolean;
  imagesReverse: HTMLImageElement[] | null;
};

const VideoFramesContext = createContext<Ctx>({
  loaded: false,
  images: null,
  loadedReverse: false,
  imagesReverse: null,
});

export function VideoFramesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loaded, setLoaded] = useState(false);
  const [images, setImages] = useState<HTMLImageElement[] | null>(null);
  const [loadedReverse, setLoadedReverse] = useState(false);
  const [imagesReverse, setImagesReverse] = useState<HTMLImageElement[] | null>(
    null
  );

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const forwardP = loadSequence(framePath, "forward");
      const reverseP = loadSequence(framePathV2, "reverse (framesv2)");

      let forward: HTMLImageElement[];
      try {
        forward = await forwardP;
        if (cancelled) return;
        setImages(forward);
        setLoaded(true);
      } catch {
        if (!cancelled) {
          console.error(
            "[VideoFrames] Forward preload failed — check TOTAL_FRAMES and public/frames/"
          );
        }
        return;
      }

      let reverse: HTMLImageElement[];
      try {
        reverse = await reverseP;
      } catch {
        if (!cancelled) {
          console.warn(
            "[VideoFrames] public/framesv2/ missing or incomplete — reverse scroll uses /frames/"
          );
        }
        reverse = forward;
      }
      if (cancelled) return;
      setImagesReverse(reverse);
      setLoadedReverse(true);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({ loaded, images, loadedReverse, imagesReverse }),
    [loaded, images, loadedReverse, imagesReverse]
  );

  return (
    <VideoFramesContext.Provider value={value}>
      {children}
    </VideoFramesContext.Provider>
  );
}

export function useVideoFrames() {
  return useContext(VideoFramesContext);
}

export { TOTAL_FRAMES };
