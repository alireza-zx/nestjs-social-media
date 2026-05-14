import { registerAs } from "@nestjs/config";

export const uploadConfig = registerAs('upload', () => ({
  uploadPathAvatars: process.env.UPLOAD_PATH_AVATARS,
  uploadPathPosts: process.env.UPLOAD_PATH_POSTS,
  uploadPathReels: process.env.UPLOAD_PATH_REELS
}));