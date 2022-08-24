import axios from "axios";
import { Express } from "express";
import handlebars from "handlebars";

import { TWITCH_CLIENT_ID, TWITCH_SECRET } from "../constants";

export const homeRoute = (app) => {
  // Define a simple template to safely generate HTML with values from user's profile
  var template = handlebars.compile(`
  <html><head><title>Twitch Auth Sample</title></head>
  <table>
      <tr><th>Access Token</th><td>{{accessToken}}</td></tr>
      <tr><th>Refresh Token</th><td>{{refreshToken}}</td></tr>
      <tr><th>Display Name</th><td>{{data.[0].display_name}}</td></tr>
      <tr><th>Bio</th><td>{{data.[0].description}}</td></tr>
      <tr><th>Image</th><td><img src={{data.[0].profile_image_url}}></img></td></tr>
  </table></html>`);

  const requestSubscription = async (brodcasterId) => {
    const { data, status } = await axios.post(
      "https://api.twitch.tv/helix/eventsub/subscriptions",
      {
        type: "channel.subscribe",
        version: "1",
        condition: {
          broadcaster_user_id: brodcasterId, // the broadcaster ID I want to check for notifications
        },
        transport: {
          method: "webhook",
          callback: "https://localhost/eventsub",
          secret: TWITCH_SECRET,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer uev8hla5ijugmzh7eooscpmwy9iq1r`,
          "Client-Id": TWITCH_CLIENT_ID,
        },
      }
    );
  };

  app.get("/home", function (req, res) {
    if (req.session && req.session.passport && req.session.passport.user) {
      requestSubscription(req.session.passport.user.data[0].id);
      res.send(template(req.session.passport.user));
    } else {
      res.send(
        '<html><head><title>Home</title></head><h1>Home without user info!</h1><a href="/auth/twitch">Try Again</a></html>'
      );
    }
  });
};
