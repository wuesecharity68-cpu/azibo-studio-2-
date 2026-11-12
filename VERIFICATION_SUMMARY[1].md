AZIBO STUDIO — IMPLEMENTATION VERIFICATION

Purpose

This document records the implementation requirements and verification points for AZIBO STUDIO.

It distinguishes intended functionality from features that have actually been tested. Items must only be marked verified after checking the current source code and, where applicable, the production deployment.

---

1. Free Generation Unit System

New Normal Users

A new legitimate normal user is intended to receive:

100 free generation units.

This applies to:

- Email sign-up
- First-time Google sign-in

Existing users must retain their existing generation-unit balances. They must not receive another signup allowance simply by signing in again.

The first normal user to register must not automatically become the owner.

Owner Account

Configured owner email:

"christianaayu63@gmail.com"

Owner access must be determined through server-side authorization logic.

The owner:

- Is exempt from normal generation-unit deductions.
- Is exempt from normal subscription restrictions.
- Has unlimited generation access through owner authorization.
- Does not require an artificial stored balance such as "999999".
- Must not be represented as having unlimited stored units in Firestore.
- Always receives the AZIBO STUDIO watermark.

Owner authorization must not depend solely on a client-side role value.

---

2. Anti-Abuse Protection

AZIBO STUDIO should prevent repeated attempts to claim the new-user generation allowance.

Possible anti-abuse signals include:

- Device or browser information
- Previous free-unit claim records
- IP-related information where appropriate
- Account history
- Other server-side abuse indicators

Intended Repeat-Claim Behaviour

When a repeat claim is detected:

- Another 100-unit allowance must not automatically be granted.
- No automatic 5-unit reward should be granted.

Anti-abuse signals are indicators, not perfect proof of identity.

The implementation should account for legitimate users sharing a device, browser, or network. An IP address alone should not automatically establish that two accounts belong to the same person.

The actual anti-abuse implementation must be inspected and tested before this feature is marked verified.

---

3. Watermarking

Free Users

Free users:

- Receive the AZIBO STUDIO watermark on generated videos.
- Cannot disable the required watermark while using the free plan.

Exact watermark text:

"Made with AZIBO STUDIO"

Position:

Bottom-right of the video.

Paid Users

Active Starter, Creator, and Professional subscribers generate new eligible videos without the AZIBO STUDIO watermark by default.

Owner

The owner always receives the AZIBO STUDIO watermark.

This allows owner-generated videos to remain branded for AZIBO STUDIO promotion and advertising.

Owner unlimited-generation access and owner watermarking are separate rules.

Watermark decisions must be enforced server-side, not controlled by frontend settings alone.

---

4. Current Video Generation

AZIBO STUDIO provides text-based AI video generation through one universal generator.

Supported visual styles:

- Animal Videos
- Realistic Human Videos
- 3D Animation
- Anime Videos

Users describe the video they want through a text prompt. The prompt determines the subject and visual style.

Generation Options

Durations

- 5 seconds
- 10 seconds
- 15 seconds

Resolutions

- 720p
- 1080p

Aspect ratios

- 16:9
- 9:16
- 1:1

Generation method

- Text-to-Video only

Image-to-Video is not part of the current product.

Generation Flow

Enter prompt → Generate → Wait for processing → Preview video inside AZIBO → Download/save

Users should have an opportunity to preview generated videos before saving them.

The current creation page is:

"/create"

The four visual styles must not be treated as four separate generator routes.

---

5. Generation Unit Costs

The current generation-unit map is:

Duration| 720p| 1080p
5 seconds| 1 unit| 2 units
10 seconds| 2 units| 4 units
15 seconds| 3 units| 6 units

Generation-unit calculations must be performed server-side.

The client must not determine the final number of units deducted.

---

6. User Profile

The application uses Firebase Authentication and Firestore user profiles.

Relevant profile information may include:

- User ID
- Email
- Display name
- Role
- Generation-unit balance
- Subscription plan
- Subscription status
- Account creation information
- Other application-specific account fields

The actual Firestore schema is the source of truth for field names and additional profile information.

Owner privileges must be established through the application's server-side authorization logic.

---

7. Subscription Plans

AZIBO STUDIO currently uses monthly and quarterly billing.

Starter

- ₦72,000/month
- ₦216,000/quarter
- 50 units/month
- 150 units/quarter

Creator

- ₦198,000/month
- ₦594,000/quarter
- 150 units/month
- 450 units/quarter

Professional

- ₦398,000/month
- ₦1,194,000/quarter
- 300 units/month
- 900 units/quarter

Regular Reference Pricing

Plan| Monthly Regular| Quarterly Regular
Starter| ₦89,000| ₦267,000
Creator| ₦249,000| ₦747,000
Professional| ₦499,000| ₦1,497,000

The billing periods are:

- Monthly
- Quarterly

There is no current yearly billing option.

The correct plan name is Professional, not the former Pro naming.

Launch pricing and regular reference pricing must match the actual pricing implementation.

---

8. Paid Subscription and Watermark Flow

The intended paid-user flow is:

Free user
↓
Select paid plan
↓
Pay through Paystack
↓
Payment is verified server-side
↓
Subscription information is updated
↓
Paid-plan generation access becomes available
↓
Eligible new videos are generated without the watermark

Payment status must never be trusted solely from client-side values.

The server-side payment verification and subscription implementation are the source of truth.

Duplicate webhook processing must not grant subscription units more than once.

---

9. Video Generation Verification

Before production readiness is confirmed, verify:

- Authentication
- User authorization
- Prompt validation
- Text-based video generation
- Duration validation
- Resolution validation
- Aspect-ratio validation
- Generation-unit calculation
- Generation-unit deduction
- Failed-generation unit restoration
- Provider authentication
- Provider error handling
- Video status polling
- Video processing
- Video preview
- Video download
- Watermark processing
- Correct paid-user watermark behaviour
- Correct free-user watermark behaviour
- Correct owner watermark behaviour

Generation must continue using the existing application architecture:

- "/create"
- "/api/generate"
- "/api/generate/status"

Do not introduce duplicate generation routes or separate category-specific generator pages.

---

10. Provider Security

Video-generation provider credentials are sensitive.

Verify that:

- Provider secrets remain server-side.
- Provider API keys are never exposed to browser code.
- Provider credentials are not stored in publicly readable Firestore data.
- Provider credentials are not included in API responses.
- Secret environment variables are not exposed through "NEXT_PUBLIC_*" variables.
- Provider credentials are not committed to public source repositories.
- Client requests communicate with AZIBO's server-side generation API rather than directly with the provider.

The intended provider is Pika Kling 3.0 Turbo. Its actual connection and successful generation must be tested before the integration is marked verified.

---

11. Authentication Verification

Email Authentication

- [ ] New user can create an account.
- [ ] New legitimate user receives 100 free units.
- [ ] Existing user retains their existing units.
- [ ] Owner account receives owner privileges through server-side authorization.
- [ ] Owner access is not based solely on a client-side role value.

Google Authentication

- [ ] First-time Google user can create an account.
- [ ] New legitimate Google user receives 100 free units.
- [ ] Existing Google user retains their existing units.
- [ ] Owner account is correctly recognized.

Google authentication should only be marked verified if it is enabled and configured in the actual application.

---

12. Watermark Testing

Free User

- [ ] Generate a video.
- [ ] Confirm the video contains "Made with AZIBO STUDIO".
- [ ] Confirm the watermark appears at the bottom-right.
- [ ] Confirm the free user cannot disable the required watermark.

Paid User

- [ ] Complete a valid paid-plan purchase.
- [ ] Confirm payment is verified server-side.
- [ ] Confirm the paid subscription is reflected in the user's account.
- [ ] Generate a new video.
- [ ] Confirm the new eligible paid-user video does not contain the AZIBO STUDIO watermark.

Owner

- [ ] Sign in as "christianaayu63@gmail.com".
- [ ] Confirm owner privileges.
- [ ] Confirm normal generation-unit deduction is bypassed.
- [ ] Confirm normal subscription restrictions are bypassed.
- [ ] Generate a video.
- [ ] Confirm the video contains "Made with AZIBO STUDIO".
- [ ] Confirm the watermark appears at the bottom-right.

---

13. Anti-Abuse Testing

Test the free-generation-unit system carefully:

- [ ] New legitimate user receives 100 units.
- [ ] Existing user does not receive another signup allowance.
- [ ] A repeated claim from a detected environment does not automatically receive another 100 units.
- [ ] No automatic 5-unit reward is granted for a repeat claim.
- [ ] Legitimate users sharing a network are not automatically treated as the same person solely because they share an IP address.
- [ ] Claim records are handled securely on the server.

---

14. Generation Unit Testing

Verify the following calculations server-side:

- [ ] 5 seconds / 720p = 1 unit.
- [ ] 5 seconds / 1080p = 2 units.
- [ ] 10 seconds / 720p = 2 units.
- [ ] 10 seconds / 1080p = 4 units.
- [ ] 15 seconds / 720p = 3 units.
- [ ] 15 seconds / 1080p = 6 units.

Also verify:

- [ ] Insufficient units prevent generation.
- [ ] Successful generation deducts the correct amount.
- [ ] Failed provider generation restores deducted units where applicable.
- [ ] Owner generation does not deduct units.
- [ ] Owner access does not depend on a stored unlimited-unit balance.

---

15. Deployment Verification

The following must be verified against the actual production deployment:

- [ ] Production build completes successfully.
- [ ] TypeScript compilation succeeds.
- [ ] All imported components exist.
- [ ] All imported modules resolve correctly.
- [ ] Firebase configuration resolves correctly.
- [ ] Required environment variables exist.
- [ ] Authentication works on the production domain.
- [ ] Firestore access works correctly.
- [ ] Paystack initialization works correctly.
- [ ] Paystack payment verification works correctly.
- [ ] Subscription activation works correctly.
- [ ] Generation API resolves correctly.
- [ ] Generation status API resolves correctly.
- [ ] Provider authentication works.
- [ ] Video generation completes successfully.
- [ ] Video preview works.
- [ ] Video downloads work.
- [ ] Watermark processing works.
- [ ] Paid-user watermark behaviour works.
- [ ] Owner watermark behaviour works.

---

16. Final Verification Status

This document is an implementation and verification checklist.

It does not claim that the application has:

- Passed every build check.
- Passed every TypeScript check.
- Completed a successful production deployment.
- Completed a successful payment.
- Completed a successful video generation.
- Passed every security test.

These items must only be marked complete after they have been tested and confirmed.

---

Final Pre-Deployment Checklist

Authentication & Accounts

- [ ] Email authentication verified.
- [ ] Google authentication verified, if enabled.
- [ ] 100 free-unit system verified.
- [ ] Existing-user balances preserved.
- [ ] Owner authorization verified.
- [ ] Owner unlimited access verified.

Generation

- [ ] Animal-style prompts verified.
- [ ] Realistic-human prompts verified.
- [ ] 3D-animation prompts verified.
- [ ] Anime-style prompts verified.
- [ ] Text-prompt generation verified.
- [ ] 5-second generation verified.
- [ ] 10-second generation verified.
- [ ] 15-second generation verified.
- [ ] 720p generation verified.
- [ ] 1080p generation verified.
- [ ] Aspect ratios verified.
- [ ] Generation-unit calculations verified.
- [ ] Unit deduction verified.
- [ ] Failed-generation restoration verified.

Watermarking

- [ ] Free-user watermark verified.
- [ ] Paid-user watermark behaviour verified.
- [ ] Owner watermark verified.
- [ ] Bottom-right watermark position verified.
- [ ] "Made with AZIBO STUDIO" text verified.

Payments

- [ ] Paystack initialization verified.
- [ ] Payment verification verified.
- [ ] Subscription activation verified.
- [ ] Monthly plans verified.
- [ ] Quarterly plans verified.
- [ ] Correct plan allocations verified.
- [ ] Duplicate webhook protection verified.

Security

- [ ] Provider credentials secured.
- [ ] Server-side authorization verified.
- [ ] Server-side unit calculations verified.
- [ ] Firestore permissions verified.
- [ ] API authentication verified.
- [ ] Sensitive credentials excluded from client responses.
- [ ] Generation ownership checks verified.

Production

- [ ] Production build verified.
- [ ] TypeScript compilation verified.
- [ ] Required environment variables verified.
- [ ] Production authentication verified.
- [ ] Video generation verified.
- [ ] Video preview verified.
- [ ] Video download verified.
- [ ] Watermark processing verified.
- [ ] Production deployment verified.