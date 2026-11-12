Generation Units

AZIBO STUDIO uses generation units for AI video generation.

The server is the final authority for calculating and deducting generation units.

Current Unit Costs

Duration| 720p| 1080p
5 seconds| 1 unit| 2 units
10 seconds| 2 units| 4 units
15 seconds| 3 units| 6 units

Only 5, 10, and 15-second generations are supported.

There are no 30-second generation options.

---

Free Generation Units

A legitimate new normal user receives 100 free generation units.

These units allow users to try AZIBO STUDIO before purchasing a paid subscription.

The owner is handled separately through the application's owner authorization logic.

---

Owner Generation Access

Owner Email:

christianaayu63@gmail.com

The owner:

- Has unlimited generation access.
- Is exempt from normal generation-unit deductions.
- Is exempt from normal subscription restrictions.
- Does not use an artificial 999999 balance.
- Always receives the AZIBO STUDIO watermark.

---

Watermark Rules

Free users:

- Generation units are deducted normally.
- Videos receive the exact watermark: Made with AZIBO STUDIO.

Paid users:

- Generation units are deducted normally.
- Videos are generated without the AZIBO STUDIO watermark.

Owner:

- Has unlimited generation access.
- No normal unit deduction.
- Always receives the Made with AZIBO STUDIO watermark.

The watermark is positioned at the bottom-right of the generated video.

---

Supported Video Generation

AZIBO STUDIO uses one universal Text-to-Video generation system.

Users can create different visual styles through text prompts, including:

- Animals
- Realistic humans
- 3D animation
- Anime

Current generation options:

- 5, 10, and 15 seconds
- 720p and 1080p
- 16:9, 9:16, and 1:1

AZIBO STUDIO is Text-to-Video only.

Image-to-Video is not part of the current product.

Music and sound-effect generation are not part of the current generation interface.

Talking Animals is not a dedicated product feature.

---

Current Video Provider

The current video-generation integration uses Pika Kling 3.0 Turbo.

The provider API key must remain server-side.

It must never be exposed through:

- Frontend source code
- Client-side requests
- Public Firestore documents
- NEXT_PUBLIC_* environment variables
- Browser-visible configuration

---

Generation Unit Flow

For a normal user:

1. User enters a text prompt describing the desired video.
2. User selects duration.
3. User selects resolution.
4. User selects aspect ratio.
5. Server validates the request.
6. Server calculates the required generation units.
7. Server checks available units.
8. Server processes the generation request.
9. Kling Turbo generates the video.
10. Generation status is monitored.
11. If required, Cloudinary applies the AZIBO watermark.
12. The final video is returned.
13. User previews the video inside AZIBO STUDIO.
14. User downloads or saves the video.

The server remains the authority for generation-unit calculations and deductions.

If a provider operation fails after units have been deducted, the server-side generation logic must apply the appropriate restoration or refund behavior.

---

Pricing Plans

Starter

- ₦72,000/month
- ₦216,000/quarter
- 50 units/month
- 150 units/quarter

Regular reference pricing:

- ₦89,000/month
- ₦267,000/quarter

Creator

- ₦198,000/month
- ₦594,000/quarter
- 150 units/month
- 450 units/quarter

Regular reference pricing:

- ₦249,000/month
- ₦747,000/quarter

Professional

- ₦398,000/month
- ₦1,194,000/quarter
- 300 units/month
- 900 units/quarter

Regular reference pricing:

- ₦499,000/month
- ₦1,497,000/quarter

Unit allocations represent generation units, not a fixed number of videos. The number of videos depends on the selected duration and resolution.

---

Security Rules

The client must never be trusted to determine:

- User generation-unit balance
- Final generation cost
- Owner status
- Subscription status
- Whether a unit deduction should be bypassed

These values must be validated by trusted server-side code.

---

Technical Verification

Before considering this architecture fully verified:

- [ ] 5/10/15-second generation works.
- [ ] 720p/1080p generation works.
- [ ] 16:9/9:16/1:1 generation works.
- [ ] Unit costs match the generation API.
- [ ] New normal users receive 100 free units.
- [ ] Owner receives unlimited access.
- [ ] Owner units are not deducted.
- [ ] Free users receive the AZIBO watermark.
- [ ] Paid users receive videos without the watermark.
- [ ] Owner videos retain the watermark.
- [ ] Failed generations handle unit restoration correctly.
- [ ] Provider credentials remain server-side.
- [ ] Animal, realistic human, 3D and anime styles can be generated through text prompts.
- [ ] Universal Text-to-Video generation works.
- [ ] Image-to-Video is not exposed anywhere in the current product.