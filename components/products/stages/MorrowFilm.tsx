"use client";

import { type CSSProperties, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/*
 * One of Morrow's 3D game films, as the Morrow app plays them (its components/brand/Loop.tsx):
 * glazed pieces lit in the game's colour on a see-through ground, over a faint fragment of an
 * Adamass painting (the game's back) and a paper studio. A film is an H.264 MP4 carrying its own
 * transparency, the colour in the top half and the opacity as grey in the bottom half; a small
 * WebGL canvas recombines them. At rest, and with reduced motion or without WebGL, the still
 * (the film's first frame) shows. A film starts on its first frame and ends on it.
 * Files: public/morrow/films/<id>-loop.mp4, <id>-still.webp, <id>-back.webp.
 */

export const filmSrc = (id: string) => `/morrow/films/${id}-loop.mp4`;
export const stillSrc = (id: string) => `/morrow/films/${id}-still.webp`;
export const backSrc = (id: string) => `/morrow/films/${id}-back.webp`;

const VERT = "attribute vec2 p;varying vec2 v;void main(){v=vec2(p.x*.5+.5,.5-p.y*.5);gl_Position=vec4(p,0.,1.);}";
// Colour from the top half, opacity from the bottom; values near black are video noise, so they are cut.
const FRAG =
  "precision mediump float;uniform sampler2D t;varying vec2 v;void main(){" +
  "vec3 c=texture2D(t,vec2(v.x,v.y*.5)).rgb;float a=texture2D(t,vec2(v.x,.5+v.y*.5)).r;" +
  "a=clamp((a-.03)/.94,0.,1.);gl_FragColor=vec4(min(c,vec3(a)),a);}";

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Plays the film over the still in `box` until stopped. Returns null without WebGL. */
function startFilm(box: HTMLElement, id: string, loop: boolean, onEnd?: () => void) {
  const canvas = document.createElement("canvas");
  canvas.width = 960;
  canvas.height = 720;
  canvas.setAttribute("aria-hidden", "true");
  canvas.dataset.film = "canvas";
  const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true, antialias: false });
  if (!gl) return null;
  const shader = (type: number, source: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, source);
    gl.compileShader(s);
    return s;
  };
  const program = gl.createProgram()!;
  gl.attachShader(program, shader(gl.VERTEX_SHADER, VERT));
  gl.attachShader(program, shader(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const at = gl.getAttribLocation(program, "p");
  gl.enableVertexAttribArray(at);
  gl.vertexAttribPointer(at, 2, gl.FLOAT, false, 0, 0);
  gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
  for (const [key, value] of [
    [gl.TEXTURE_MIN_FILTER, gl.LINEAR],
    [gl.TEXTURE_MAG_FILTER, gl.LINEAR],
    [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE],
    [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE],
  ] as const) {
    gl.texParameteri(gl.TEXTURE_2D, key, value);
  }

  // The film itself stays in the box, out of sight, so every browser decodes it.
  const video = document.createElement("video");
  video.muted = true;
  video.loop = loop;
  video.playsInline = true;
  video.preload = "auto";
  video.setAttribute("aria-hidden", "true");
  video.dataset.film = "source";
  video.src = filmSrc(id);
  box.append(video, canvas);

  let live = true;
  let raf = 0;
  let shown = false;
  const frameCallbacks = "requestVideoFrameCallback" in video;
  const draw = () => {
    if (!live) return;
    if (video.readyState >= 2) {
      const w = video.videoWidth;
      const h = video.videoHeight / 2;
      if (w && (canvas.width !== w || canvas.height !== h)) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, video);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (!shown) {
        shown = true;
        box.dataset.playing = "";
      }
    }
    if (frameCallbacks) video.requestVideoFrameCallback(draw);
    else raf = requestAnimationFrame(draw);
  };
  if (frameCallbacks) video.requestVideoFrameCallback(draw);
  else raf = requestAnimationFrame(draw);

  // Start only once it can play through; starting on a few buffered frames stutters.
  const go = () => {
    if (live) void video.play().catch(() => {});
  };
  if (video.readyState >= 4) go();
  else video.addEventListener("canplaythrough", go, { once: true });
  if (onEnd) video.addEventListener("ended", onEnd, { once: true });

  return () => {
    // Dissolve back into the still (CSS fades the canvas out), then let go of the film.
    delete box.dataset.playing;
    canvas.dataset.out = "";
    const end = () => {
      live = false;
      cancelAnimationFrame(raf);
      video.pause();
      video.removeAttribute("src");
      video.load();
      video.remove();
      canvas.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
    if (shown) window.setTimeout(end, 300);
    else end();
  };
}

type MorrowFilmProps = {
  id: string;
  /** Plays while true; at rest the still shows. */
  playing: boolean;
  /** Play on repeat; otherwise once, calling onEnd as it lands back on its first frame. */
  loop?: boolean;
  onEnd?: () => void;
  /** Leave the painted back out (the film over a painting of its own, on a work card). */
  bare?: boolean;
  className?: string;
};

/** A Morrow game film: the still at rest, the film while `playing`. */
export function MorrowFilm({ id, playing, loop = false, onEnd, bare = false, className }: MorrowFilmProps) {
  const box = useRef<HTMLSpanElement>(null);
  const ended = useRef(onEnd);
  useEffect(() => {
    ended.current = onEnd;
  }, [onEnd]);

  useEffect(() => {
    const el = box.current;
    if (!el || !playing || reducedMotion()) return;
    const stop = startFilm(el, id, loop, () => ended.current?.());
    return () => stop?.();
  }, [id, playing, loop]);

  return (
    <span
      ref={box}
      className={cn("morrow-film", bare && "is-bare", className)}
      style={{ "--film-back": `url(${backSrc(id)})` } as CSSProperties}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- a transparent still under the film's canvas */}
      <img src={stillSrc(id)} alt="" aria-hidden draggable={false} decoding="async" data-film="still" />
    </span>
  );
}
