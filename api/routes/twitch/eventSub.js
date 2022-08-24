import WebSocket from "ws";

import { getHmac, getHmacMessage, verifyMessage } from "./utils";
import {
  HMAC_PREFIX,
  MESSAGE_TYPE,
  MESSAGE_TYPE_NOTIFICATION,
  MESSAGE_TYPE_REVOCATION,
  MESSAGE_TYPE_VERIFICATION,
  TWITCH_MESSAGE_SIGNATURE,
  TWITCH_SECRET,
} from "../../constants";

export const eventSub = (app, wss) => {
  app.post("/eventsub", (req, res) => {
    let message = getHmacMessage(req);
    let hmac = HMAC_PREFIX + getHmac(TWITCH_SECRET, message); // Signature to compare

    const signature = req.headers[TWITCH_MESSAGE_SIGNATURE];

    console.log(req.headers[MESSAGE_TYPE]);

    // CHECK IF SHOULD TURN ON THIS VERIFICATION!!!!!!!!!!!!!!!!!!!

    // if (signature && true === verifyMessage(hmac, signature)) {
    const notification = req.body && JSON.parse(req.body);

    if (MESSAGE_TYPE_NOTIFICATION === req.headers[MESSAGE_TYPE]) {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(notification?.event?.user_name);
        }
      });
      res.sendStatus(200);
    } else if (MESSAGE_TYPE_VERIFICATION === req.headers[MESSAGE_TYPE]) {
      res.set("Content-Type", "text/plain");
      res.send(notification?.challenge);
    } else if (MESSAGE_TYPE_REVOCATION === req.headers[MESSAGE_TYPE]) {
      res.sendStatus(204);
    } else {
      res.sendStatus(204);
      console.log(`Unknown message type: ${req.headers[MESSAGE_TYPE]}`);
    }
    // }
    res.sendStatus(500);
  });
};
