import { IUser } from "../models/User";

// Augments Express's Request type so `req.user` is typed everywhere,
// once the Clerk auth middleware (added in the next step) sets it.
declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string | null;
        sessionId: string | null;
        [key: string]: any;
      };
      user?: IUser;
    }
  }
}

export {};
