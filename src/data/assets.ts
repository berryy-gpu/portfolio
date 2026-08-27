export const PROJECT_IMAGES_DIR = "/images/projects" as const;
export const SOCIAL_IMAGES_DIR = "/images/social" as const;
export const PROFILE_IMAGES_DIR = "/images/profile" as const;
export const LOGO_IMAGES_DIR = "/images/logos" as const;
export const SERVICE_IMAGES_DIR = "/images/services" as const;
export const TESTIMONIAL_IMAGES_DIR = "/images/testimonials" as const;
export const GALLERY_IMAGES_DIR = "/images/gallery" as const;
/** color/mono subpaths of LOGO_IMAGES_DIR — still needed by
 *  getClientLogoPath's variant lookup (clients.ts), which existing
 *  consumers (ClientHero, Testimonials) rely on for the colour variant;
 *  Client.logo itself (also clients.ts) stores the mono path directly. */
export const LOGO_COLOR_DIR = "/images/logos/color" as const;
export const LOGO_MONO_DIR = "/images/logos/mono" as const;
export const REEL_VIDEOS_DIR = "/videos/reels" as const;
export const SHOWREEL_VIDEOS_DIR = "/videos/showreel" as const;

export type ProjectImagePath = `${typeof PROJECT_IMAGES_DIR}/${string}`;
export type SocialImagePath = `${typeof SOCIAL_IMAGES_DIR}/${string}`;
export type ProfileImagePath = `${typeof PROFILE_IMAGES_DIR}/${string}`;
export type LogoImagePath = `${typeof LOGO_IMAGES_DIR}/${string}`;
export type ServiceImagePath = `${typeof SERVICE_IMAGES_DIR}/${string}`;
export type TestimonialImagePath = `${typeof TESTIMONIAL_IMAGES_DIR}/${string}`;
export type GalleryImagePath = `${typeof GALLERY_IMAGES_DIR}/${string}`;
export type ReelVideoPath = `${typeof REEL_VIDEOS_DIR}/${string}`;
export type ShowreelVideoPath = `${typeof SHOWREEL_VIDEOS_DIR}/${string}`;
