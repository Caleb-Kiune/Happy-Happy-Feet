/**
 * Base64 encoded SVG placeholder for Next.js Image blurDataURL.
 * Use this to show a blurred background while images are loading.
 */

// Simple light gray background (#f3f4f6)
const PLACEHOLDER_SVG = `
<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" fill="#f3f4f6"/>
  <path d="M30 65 L70 65 L70 60 Q50 60 30 50 Z" fill="#e5e7eb" />
</svg>
`;

const toBase64 = (str: string) =>
    typeof window === "undefined"
        ? Buffer.from(str).toString("base64")
        : window.btoa(str);

export const PLACEHOLDER_IMAGE = `data:image/svg+xml;base64,${toBase64(PLACEHOLDER_SVG)}`;
