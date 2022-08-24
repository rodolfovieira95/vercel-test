import { TWITCH_MESSAGE_ID, TWITCH_MESSAGE_TIMESTAMP } from "../../constants";
import crypto from "crypto";

// Build the message used to get the HMAC.
export const getHmacMessage = (request) =>
  request.headers[TWITCH_MESSAGE_ID] +
  request.headers[TWITCH_MESSAGE_TIMESTAMP] +
  request.body;

// Get the HMAC.
export const getHmac = (secret, message) =>
  crypto.createHmac("sha256", secret).update(message).digest("hex");

// Verify whether our hash matches the hash that Twitch passed in the header.
export const verifyMessage = (hmac, verifySignature) =>
  crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(verifySignature));
