import { ApolloServer } from "apollo-server-express";
import http from "http";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";
import express from "express";
import session from "express-session";
import passport from "passport";
import OAuth2Strategy from "passport-oauth2";
import axios from "axios";
import WebSocket from "ws";
import https from "https";

import {
  CALLBACK_URL,
  options,
  SESSION_SECRET,
  TWITCH_CLIENT_ID,
  TWITCH_SECRET,
} from "./constants";
import { initializeRoutes } from "./routes";
import resolvers from "./graphql/resolvers";
import typeDefs from "./graphql/schema";
import { context } from "./graphql/context";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

async function startApolloServer() {
  const configurations = {
    production: {
      ssl: true,
      port: 443,
      hostname: "https://vercel-test-ten-ashen.vercel.app/",
    },
    development: { ssl: true, port: 443, hostname: "localhost" },
  };

  const environment = process.env.NODE_ENV || "development";
  const config = configurations[environment];

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context,
    csrfPrevention: true,
    cache: "bounded",
    plugins: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
  });
  await server.start();
  // const corsOptions = {
  //   origin: "https://vercel-test-ten-ashen.vercel.app/",
  //   credentials: true,
  // };

  const app = express();
  app.use(cors());
  server.applyMiddleware({ app, path: "/graphql" });

  // Create the HTTPS or HTTP server, per configuration
  let httpServer;
  if (config.ssl) {
    // Assumes certificates are in a .ssl folder off of the package root.
    // Make sure these files are secured.
    httpServer = https.createServer(options, app);
  } else {
    httpServer = http.createServer(app);
  }
  app.use(express.raw({ type: "application/json" }));

  const wss = new WebSocket.Server({ server: httpServer });
  wss.on("connection", (ws) => {
    //connection is up, let's add a simple simple event
    ws.on("message", (message) => {
      //log the received message and send it back to the client
      console.log("received: %s", message);
      ws.send(`Hello, you sent -> ${message}`);
    });

    //send immediatly a feedback to the incoming connection
    // ws.send('Hi there, I am a WebSocket server');
  });

  app.use(
    session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false })
  );
  app.use(express.static("public"));
  app.use(passport.initialize());
  app.use(passport.session());

  // Override passport profile function to get user profile from Twitch API
  OAuth2Strategy.prototype.userProfile = async (accessToken, done) => {
    var options = {
      url: "https://api.twitch.tv/helix/users",
      method: "GET",
      headers: {
        "Client-ID": TWITCH_CLIENT_ID,
        Accept: "application/vnd.twitchtv.v5+json",
        Authorization: "Bearer " + accessToken,
      },
    };

    const { data, status } = await axios(options);

    if (data && status === 200) {
      done(null, data);
    } else {
      done(data);
    }
  };

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });

  passport.use(
    "twitch",
    new OAuth2Strategy(
      {
        authorizationURL: "https://id.twitch.tv/oauth2/authorize",
        tokenURL: "https://id.twitch.tv/oauth2/token",
        clientID: TWITCH_CLIENT_ID,
        clientSecret: TWITCH_SECRET,
        callbackURL: CALLBACK_URL,
        state: true,
      },
      (accessToken, refreshToken, profile, done) => {
        profile.accessToken = accessToken;
        profile.refreshToken = refreshToken;

        // Securely store user profile in your DB
        //User.findOrCreate(..., function(err, user) {
        //  done(err, user);
        //});

        done(null, profile);
      }
    )
  );

  initializeRoutes(app, wss);

  await new Promise((resolve) =>
    httpServer.listen({ port: config.port }, resolve)
  );

  console.log(
    "🚀 Server ready at",
    `http${config.ssl ? "s" : ""}://${config.hostname}:${config.port}${
      server.graphqlPath
    }`
  );

  return { server, app };
}

startApolloServer();
