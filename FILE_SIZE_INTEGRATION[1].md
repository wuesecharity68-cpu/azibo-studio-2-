# AZIBO STUDIO — Video File Size & Download Integration Guide

## Overview

AZIBO STUDIO allows users to preview generated videos and download them after generation is complete.

The current generation flow is designed around:

- Text-to-Video generation
- Pika Kling 3.0 Turbo
- 5, 10, and 15-second videos
- 720p and 1080p output
- 16:9, 9:16, and 1:1 aspect ratios
- In-app video preview
- Download/save functionality
- Cloudinary processing when an AZIBO STUDIO watermark is required

File-size display is optional and must only be documented or implemented if the current application actually retrieves reliable file-size metadata.

---

# 1. Current Video Delivery Flow

The current generation flow is:

```text
User submits text prompt
        ↓
/api/generate
        ↓
Pika Kling 3.0 Turbo
        ↓
Generation status polling
        ↓
/api/generate/status
        ↓
Completed provider video
        ↓
Cloudinary watermark processing when required
        ↓
Final video URL
        ↓
AZIBO STUDIO video preview
        ↓
User downloads/saves video