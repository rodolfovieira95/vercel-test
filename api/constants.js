import fs from "fs";
import "dotenv/config";

export const TWITCH_CLIENT_ID = process.env.CLIENT_ID;
export const TWITCH_SECRET = process.env.CLIENT_SECRET;
export const SESSION_SECRET = process.env.CLIENT_SECRET;
export const CALLBACK_URL = process.env.CALLBACK_URL;
export const TWITCH_MESSAGE_ID = "Twitch-Eventsub-Message-Id".toLowerCase();
export const TWITCH_MESSAGE_TIMESTAMP =
  "Twitch-Eventsub-Message-Timestamp".toLowerCase();
export const TWITCH_MESSAGE_SIGNATURE =
  "Twitch-Eventsub-Message-Signature".toLowerCase();
export const MESSAGE_TYPE = "Twitch-Eventsub-Message-Type".toLowerCase();

// Notification message types
export const MESSAGE_TYPE_VERIFICATION = "webhook_callback_verification";
export const MESSAGE_TYPE_NOTIFICATION = "notification";
export const MESSAGE_TYPE_REVOCATION = "revocation";

// Prepend this string to the HMAC that's created from the message
export const HMAC_PREFIX = "sha256=";
export const options = {
  key: fs.readFileSync("/etc/ssl/localhost/localhost.key"),
  cert: fs.readFileSync("/etc/ssl/localhost/localhost.crt"),
};
