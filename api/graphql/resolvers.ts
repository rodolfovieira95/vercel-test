import { ApolloError } from "apollo-server-express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { Context } from "./context";

const resolvers = {
  Query: {
    users: (_parent: any, _args: any, context: Context) => context.prisma.user.findMany(),
    user: (_parent: any, args: { id: string }, context: Context) =>
      context.prisma.user.findUnique({ where: { id: args?.id || undefined } }),
  },
  Mutation: {
    signin: async (_parent: any, args: { signinInput: { email: string; password: string } }, context: Context) => {
      const userAlreadyExists = await context.prisma.user.findUnique({
        where: { email: args.signinInput.email || undefined },
      });
      if (!userAlreadyExists) {
        throw new ApolloError(`There is no user with this e-mail ${args.signinInput.email}`, "USER_DOES_NOT_EXIST");
      }
      const userInfo = await context.prisma.user.findUnique({ where: { email: args.signinInput.email } });
      const isCorrectPassword = await bcrypt.compare(args.signinInput.password, userInfo.password);

      if (!isCorrectPassword) {
        throw new ApolloError(`Incorrect password`, "INCORRECT_PASSWORD");
      }

      const token = jwt.sign({ _id: (await userInfo).id, email: args.signinInput.email }, process.env.TOKEN_SECRET, {
        expiresIn: "2h",
      });

      const res = await context.prisma.user.update({
        where: {
          id: (await userInfo).id,
        },
        data: {
          token: token,
        },
      });
      return { ...res };
    },
    signup: async (_parent: any, args: { signupInput: { email: string; password: string } }, context: Context) => {
      const userAlreadyExists = await context.prisma.user.findUnique({
        where: { email: args.signupInput.email || undefined },
      });

      if (userAlreadyExists) {
        throw new ApolloError(
          `A user already exists with this e-mail ${args.signupInput.email}`,
          "USER_ALREADY_EXISTS"
        );
      }

      const encryptedPassword = await bcrypt.hash(args.signupInput.password, 10);

      const newUser = context.prisma.user.create({
        data: {
          email: args.signupInput.email.toLowerCase(),
          password: encryptedPassword,
          token: "",
          username: "",
        },
      });

      const token = jwt.sign({ _id: (await newUser).id, email: args.signupInput.email }, process.env.TOKEN_SECRET, {
        expiresIn: "2h",
      });

      const res = await context.prisma.user.update({
        where: {
          id: (await newUser).id,
        },
        data: {
          token: token,
        },
      });

      return { ...res };
    },
  },
};

export default resolvers;
