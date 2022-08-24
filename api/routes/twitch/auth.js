import passport from "passport";

export const authRoutes = (app) => {
  // Set route to start OAuth link, this is where you define scopes to request
  app.get(
    "/auth/twitch",
    passport.authenticate("twitch", {
      scope: "user_read channel_subscriptions",
    })
  );

  // Set route for OAuth redirect
  app.get(
    "/auth/twitch/callback",
    passport.authenticate("twitch", {
      successRedirect: "/home",
      failureRedirect: "/",
    })
  );
};
