"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

export type FilmIntroDissolveHandle = {
  setProgress: (progress: number) => void;
};

const vertexSource = `
  attribute vec2 aPosition;

  void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const fragmentSource = `
  precision mediump float;

  uniform vec2 uResolution;
  uniform float uProgress;
  uniform sampler2D uDistanceMap;

  float hash(vec2 point) {
    point = fract(point * vec2(123.34, 456.21));
    point += dot(point, point + 45.32);
    return fract(point.x * point.y);
  }

  vec2 hash22(vec2 point) {
    return vec2(
      hash(point),
      hash(point + vec2(37.2, 17.7))
    );
  }

  float bubbleField(vec2 point) {
    vec2 cell = floor(point);
    vec2 local = fract(point);
    float nearest = 2.0;

    for (int y = -1; y <= 1; y++) {
      for (int x = -1; x <= 1; x++) {
        vec2 neighbour = vec2(float(x), float(y));
        vec2 id = cell + neighbour;
        vec2 center = neighbour + hash22(id);
        float radius = mix(
          0.90,
          1.45,
          hash(id + vec2(9.4, 23.8))
        );
        nearest = min(nearest, length(center - local) / radius);
      }
    }

    return min(nearest, 1.0);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    float distanceFromCopy = texture2D(uDistanceMap, uv).r;
    float bubbleSize = max(140.0, uResolution.y / 5.2);
    float bubbles = bubbleField(gl_FragCoord.xy / bubbleSize);
    float threshold = clamp(
      0.04 + distanceFromCopy * 0.74 + bubbles * 0.16,
      0.05,
      0.92
    );
    float alpha = 1.0 - smoothstep(
      threshold - 0.11,
      threshold + 0.11,
      uProgress
    );

    gl_FragColor = vec4(vec3(1.0), alpha);
  }
`;

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

const FilmIntroDissolve = forwardRef<FilmIntroDissolveHandle>(
  function FilmIntroDissolve(_, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const progressRef = useRef(0);
    const renderRef = useRef<(progress: number) => void>(() => undefined);

    useImperativeHandle(ref, () => ({
      setProgress(progress) {
        const next = Math.max(0, Math.min(1, progress));
        progressRef.current = next;
        renderRef.current(next);
      },
    }));

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const gl = canvas.getContext("webgl", {
        alpha: true,
        antialias: false,
        depth: false,
        premultipliedAlpha: true,
        preserveDrawingBuffer: false,
        stencil: false,
      });

      if (!gl) {
        canvas.style.background = "#fff";
        return;
      }

      const vertexShader = compileShader(
        gl,
        gl.VERTEX_SHADER,
        vertexSource,
      );
      const fragmentShader = compileShader(
        gl,
        gl.FRAGMENT_SHADER,
        fragmentSource,
      );
      const program = gl.createProgram();

      if (!vertexShader || !fragmentShader || !program) {
        canvas.style.background = "#fff";
        return;
      }

      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        canvas.style.background = "#fff";
        return;
      }

      const position = gl.getAttribLocation(program, "aPosition");
      const resolution = gl.getUniformLocation(program, "uResolution");
      const progress = gl.getUniformLocation(program, "uProgress");
      const distanceMap = gl.getUniformLocation(program, "uDistanceMap");
      const buffer = gl.createBuffer();
      const texture = gl.createTexture();

      if (!buffer || !texture || !resolution || !progress || !distanceMap) {
        canvas.style.background = "#fff";
        return;
      }

      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        gl.STATIC_DRAW,
      );
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      gl.disable(gl.DEPTH_TEST);
      gl.disable(gl.BLEND);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.uniform1i(distanceMap, 0);

      const buildDistanceMap = () => {
        const plate = canvas.parentElement;
        const tagline = plate?.querySelector<HTMLElement>(
          ".film-intro-tagline",
        );
        const lines = tagline
          ? Array.from(
              tagline.querySelectorAll<HTMLElement>(
                ".film-intro-tagline-line",
              ),
            )
          : [];
        const plateBounds = plate?.getBoundingClientRect();

        if (!tagline || !plateBounds || !lines.length) return;
        if (plateBounds.width < 2 || plateBounds.height < 2) return;

        const mapHeight = 144;
        const mapWidth = Math.max(
          144,
          Math.round(mapHeight * (plateBounds.width / plateBounds.height)),
        );
        if (!Number.isFinite(mapWidth) || mapWidth < 1) return;
        const maskCanvas = document.createElement("canvas");
        maskCanvas.width = mapWidth;
        maskCanvas.height = mapHeight;
        const context = maskCanvas.getContext("2d");
        if (!context) return;

        const scale = mapHeight / plateBounds.height;
        const style = getComputedStyle(tagline);
        context.clearRect(0, 0, mapWidth, mapHeight);
        context.fillStyle = "#fff";
        context.font = `${style.fontStyle} ${style.fontWeight} ${
          Number.parseFloat(style.fontSize) * scale
        }px ${style.fontFamily}`;
        context.textAlign = "center";
        context.textBaseline = "middle";

        lines.forEach((line) => {
          const bounds = line.getBoundingClientRect();
          context.fillText(
            line.textContent ?? "",
            (bounds.left + bounds.width / 2 - plateBounds.left) * scale,
            (bounds.top + bounds.height / 2 - plateBounds.top) * scale,
          );
        });

        const pixels = context.getImageData(0, 0, mapWidth, mapHeight).data;
        const distances = new Float32Array(mapWidth * mapHeight);
        const diagonal = Math.SQRT2;
        const far = mapWidth + mapHeight;

        for (let index = 0; index < distances.length; index += 1) {
          distances[index] = pixels[index * 4 + 3] > 24 ? 0 : far;
        }

        for (let y = 0; y < mapHeight; y += 1) {
          for (let x = 0; x < mapWidth; x += 1) {
            const index = y * mapWidth + x;
            let value = distances[index];
            if (x > 0) value = Math.min(value, distances[index - 1] + 1);
            if (y > 0) value = Math.min(value, distances[index - mapWidth] + 1);
            if (x > 0 && y > 0) {
              value = Math.min(
                value,
                distances[index - mapWidth - 1] + diagonal,
              );
            }
            if (x < mapWidth - 1 && y > 0) {
              value = Math.min(
                value,
                distances[index - mapWidth + 1] + diagonal,
              );
            }
            distances[index] = value;
          }
        }

        let maxDistance = 1;
        for (let y = mapHeight - 1; y >= 0; y -= 1) {
          for (let x = mapWidth - 1; x >= 0; x -= 1) {
            const index = y * mapWidth + x;
            let value = distances[index];
            if (x < mapWidth - 1) {
              value = Math.min(value, distances[index + 1] + 1);
            }
            if (y < mapHeight - 1) {
              value = Math.min(
                value,
                distances[index + mapWidth] + 1,
              );
            }
            if (x < mapWidth - 1 && y < mapHeight - 1) {
              value = Math.min(
                value,
                distances[index + mapWidth + 1] + diagonal,
              );
            }
            if (x > 0 && y < mapHeight - 1) {
              value = Math.min(
                value,
                distances[index + mapWidth - 1] + diagonal,
              );
            }
            distances[index] = value;
            maxDistance = Math.max(maxDistance, value);
          }
        }

        const data = new Uint8Array(distances.length);
        for (let index = 0; index < distances.length; index += 1) {
          data[index] = Math.round(
            Math.min(1, distances[index] / maxDistance) * 255,
          );
        }

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.LUMINANCE,
          mapWidth,
          mapHeight,
          0,
          gl.LUMINANCE,
          gl.UNSIGNED_BYTE,
          data,
        );
      };

      const render = (value: number) => {
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(resolution, canvas.width, canvas.height);
        gl.uniform1f(progress, value);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      };

      const resize = () => {
        const bounds = canvas.getBoundingClientRect();
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
        const width = Math.max(1, Math.round(bounds.width * pixelRatio));
        const height = Math.max(1, Math.round(bounds.height * pixelRatio));

        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }
        buildDistanceMap();
        render(progressRef.current);
      };

      renderRef.current = render;
      resize();
      void document.fonts.ready.then(() => {
        buildDistanceMap();
        render(progressRef.current);
      });
      window.addEventListener("resize", resize);

      return () => {
        window.removeEventListener("resize", resize);
        renderRef.current = () => undefined;
        gl.deleteBuffer(buffer);
        gl.deleteTexture(texture);
        gl.deleteProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
      };
    }, []);

    return (
      <canvas
        ref={canvasRef}
        className="film-intro-dissolve-canvas"
        aria-hidden
      />
    );
  },
);

export default FilmIntroDissolve;
