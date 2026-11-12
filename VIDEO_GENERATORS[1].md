AZIBO STUDIO — VIDEO GENERATORS CONFIGURATION GUIDE

Overview

AZIBO STUDIO uses one universal, server-side Text-to-Video generation system.

Users create videos by entering text prompts. Supported visual styles include:

- Animals
- Realistic humans
- 3D animation
- Anime

These are visual styles, not separate generators.

The system uses Firebase Authentication, Firestore, Pika Kling 3.0 Turbo integration, Cloudinary and server-side generation processing.

Provider credentials must remain protected on the server.

---

1. Provider Configuration

Provider configuration is maintained through:

"lib/video-generator-config.ts"

The configuration supports:

- Generator ID
- Generator name
- Description
- Enabled status
- Priority
- Text-to-Video capability
- Optional custom-style capability
- Optional provider endpoint

The current configuration identifies Pika Kling 3.0 Turbo as the intended generation provider.

Provider credentials are managed separately through secure server-side environment variables.

---

2. API Key Security

Provider API credentials are private.

They must never be exposed through:

- Client-side React components
- Browser-accessible configuration
- Public Firestore documents
- API responses
- "NEXT_PUBLIC_*" environment variables
- Public source code

Architecture:

User Browser
↓
AZIBO Server
↓
Secure Provider Credentials
↓
Video Provider
↓
AZIBO Server
↓
User

The browser communicates only with AZIBO's protected API.

---

3. Universal Video Generation

AZIBO supports one generation method:

"textToVideo"

Users describe their desired video in a text prompt.

Supported visual styles:

- Animal scenes
- Realistic human scenes
- 3D animated scenes
- Anime-inspired scenes

The prompt determines the desired style.

There should be:

- No separate animal generator.
- No separate human generator.
- No separate 3D generator.
- No separate anime generator.
- No Image-to-Video functionality.

---

4. Supported Generation Settings

Duration

- 5 seconds
- 10 seconds
- 15 seconds

Resolution

- 720p
- 1080p

Aspect ratio

- 16:9
- 9:16
- 1:1

The server must reject unsupported values.

---

5. Generation Request

The universal generation request contains:

- "prompt"
- "duration"
- "resolution"
- "aspectRatio"

Generation method:

"textToVideo"

The server validates the request before sending it to the provider.

Separate "videoType" selections must not be required. Legacy fields must not override the user's prompt or restrict the requested visual style.

---

6. Generation Units

Duration| 720p| 1080p
5 seconds| 1 unit| 2 units
10 seconds| 2 units| 4 units
15 seconds| 3 units| 6 units

The server calculates the required units.

The browser must never determine or override the final deduction.

---

7. Free User Units

New legitimate normal users receive:

100 free generation units.

Free users can generate videos within their available balance.

Free-user videos require the AZIBO watermark.

---

8. Owner Authorization

The authorized owner receives:

- Unlimited generation access.
- No normal unit deductions.
- No subscription requirement.
- Access to authorized administrator features.

Owner privileges must be verified server-side through the application's role and identity checks.

An artificially large stored credit balance must not be used to simulate unlimited access.

---

9. Subscription Allocations

Plan| Monthly Units| Quarterly Units
Starter| 50| 150
Creator| 150| 450
Professional| 300| 900

Paid subscription status must be verified server-side.

Only authorized active subscribers receive paid-plan benefits.

---

10. Generation API

Main generation endpoint:

"/api/generate"

Generation status endpoint:

"/api/generate/status"

The generation API validates:

- Authentication
- User authorization
- Prompt
- Duration
- Resolution
- Aspect ratio
- Generation-unit requirement
- Available user balance
- Provider availability

The API must not require separate animal, human, 3D or anime generator selections.

Duplicate generation routes should not be introduced unnecessarily.

---

11. Asynchronous Generation

Video generation may take time.

The provider can return a task ID before the video is ready.

The process is:

1. Submit generation request.
2. Receive task ID.
3. Store generation record.
4. Poll generation status.
5. Detect completion or failure.
6. Retrieve completed video.
7. Process the video.
8. Store final video URL.
9. Return the result to AZIBO.
10. Display the video for preview and download.

---

12. Generation Task States

AZIBO uses an internal task structure to manage generation results.

Relevant information includes:

- Task ID
- Provider
- Status
- Video URL
- Error information

Task states:

- Pending
- Processing
- Completed
- Failed

Provider-specific response formats remain inside the server-side provider implementation.

---

13. Generation Unit Safety

The server controls all unit operations.

Validate request
↓
Calculate units
↓
Check balance
↓
Deduct units
↓
Submit generation
↓
Success: complete generation
↓
Failure: restore units when appropriate

The owner bypasses normal deductions through verified authorization.

Refunds must be protected against duplicate processing.

---

14. Provider Failover

The current configuration has a primary generator and no configured fallback generator.

Provider priority must not be interpreted as proof that automatic failover is active.

If failover is implemented later, it must safely handle:

- Provider eligibility
- Error detection
- Unit deductions
- Unit restoration
- Duplicate-generation prevention
- Final result handling

---

15. Provider Pricing

Provider costs are separate from AZIBO generation units.

AZIBO uses its internal unit map to calculate user deductions.

Provider pricing should be reviewed independently whenever provider costs change.

Provider costs must not be exposed as user-facing prices unless intentionally required.

---

16. Administrator Generator Management

The administrator provider-management page is:

"/admin/ai-providers"

Authorized administrators can manage supported provider configuration.

Administrator access must be protected by verified permissions.

Private API credentials must never be exposed to ordinary users or returned through public configuration responses.

---

17. Watermark Processing

Exact watermark:

"Made with AZIBO STUDIO"

Position: bottom-right.

Free users

- Watermark required.

Active paid subscribers

- No AZIBO watermark.

Owner

- Watermark always required for organic promotion.

Watermark decisions must be enforced server-side.

Completed videos requiring a watermark are processed through the intended Cloudinary workflow.

---

18. Generation Testing

Before production use, verify:

- [ ] Provider authentication works.
- [ ] Provider configuration works.
- [ ] Animal prompts generate correctly.
- [ ] Realistic human prompts generate correctly.
- [ ] 3D prompts generate correctly.
- [ ] Anime prompts generate correctly.
- [ ] All visual styles use the same generator.
- [ ] 5-second generation works.
- [ ] 10-second generation works.
- [ ] 15-second generation works.
- [ ] 720p generation works.
- [ ] 1080p generation works.
- [ ] All supported aspect ratios work.
- [ ] Correct units are deducted.
- [ ] Insufficient balances prevent generation.
- [ ] Failed generations restore units when appropriate.
- [ ] Owner generation does not deduct units.
- [ ] Video preview works.
- [ ] Video download works.
- [ ] Watermark rules work correctly.

---

19. Environment Variables

Provider secrets must be stored in secure deployment environment variables.

The actual variable names must match the existing server-side provider implementation.

Relevant configuration includes:

- Pika Kling API credential
- Firebase configuration
- Firebase Admin credentials
- Cloudinary configuration

Never expose private credentials through "NEXT_PUBLIC_*" variables.

---

20. Troubleshooting

Unauthorized Provider Request

Check provider credentials, authentication method and provider account status.

Invalid Generation Request

Check prompt, duration, resolution and aspect ratio.

Generation Stuck

Check task ID, provider status and status polling.

Incorrect Unit Deduction

Check server-side unit calculation, user role and subscription status.

Watermark Problem

Check user access, watermark requirements, Cloudinary processing and final video URL.

---

21. Security Checklist

- [ ] Provider credentials remain server-side.
- [ ] Firebase authentication is verified.
- [ ] User authorization is verified.
- [ ] Administrator routes are protected.
- [ ] Generation parameters are validated server-side.
- [ ] Unit calculations are server-side.
- [ ] Users cannot manipulate deductions.
- [ ] Duplicate refunds are prevented.
- [ ] Generated video access is protected.
- [ ] Watermark processing follows server-side rules.

---

22. Final Production Verification

AZIBO STUDIO should only be considered production-ready after testing:

- Provider authentication and connectivity.
- Universal Text-to-Video generation.
- All four supported visual styles.
- Duration, resolution and aspect-ratio options.
- Generation-unit calculations and deductions.
- Owner unlimited access.
- Subscription authorization.
- Failed-generation refunds.
- Task status polling.
- Cloudinary video processing.
- Video preview and download.
- Free-user watermark.
- Paid-user watermark removal.
- Owner watermark.
- API and credential security.

This guide documents the intended AZIBO STUDIO provider architecture. Actual production readiness must be confirmed against the implemented code and successful tests.