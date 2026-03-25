#!/bin/bash
# Usage: bash scripts/extract-frames.sh public/your-video.mp4
# Extracts frames to public/frames/

INPUT=${1:-"public/adamass.mp4"}
OUTPUT_DIR="public/frames"

mkdir -p "$OUTPUT_DIR"

echo "Extracting frames from $INPUT..."

ffmpeg -i "$INPUT" \
  -vf fps=24 \
  -q:v 3 \
  "$OUTPUT_DIR/frame_%04d.jpg"

COUNT=$(ls "$OUTPUT_DIR"/frame_*.jpg 2>/dev/null | wc -l)
echo "Done. Extracted $COUNT frames to $OUTPUT_DIR/"
echo "Update TOTAL_FRAMES in components/video/videoShared.tsx to: $COUNT"
