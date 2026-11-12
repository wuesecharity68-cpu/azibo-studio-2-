AZIBO STUDIO — IMPLEMENTATION STATUS

Overview

This document records the intended architecture, product features, and implementation and verification status of AZIBO STUDIO.

It must be updated whenever the actual source code, routes, pricing, integrations, or deployment configuration changes.

This document is not a declaration that AZIBO STUDIO is production-ready. Production readiness can only be confirmed after a successful build, deployment, security review, and real-world testing.

---

1. Core Branding & UI

AZIBO STUDIO uses the existing dark visual design:

- Primary Gold: "#FFD700"
- Secondary Purple: "#800080"
- Background: "#0F0F0F"
- Card: "#1A1A1A"
- Text: "#FAFAFA"

Existing branding and layouts should be preserved when functionality is updated unless a deliberate design change is requested.

Interface elements include, where implemented:

- Header and navigation
- Launch and announcement messaging
- Dark theme
- Gold and purple accents
- Responsive layouts
- Toast notifications
- Loading states
- Empty states
- Error handling

---

2. Current Product Direction

AZIBO STUDIO is an AI video creation platform focused on generating videos from text prompts.

The platform uses one universal video generator.

Users describe the video they want in their prompt. The prompt determines the visual style and subject.

Supported visual styles:

- Animals
- Realistic Humans
- 3D Animation
- Anime

Creation method:

- Text-to-Video only

Image-to-Video is not part of the current product.

AZIBO should not be described as a talking-animal, talking-human, music-generation, or sound-effects platform unless those capabilities are deliberately reintroduced and implemented.

There should not be separate animal, human, 3D, or anime generator pages in the current architecture.

---

3. Video Generation Specifications

The universal generator is designed to support:

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

Generation method

- Text-to-Video

The selected prompt determines the visual content and style.

The generation provider is intended to use Pika Kling 3.0 Turbo. Actual provider connectivity and successful generation must be tested before this integration is considered production-verified.

---

4. Public Pages & Routes

The current universal video creation route is:

- "/create"

The old separate generator routes are not part of the current product direction:

- "/animal-videos"
- "/human-videos"
- "/3d-anime-videos"

Other application routes should only be documented as implemented after checking the current "app" directory.

The former "/talking-animals" terminology should not appear in current product documentation.

---

5. User Dashboard

The dashboard may provide access to:

- Account information
- Generation-unit balance
- Subscription information
- Universal video creation
- Account settings
- Upgrade and pricing access for eligible users

The main video creation action should lead to "/create".

Additional features, including video history, should only be marked implemented after their source code and functionality have been verified.

---

6. Administration

Administrative functionality exists where implemented and may include:

- Admin dashboard
- User management
- Analytics
- Credit packages and pricing
- Site settings
- Testimonials
- AI provider configuration
- Support management

Sensitive administrative operations must have appropriate server-side authorization.

Hiding administrative controls in the frontend is not sufficient security protection.

---

7. Authentication & Roles

AZIBO STUDIO uses Firebase Authentication.

Authentication methods may include:

- Email and password
- Google Sign-In, where configured and verified

Current roles:

- "owner"
- "user"

Owner Account

Configured owner email:

"christianaayu63@gmail.com"

The owner:

- Receives the "owner" role.
- Has unlimited generation access.
- Is not charged normal generation units.
- Does not require an active subscription.
- Does not use an artificial "999999" credit balance.
- Remains subject to authentication and security controls.
- Always receives the AZIBO STUDIO watermark.

Normal Users

Normal users must not automatically become owners simply because they are the first person to register.

A legitimate new normal user is intended to receive:

100 free generation units.

Normal users remain subject to generation-unit, subscription, and anti-abuse rules.

---

8. Free Units & Anti-Abuse

The intended free signup allowance is:

100 generation units per legitimate new user.

Possible anti-abuse signals include:

- Device or browser fingerprint information
- Browser and device characteristics
- IP-related information where available
- Existing free-credit claim records

These signals are anti-abuse mechanisms, not perfect identity verification.

Intended Behaviour

First legitimate claim

- Grant 100 free units.
- Record the claim where required by the implementation.

Detected repeat claim

- Do not automatically grant another 100-unit allowance solely because another account was created.
- Do not grant an automatic 5-unit fallback reward.
- Keep the account subject to normal AZIBO rules.

Anti-abuse checks should account for legitimate situations where multiple users share a device, browser, or network.

The actual implementation must be verified before this feature is marked complete.

---

9. Generation Unit System

AZIBO uses generation units.

Current unit costs:

Duration| 720p| 1080p
5 seconds| 1 unit| 2 units
10 seconds| 2 units| 4 units
15 seconds| 3 units| 6 units

The server-side generation API is the final authority for validating and deducting units.

Frontend unit displays are informational and must not be trusted for security-sensitive operations.

---

10. Generation Deduction & Refund Flow

The intended normal-user flow is:

1. User enters a text prompt.
2. User selects duration, resolution, and aspect ratio.
3. Server validates the prompt and generation options.
4. Server calculates the required units.
5. Server authenticates the user.
6. Server checks the available units.
7. Server deducts the required units.
8. Server starts video generation.
9. Server stores the generation task.
10. The application checks generation status.
11. Required watermark processing takes place.
12. The completed video is returned for preview and download.

If provider handoff or generation fails after a deduction, the server-side implementation should restore the appropriate units where the refund policy requires it.

Failures must not leave users permanently charged when the application is responsible for restoring their units.

---

11. Watermark System

Watermark behaviour:

User type| Watermark
Free user| Always ON
Active paid subscriber| OFF
Owner| Always ON

Exact watermark text:

"Made with AZIBO STUDIO"

The watermark is intended to appear at the bottom-right of the generated video.

Processing

When a watermark is required, the completed provider video is processed through Cloudinary before the final video URL is returned.

Current unsigned upload preset:

"azibo-unsigned"

The watermark should be embedded into the processed video, not merely displayed as an HTML overlay in the video player.

Owner videos remain watermarked even though the owner has unlimited generation access.

---

12. Video Preview & Download

The intended generation experience is:

Generate → Wait → Preview inside AZIBO → Watch → Download/Save

A newly generated video should not automatically download before the user has an opportunity to preview it.

The universal generation page should provide video playback and download functionality.

File Size

File-size display is optional.

AZIBO should not assume that generated videos are stored in Firebase Storage.

The current architecture is designed to return a final video URL from the provider and use Cloudinary for processing when required.

If reliable file-size metadata is unavailable, the application should provide a Download action without displaying an incorrect or empty file size.

---

13. Video Generation API

The generation architecture includes:

"/api/generate"

"/api/generate/status"

The generation API is responsible for server-side validation and authorization.

Supported generation options:

Duration

- "5"
- "10"
- "15"

Resolution

- "720p"
- "1080p"

Aspect ratio

- "16:9"
- "9:16"
- "1:1"

Generation type

- "textToVideo"

The prompt determines the subject and visual style.

Legacy fields such as "videoType" must not force users into separate generator categories or override the visual style requested in their prompt.

Image-to-Video is not part of the current API direction.

---

14. Video Generation Provider

The intended provider integration is:

Pika Kling 3.0 Turbo

The integration is designed for text-to-video generation using AZIBO's supported duration, resolution, and aspect-ratio options.

Provider API credentials must remain server-side.

They must never be exposed through:

- Client-side source code
- "NEXT_PUBLIC_*" environment variables
- Browser-visible API responses
- Public Firestore documents
- Public frontend configuration

Customers should use AZIBO's generation interface rather than receiving provider credentials or direct provider API access.

The provider should only be marked fully operational after successful real generation tests.

---

15. Payments & Pricing

AZIBO STUDIO uses Paystack for subscription payments.

Starter

Launch pricing:

- ₦72,000/month
- ₦216,000/quarter

Regular reference pricing:

- ₦89,000/month
- ₦267,000/quarter

Allocation:

- 50 units/month
- 150 units/quarter

Creator

Launch pricing:

- ₦198,000/month
- ₦594,000/quarter

Regular reference pricing:

- ₦249,000/month
- ₦747,000/quarter

Allocation:

- 150 units/month
- 450 units/quarter

Professional

Launch pricing:

- ₦398,000/month
- ₦1,194,000/quarter

Regular reference pricing:

- ₦499,000/month
- ₦1,497,000/quarter

Allocation:

- 300 units/month
- 900 units/quarter

Billing Periods

- Monthly
- Quarterly

There is no current yearly billing option.

The correct plan name is Professional, not the former Pro naming.

Current launch messaging may reference:

"Save Up to 20%"

The launch countdown and date should only be treated as authoritative when they match the actual application configuration.

Payment amounts and unit allocations must be validated server-side.

---

16. Firestore Data

Potential or current Firestore collections include:

- "users"
- "testimonials"
- "credits_log"
- "page_visits"
- "support_tickets"
- "ai_providers"
- "admin_config"
- "deviceClaims"
- "videoGenerations"

The exact collection names, document structures, and fields must be verified against the current source code.

Sensitive information, including roles, generation units, subscription status, ownership, user-generated video records, and provider configuration, must have appropriate access controls and server-side validation.

---

17. Analytics

Where implemented, analytics may include:

- Page visits
- User activity
- Generation activity
- Subscription information
- Revenue information

Technical information such as IP addresses must be handled according to appropriate security, access-control, retention, and privacy requirements.

Analytics figures should not be presented as accurate business metrics until their data sources and calculations have been verified.

---

18. Administrative Features

Administrative functionality may include:

- User management
- Testimonials management
- Pricing and configuration
- AI provider configuration
- Site settings
- Maintenance mode
- Support management
- Analytics

Each feature must be tested independently.

The existence of an admin page does not prove that its underlying operations are fully functional or securely protected.

---

19. Technical Architecture

Current technology direction includes:

- Next.js
- React
- TypeScript
- Tailwind CSS
- Firebase Authentication
- Firebase Firestore
- Paystack
- Cloudinary
- Lucide icons
- Next.js App Router
- Turbopack where configured

Exact dependency versions must be taken from the current "package.json" and valid lockfile.

---

20. Security Priorities

Before public launch, verify:

- Firebase Authentication configuration
- Firestore security rules
- Owner-role protection
- Server-side generation-unit validation
- Server-side subscription validation
- Paystack webhook signature verification
- Provider API-key protection
- Admin authorization
- Free-unit anti-abuse behaviour
- Video ownership and access controls
- Secure handling of generated video URLs
- Cloudinary configuration
- Production environment variables

Firebase Storage rules should only be treated as a deployment requirement if Firebase Storage is actually used by the current application.

---

21. Deployment Verification

This document intentionally does not claim:

- Zero build errors
- Zero warnings
- All routes compiled
- All tests passed
- Production readiness
- Successful real-money payment processing
- Successful production video generation
- Fully verified Firestore rules
- Fully verified anti-abuse behaviour

These items can only be marked complete after actual verification.

---

22. Final Verification Checklist

Application

- [ ] Homepage loads correctly.
- [ ] Authentication works.
- [ ] Google Sign-In works, if enabled.
- [ ] Normal users receive 100 free generation units.
- [ ] Owner account receives the owner role.
- [ ] Owner has unlimited generation access.
- [ ] Owner does not require an artificial credit balance.
- [ ] Owner videos always receive the AZIBO watermark.
- [ ] Free-user watermark works.
- [ ] Paid-user watermark is removed.
- [ ] Universal video generation works.
- [ ] Video preview works.
- [ ] Video download works.
- [ ] Video history works, if implemented.
- [ ] Account settings work.

Video Features

- [ ] Animal-style prompts generate the requested videos.
- [ ] Realistic-human prompts generate the requested videos.
- [ ] 3D-animation prompts generate the requested videos.
- [ ] Anime-style prompts generate the requested videos.
- [ ] Text-to-Video works.
- [ ] 5-second generation works.
- [ ] 10-second generation works.
- [ ] 15-second generation works.
- [ ] 720p generation works.
- [ ] 1080p generation works.
- [ ] 16:9 works.
- [ ] 9:16 works.
- [ ] 1:1 works.

Generation Units

- [ ] 5s/720p = 1 unit.
- [ ] 5s/1080p = 2 units.
- [ ] 10s/720p = 2 units.
- [ ] 10s/1080p = 4 units.
- [ ] 15s/720p = 3 units.
- [ ] 15s/1080p = 6 units.
- [ ] Units are deducted server-side.
- [ ] Failed generation handoff restores units where required.
- [ ] Repeat free-unit claims are handled by the anti-abuse implementation.
- [ ] No automatic 5-unit repeat-user reward exists.

Watermark

- [ ] Free users receive "Made with AZIBO STUDIO".
- [ ] Watermark appears bottom-right.
- [ ] Paid subscribers receive videos without the watermark.
- [ ] Owner videos always contain the watermark.
- [ ] Cloudinary processing works when watermarking is required.
- [ ] A watermark-processing failure does not incorrectly mark a generation as complete.

Payments

- [ ] Paystack initialization works.
- [ ] Paystack checkout opens correctly.
- [ ] Payment verification works.
- [ ] Webhook handling works.
- [ ] Subscription status updates correctly.
- [ ] Correct generation units are granted.
- [ ] Duplicate webhook processing does not grant units twice.
- [ ] Application pricing matches the current pricing.
- [ ] Monthly billing works.
- [ ] Quarterly billing works.

Security

- [ ] Firestore rules are reviewed.
- [ ] Owner authorization is reviewed.
- [ ] Admin authorization is reviewed.
- [ ] Provider API keys remain server-side.
- [ ] User-generated videos are access-controlled.
- [ ] Generation ownership is validated server-side.
- [ ] Payment webhooks are verified.
- [ ] Free-unit anti-abuse controls are reviewed.
- [ ] Production environment variables are configured securely.

Deployment

- [ ] Production build succeeds.
- [ ] TypeScript validation succeeds.
- [ ] Required environment variables are configured.
- [ ] Vercel deployment succeeds.
- [ ] Production domain works.
- [ ] Firebase authorized domains include the production domain.
- [ ] Real production video generation has been tested.
- [ ] Real payment flow has been tested appropriately.
- [ ] Production watermark processing has been tested.

---

Documentation Status

This document is an implementation and verification checklist, not a declaration of completion.

A feature should only be marked fully implemented after verifying:

1. Its source code.
2. Its integration.
3. Its server-side behaviour.
4. Its required security controls.
5. Its real-world functionality.

The documented status must always reflect the actual application rather than the intended architecture.