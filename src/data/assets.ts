export const PROJECT_IMAGES_DIR = "/images/projects" as const;
export const SOCIAL_IMAGES_DIR = "/images/social" as const;
export const PROFILE_IMAGES_DIR = "/images/profile" as const;
export const REEL_VIDEOS_DIR = "/videos/reels" as const;
export const SHOWREEL_VIDEOS_DIR = "/videos/showreel" as const;

export type ProjectImagePath = `${typeof PROJECT_IMAGES_DIR}/${string}`;
export type SocialImagePath = `${typeof SOCIAL_IMAGES_DIR}/${string}`;
export type ProfileImagePath = `${typeof PROFILE_IMAGES_DIR}/${string}`;
export type ReelVideoPath = `${typeof REEL_VIDEOS_DIR}/${string}`;
export type ShowreelVideoPath = `${typeof SHOWREEL_VIDEOS_DIR}/${string}`;
