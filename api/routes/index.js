import { homeRoute } from "./home";
import { rootRoute } from "./root";
import { notificationRoute } from "./twitch/notification";
import { authRoutes } from "./twitch/auth";
import { eventSub } from "./twitch/eventSub";

export const initializeRoutes = (app, wss) => {
  authRoutes(app);
  rootRoute(app);
  homeRoute(app);
  notificationRoute(app);
  eventSub(app, wss);
};
