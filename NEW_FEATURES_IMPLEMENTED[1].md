AZIBO STUDIO — NEW FEATURES IMPLEMENTED

Overview

This document records the security, account, generation, watermark, payment and user-experience features of AZIBO STUDIO.

AZIBO STUDIO is a Text-to-Video platform built with Next.js, Firebase, Paystack, Cloudinary and a server-side AI video-generation provider.

The application uses one universal video generator.

Supported visual styles:

- Animals
- Realistic humans
- 3D animation
- Anime

These are visual styles, not separate generators. Users describe their desired videos through text prompts.

This document must reflect the actual application implementation and be updated when features change.

---

Feature 1: Owner Account Handling

File: "lib/auth-utils.ts"

Configured Owner Email: "christianaayu63@gmail.com"

The owner account receives special privileges through server-side authorization.

Owner privileges include:

- Owner role assignment.
- Unlimited video generation.
- Exemption from normal generation-unit deductions.
- Exemption from normal subscription requirements.
- Access to authorized administrator features.
- No requirement for an artificial unlimited credit balance.

The owner remains subject to authentication and security controls.

Owner-generated videos always require the AZIBO STUDIO watermark.

Owner privileges must never be granted merely because an account is the first registered user.

---

Feature 2: Free Generation Units and Anti-Abuse Protection

New legitimate normal users receive:

100 free generation units.

These units allow users to experience AZIBO before purchasing a subscription.

Only the configured owner account receives owner privileges.

Anti-Abuse Protection

AZIBO may use available device, browser and related signals to identify repeated attempts to claim the initial free allowance.

Possible signals include:

- Device fingerprint information.
- Browser and device characteristics.
- IP-related information where available.
- Existing free-unit claim records.

The purpose is to reduce repeated account creation for additional free units.

Intended Behavior

First legitimate claim:

- Grant 100 free units.
- Record the claim where required.

Detected repeat claim:

- Do not automatically grant another 100 units solely because another account was created.
- Do not automatically issue a fallback reward.
- Apply normal generation-unit and subscription rules.

Device and browser signals are indicators, not perfect identity verification. Shared devices, computers and internet connections must be handled carefully to avoid incorrectly blocking legitimate users.

The actual "deviceClaims" implementation and its Firestore security rules must be verified before claiming that anti-abuse protection is fully operational.

---

Feature 3: Generation Unit System

The server-side "/api/generate" route is responsible for validating generation options and calculating unit deductions.

Generation Costs

Duration| 720p| 1080p
5 seconds| 1 unit| 2 units
10 seconds| 2 units| 4 units
15 seconds| 3 units| 6 units

The frontend displays unit information but is not the security authority.

Generation Flow

User enters prompt and selects settings
↓
Validate prompt and generation options
↓
Authenticate user server-side
↓
Calculate required units
↓
Check user authorization and balance
↓
Deduct units where applicable
↓
Submit generation request
↓
Store generation task
↓
Check generation status
↓
Process completed video
↓
Apply watermark when required
↓
Return final video URL

If generation fails after units have been deducted, the server must restore the applicable units according to its refund logic.

---

Feature 4: Universal Video Generation

AZIBO uses one universal Text-to-Video generator.

Supported Visual Styles

- Animal scenes.
- Realistic human scenes.
- 3D animated scenes.
- Anime-inspired scenes.

The user's text prompt determines the requested visual style.

Generation Settings

Method: Text-to-Video only.

Duration:

- 5 seconds.
- 10 seconds.
- 15 seconds.

Resolution:

- 720p.
- 1080p.

Aspect ratio:

- 16:9.
- 9:16.
- 1:1.

Image-to-Video is not part of the current product.

Provider

The intended provider is Pika Kling 3.0 Turbo.

Provider credentials and implementation details must remain server-side.

Actual provider connectivity and supported generation options must be confirmed through testing.

---

Feature 5: Watermark System

Watermark behavior depends on the user's access level.

User Type| Watermark
Free user| ON
Active paid subscriber| OFF
Owner| ON
Authorized admin| ON

Exact Watermark

"Made with AZIBO STUDIO"

Position: Bottom-right.

Processing

When watermarking is required, the completed generated video is processed before the final video URL is returned.

The current architecture uses Cloudinary for video processing.

Configured unsigned upload preset:

"azibo-unsigned"

The watermark should be embedded into the processed video rather than displayed only as an HTML overlay.

Processing results must be verified before a generation is marked completed.

Owner watermarking is intentional for demonstrations, testing and promotion.

---

Feature 6: Video Preview and Download

The intended user experience is:

Generate
↓
Wait for generation
↓
Preview inside AZIBO
↓
Watch
↓
Download or save

A newly generated video should not automatically download before the user has an opportunity to preview it.

Video Preview

The generation interface displays completed videos inside AZIBO.

Users can watch the video before downloading.

Download

The interface provides a download action for completed videos.

If reliable file-size information is unavailable, the interface should still provide a normal Download action rather than displaying an incorrect or empty file-size value.

Storage Architecture

Generated videos are handled through generation URLs and the intended Cloudinary processing workflow.

They should not be assumed to be stored in Firebase Storage.

Storage-specific functionality should only be documented after its actual use has been verified.

---

Feature 7: Generation API Security

Current generation endpoints:

- "/api/generate"
- "/api/generate/status"

The generation API performs server-side authentication, validation and authorization.

Supported Generation Values

Duration:

- 5
- 10
- 15

Resolution:

- 720p
- 1080p

Aspect ratio:

- 16:9
- 9:16
- 1:1

Generation method:

"textToVideo"

The request uses the user's text prompt to determine the desired visual style.

Separate animal, realistic-human, 3D or anime generator selections are not required.

Legacy "videoType" fields must not restrict or override the universal prompt-based generation experience.

Server-Side Responsibilities

The server controls:

- User authentication.
- User ownership.
- Owner privileges.
- Generation-unit validation.
- Generation-unit deduction.
- Task ownership.
- Provider communication.
- Watermark requirements.
- Generation status.
- Final video URL handling.

Client-side values must never be trusted for security-sensitive operations.

---

Feature 8: Provider API Key Protection

The video-generation provider is accessed through the server-side implementation.

Provider credentials must remain private.

They must never be exposed through:

- Client-side source code.
- Public environment variables.
- Public Firestore documents.
- Browser-visible configuration.
- Public API responses.
- Frontend configuration.

Users communicate with AZIBO's generation interface without accessing the provider's private credentials.

---

Feature 9: Paid Subscription Access

AZIBO uses Paystack for subscription payments.

Current billing periods:

- Monthly.
- Quarterly.

Starter

Monthly: ₦72,000
Quarterly: ₦216,000

Allocation:

- 50 units monthly.
- 150 units quarterly.

Regular reference pricing:

- ₦89,000 monthly.
- ₦267,000 quarterly.

Creator

Monthly: ₦198,000
Quarterly: ₦594,000

Allocation:

- 150 units monthly.
- 450 units quarterly.

Regular reference pricing:

- ₦249,000 monthly.
- ₦747,000 quarterly.

Professional

Monthly: ₦398,000
Quarterly: ₦1,194,000

Allocation:

- 300 units monthly.
- 900 units quarterly.

Regular reference pricing:

- ₦499,000 monthly.
- ₦1,497,000 quarterly.

Regular reference prices must not replace the current discounted prices prematurely.

Active paid subscribers receive eligible videos without the AZIBO watermark.

Subscription status must be verified server-side.

---

Feature 10: Payment Security

Paystack payment processing uses server-side validation.

The payment system must verify:

- Authenticated user.
- Selected plan.
- Billing period.
- Expected payment amount.
- Paystack transaction.
- Customer information.
- Subscription status.
- Webhook authenticity.
- Duplicate webhook handling.

Generation units must only be granted according to verified payment and subscription events.

Duplicate webhook events must not grant the same subscription allocation more than once.

Client-submitted prices and unit quantities must never be trusted.

---

Feature 11: Firestore Security

Firestore data involving sensitive account information must be protected.

Sensitive information includes:

- User roles.
- Generation units.
- Subscription status.
- Owner privileges.
- Generation records.
- Provider configuration.
- Free-unit claim information.

Normal users must not be able to directly modify protected fields such as:

- Their role.
- Owner status.
- Generation-unit balance.
- Subscription privileges.

Sensitive operations must be performed through appropriately protected server-side code.

Firestore security rules and Firebase Admin access must be reviewed before production verification is claimed.

---

Feature 12: Universal Generation Page

The current generation experience is centralized at:

"/create"

The page provides:

- Text prompt input.
- Duration selection.
- Resolution selection.
- Aspect-ratio selection.
- Generation status.
- In-app video preview.
- Download functionality.
- Generation-unit information.
- Owner unlimited-access handling where applicable.

The prompt determines whether the user wants an animal, realistic human, 3D or anime-style video.

The old separate generator pages are not part of the current universal generation architecture.

---

Feature 13: Error Handling and Refunds

Generation failures must be handled safely.

The system should:

- Record failed tasks.
- Avoid duplicate refunds.
- Restore deducted units when a generation fails and a refund is applicable.
- Avoid refunding successful generations.
- Prevent unauthorized users from retrieving another user's task.
- Display useful error messages.

Generation refunds must be protected against duplicate processing.

---

Feature 14: Environment and Deployment Security

AZIBO deployment configuration is managed through Vercel environment variables.

Public configuration may include:

- Firebase client configuration.
- Paystack public key.
- Public Paystack plan codes.
- Cloudinary cloud name.
- Cloudinary upload preset.

Private server-side credentials include:

- Firebase Admin credentials.
- Paystack secret key.
- Pika Kling API key.
- Other private provider credentials.

Private credentials must never be exposed through frontend code or "NEXT_PUBLIC_*" environment variables.

---

VERIFICATION STATUS

This document records the intended features and current application architecture.

It does not claim:

- Zero TypeScript errors.
- Zero warnings.
- Successful production build.
- Successful production deployment.
- Successful production video generation.
- Fully verified Firestore rules.
- Fully verified Paystack payments.
- Fully verified anti-abuse behavior.
- Fully verified Cloudinary processing.
- Fully verified download behavior.

These statements should only be made after the corresponding source code and deployment have actually been tested.

---

TESTING CHECKLIST

Owner Account

- [ ] Sign in with the configured owner account.
- [ ] Verify the account receives the owner role.
- [ ] Verify owner generation is not blocked by insufficient units.
- [ ] Verify owner generation does not deduct normal units.
- [ ] Verify subscription restrictions do not block the owner.
- [ ] Verify owner-generated videos contain "Made with AZIBO STUDIO".
- [ ] Verify owner access does not depend on an artificial unit balance.

Normal User

- [ ] Create a normal account.
- [ ] Verify the account receives 100 free generation units.
- [ ] Verify the account is not automatically assigned the owner role.
- [ ] Verify normal generation-unit costs are applied.
- [ ] Verify insufficient units prevent generation.

Anti-Abuse

- [ ] Test the initial free-unit claim.
- [ ] Test repeated claims from the same detectable device/browser environment.
- [ ] Verify repeat accounts do not automatically receive another 100 units.
- [ ] Verify no automatic fallback reward is granted.
- [ ] Verify shared-device and shared-network situations are handled appropriately.

Video Generation

- [ ] Animal prompts work.
- [ ] Realistic human prompts work.
- [ ] 3D prompts work.
- [ ] Anime prompts work.
- [ ] All visual styles use the same universal generator.
- [ ] Text-to-Video works.
- [ ] 5-second generation works.
- [ ] 10-second generation works.
- [ ] 15-second generation works.
- [ ] 720p generation works.
- [ ] 1080p generation works.
- [ ] All supported aspect ratios work.

Generation Units

- [ ] 5s/720p = 1 unit.
- [ ] 5s/1080p = 2 units.
- [ ] 10s/720p = 2 units.
- [ ] 10s/1080p = 4 units.
- [ ] 15s/720p = 3 units.
- [ ] 15s/1080p = 6 units.
- [ ] Units are deducted server-side.
- [ ] Failed generation restores units when required.
- [ ] Owner generation does not deduct normal units.

Watermark

- [ ] Free users receive the AZIBO watermark.
- [ ] Watermark appears bottom-right.
- [ ] Paid subscribers receive eligible videos without the watermark.
- [ ] Owner videos always contain the watermark.
- [ ] Cloudinary processing works when watermarking is required.
- [ ] Watermark-processing failures are handled safely.

Preview and Download

- [ ] Generated videos can be previewed inside AZIBO.
- [ ] Videos do not automatically download before preview.
- [ ] Download action works.
- [ ] Download remains available when file-size information is unavailable.
- [ ] Final video URLs are returned correctly after processing.

Payments

- [ ] Paystack initialization works.
- [ ] Checkout opens correctly.
- [ ] Successful payments are verified.
- [ ] Webhooks are verified.
- [ ] Subscription status updates correctly.
- [ ] Monthly units are allocated correctly.
- [ ] Quarterly units are allocated correctly.
- [ ] Duplicate webhook events do not grant duplicate allocations.
- [ ] Displayed prices match current pricing.

Security

- [ ] Owner authorization is protected server-side.
- [ ] Administrator authorization is protected server-side.
- [ ] Generation-unit validation is protected server-side.
- [ ] Provider API credentials remain private.
- [ ] Generation-task ownership is validated server-side.
- [ ] Protected Firestore fields cannot be modified directly by normal users.
- [ ] Free-unit anti-abuse controls are reviewed.
- [ ] Cloudinary configuration is secured.
- [ ] Production environment variables are configured securely.

---

DOCUMENTATION PRINCIPLE

This document must describe the actual current AZIBO STUDIO implementation.

Update it whenever any of the following changes:

- Generation architecture.
- Supported visual styles.
- Generation options.
- Generation-unit costs.
- Subscription plans.
- Payment processing.
- Watermark behavior.
- Authentication.
- Security controls.
- Deployment configuration.

Claims such as "Production ready", "Zero errors", "All features complete" and "All routes verified" must only be added after the relevant code and deployment have been tested successfully.

AZIBO documentation must describe implemented functionality accurately and must not reintroduce removed or obsolete features.