import { type Response } from "express";

export function clearCookies(res: Response, ...cookies: string[]) {
  for (let i = 0; i < cookies.length; i++) {
    res.clearCookie(cookies[i]);
  }
}