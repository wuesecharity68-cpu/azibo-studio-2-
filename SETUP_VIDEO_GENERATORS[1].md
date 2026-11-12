AZIBO STUDIO — VIDEO GENERATOR SETUP GUIDE

1. Overview

AZIBO STUDIO is an AI-powered Text-to-Video platform built with Next.js, Firebase, Paystack, Cloudinary and Pika Kling 3.0 Turbo.

It uses one universal video generator. Users describe what they want through text prompts.

Supported visual styles:

- Animals
- Realistic humans
- 3D animation
- Anime

These are visual styles, not separate generators.

2. Generation Options

- Generation method: Text-to-Video only.
- Duration: 5, 10 or 15 seconds.
- Resolution: 720p or 1080p.
- Aspect ratio: 9:16, 16:9 or 1:1.
- Prompt determines the desired visual style.
- No Image-to-Video functionality.

3. Generation Architecture

Main generation endpoint:

"/api/generate"

Generation status endpoint:

"/api/generate/status"

Generation process:

1. User enters a text prompt.
2. User selects duration, resolution and aspect ratio.
3. Firebase authenticates the user.
4. Server validates the request and access permissions.
5. Server calculates the required units.
6. Units are deducted when applicable.
7. The configured provider receives the generation request.
8. AZIBO checks generation status.
9. Completed videos are processed through Cloudinary.
10. Required watermarks are applied.
11. Users preview and download their videos.

4. AI Provider

Current intended provider: Pika Kling 3.0 Turbo.

Production connectivity must be confirmed through successful generation tests.

Provider credentials must remain server-side and must never be exposed in frontend code.

Provider configuration should support:

- Provider identification.
- Secure API authentication.
- Generation requests.
- Task ID handling.
- Status polling.
- Completed video retrieval.
- Error handling.

The provider implementation must match the actual API response and supported parameters.

5. Generation Units

Duration| 720p| 1080p
5 seconds| 1 unit| 2 units
10 seconds| 2 units| 4 units
15 seconds| 3 units| 6 units

The server calculates units. The frontend must not determine or override the actual deduction.

6. Free User Access

- New accounts receive 100 signup units.
- Free users can generate videos within their available balance.
- Free-user videos receive the AZIBO watermark.
- Generation must stop when the user lacks sufficient units.

7. Owner Access

The owner account is identified through the authorized owner role and configured owner identity.

Owner access:

- Unlimited generation.
- No subscription requirement.
- No unit deduction.
- Access to administrator features.
- Owner-generated videos retain the AZIBO watermark for promotion.

Administrator access must be based on verified roles, not artificially large credit balances.

8. Subscription Plans

Billing periods are monthly and quarterly.

Plan| Monthly Price| Monthly Units| Quarterly Price| Quarterly Units
Starter| ₦72,000| 50| ₦216,000| 150
Creator| ₦198,000| 150| ₦594,000| 450
Professional| ₦398,000| 300| ₦1,194,000| 900

Regular prices are planned for a later launch period and must not replace the current prices prematurely.

Paid subscribers with active subscriptions receive videos without the AZIBO watermark.

9. Request Validation

The server must validate:

- Firebase authentication.
- Prompt presence and maximum length.
- Duration: 5, 10 or 15 seconds.
- Resolution: 720p or 1080p.
- Aspect ratio: 16:9, 9:16 or 1:1.
- User authorization.
- Available generation units.
- Subscription requirements for restricted options.

Generation method: "textToVideo".

There should be no separate "animal", "realisticHuman" or "3dAnime" generator selection. The text prompt determines the desired visual style.

Legacy fields must not force a particular visual style or override the user's prompt.

10. Payment Processing

AZIBO uses Paystack for subscription payments.

The server must:

- Authenticate payment initialization requests.
- Calculate prices from trusted server-side plan data.
- Validate payment webhook signatures.
- Verify payment amounts.
- Validate plan and billing period.
- Prevent duplicate payment processing.
- Update subscription status and generation units only after verified payment.

Never trust client-submitted prices or unit quantities.

11. Database and Authentication

Firebase Authentication handles user authentication.

Firestore stores relevant user and application records, including:

- User profiles.
- Roles.
- Unit balances.
- Subscription information.
- Payment records.
- Generation task records.

Server-side Firebase Admin operations must use protected credentials.

Users must only access their own generation tasks and authorized account information.

12. Cloudinary Processing

Cloudinary handles completed video storage and delivery.

Configured unsigned upload preset:

"azibo-unsigned"

The backend should verify upload results before marking a generation as completed.

Failed uploads must not be reported as successful generations.

13. Watermark Rules

Exact watermark text:

"Made with AZIBO STUDIO"

Position: bottom-right.

Rules:

- Free-user videos: watermark enabled.
- Active paid subscriber videos: no watermark.
- Owner/admin videos: watermark enabled for organic promotion.

Watermark decisions must be enforced by the server.

14. Video Preview and Download

After successful generation:

- Display the completed video inside AZIBO.
- Allow playback with standard video controls.
- Provide a download option.
- Display useful error messages when generation fails.
- Do not expose unfinished or failed video URLs as completed results.

15. Administrator Features

The administrator area should provide access to:

- User management.
- Analytics.
- Credit packages.
- Application settings.
- AI provider configuration.

Administrator pages and their corresponding API routes must enforce verified administrator permissions.

16. Error Handling and Refunds

Generation failures must be handled safely.

The system should:

- Record failed tasks.
- Avoid duplicate refunds.
- Restore deducted units when a generation fails and the refund is applicable.
- Avoid refunding successful generations.
- Prevent unauthorized users from checking or retrieving another user's task.

Payment processing and generation refunds must be idempotent.

17. Environment Variables

AZIBO configuration must be stored in the appropriate Vercel environment variables.

Public configuration may include:

- Firebase client configuration.
- Paystack public key.
- Public Paystack subscription plan codes.
- Cloudinary cloud name.
- Cloudinary upload preset.

Private server-side credentials include:

- Firebase Admin credentials.
- Paystack secret key.
- Pika Kling API key.
- Other private provider credentials.

Private credentials must never be exposed through frontend code, API responses or "NEXT_PUBLIC_*" environment variables.

Environment-variable names must match the actual application implementation.

18. Deployment

AZIBO is deployed through Vercel.

Before production deployment:

- Confirm package manager and lockfile consistency.
- Confirm environment variables.
- Run a successful production build.
- Check TypeScript errors.
- Verify API routes.
- Confirm Firebase connectivity.
- Confirm Paystack webhook configuration.
- Test provider connectivity.
- Test Cloudinary uploads.

19. Production Testing

Test the following before launch:

1. New user registration and 100 signup units.
2. User login and authentication.
3. Owner unlimited access.
4. Free-user generation and unit deduction.
5. Paid-user generation.
6. 1080p access restrictions.
7. All supported durations and aspect ratios.
8. Animal, human, 3D and anime prompts through the same generator.
9. Video preview and download.
10. Free and owner watermark placement.
11. Paid-user watermark removal.
12. Payment verification.
13. Duplicate webhook protection.
14. Generation failure and unit restoration.
15. Unauthorized task access prevention.

20. Final Production Requirement

This guide describes AZIBO STUDIO's intended production architecture and business rules.

Documentation alone does not confirm that every feature is implemented correctly.

Production readiness must be established through successful builds, code consistency checks, provider tests, payment tests, security checks and complete generation testing.