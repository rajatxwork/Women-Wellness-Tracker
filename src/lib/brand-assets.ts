// Most of these were generated via Higgsfield to match the app's flat,
// warm, honestly-named color tokens (see design-tokens skill); logoMark is
// an exception, sourced directly from Midjourney. All of them are hosted
// externally rather than vendored into /public: this repo's sandbox
// network policy blocks outbound fetches to both the Higgsfield CDN and
// cdn.midjourney.com (confirmed for curl and for a Playwright browser,
// net::ERR_TUNNEL_CONNECTION_FAILED / CONNECT 403), so none of these files
// could be downloaded and committed locally, or their content visually
// verified from this sandbox. If that ever needs to change, download each
// URL below and swap the constant for a local `/brand/...` path.
//
// Core brand background gradients (pink -> cream -> warm gold, matching
// reference-images/background/) are generated via gpt_image_2_5. These are
// deliberately backed by the CSS gradient tokens in globals.css
// (--gradient-hero, --gradient-glow) as the reliable base layer: the
// generated image is layered on top via `background-image` for grain
// texture, but the CSS gradient underneath (set via a `bg-*` class or
// inline style background-color) is what actually renders if the image
// never loads. Never remove that CSS fallback when using these.
export const BRAND_ASSETS = {
  // Sourced from Midjourney directly (cdn.midjourney.com), not Higgsfield —
  // this one wasn't generated in this session and its content was never
  // seen or verified here (see design-tokens skill for why).
  logoMark: "https://cdn.midjourney.com/49c3df9d-2981-4c88-9877-48664036ed8b/0_0.png",
  emptyStatePlant: "https://d8j0ntlcm91z4.cloudfront.net/user_3JWZo2SP4ZSdZIUVqHwLuusIPqQ/hf_20260919_012719_adba991c-597c-444a-9693-7aa12455aac6.svg",
  gradientPinkCream: "https://d8j0ntlcm91z4.cloudfront.net/user_3JWZo2SP4ZSdZIUVqHwLuusIPqQ/hf_20260919_015806_137e99e4-1bf2-468c-abb6-dd12255a1522.png",
  gradientPinkGold: "https://d8j0ntlcm91z4.cloudfront.net/user_3JWZo2SP4ZSdZIUVqHwLuusIPqQ/hf_20260919_015806_b71d0dbc-5226-438e-9dec-4d1e64806ab8.png",
  gradientCornerGlow: "https://d8j0ntlcm91z4.cloudfront.net/user_3JWZo2SP4ZSdZIUVqHwLuusIPqQ/hf_20260919_015806_ebc7a4a8-b1b6-46a3-96e9-2f893ab12df4.png",
  gradientRoseAmber: "https://d8j0ntlcm91z4.cloudfront.net/user_3JWZo2SP4ZSdZIUVqHwLuusIPqQ/hf_20260919_015806_788aa36e-aa82-486b-bd38-195f6c240b27.png",
} as const;

export const PHASE_ICONS = {
  menstrual: "https://d8j0ntlcm91z4.cloudfront.net/user_3JWZo2SP4ZSdZIUVqHwLuusIPqQ/hf_20260919_012719_21ae278e-15e6-49b9-8af8-6a544a11332e.svg",
  follicular: "https://d8j0ntlcm91z4.cloudfront.net/user_3JWZo2SP4ZSdZIUVqHwLuusIPqQ/hf_20260919_012742_e75376bb-4b35-49bd-a5d6-48e1e3fe84cc.svg",
  ovulation: "https://d8j0ntlcm91z4.cloudfront.net/user_3JWZo2SP4ZSdZIUVqHwLuusIPqQ/hf_20260919_012719_12f97209-c8bb-4a2e-b9ff-e22ce1b54f9f.svg",
  // Recolored off the original purple to a deep rose (#c2577a) to match the
  // no-purple brand rule — see --color-rose in globals.css.
  luteal: "https://d8j0ntlcm91z4.cloudfront.net/user_3JWZo2SP4ZSdZIUVqHwLuusIPqQ/hf_20260919_015828_d52a716c-e99b-483d-805a-69281dc717e8.svg",
} as const;
