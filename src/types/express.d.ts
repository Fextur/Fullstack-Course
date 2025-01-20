import express from "express";
import { IUser } from "../Models/User";

declare global {
  namespace Express {
    export interface Request {
      user: IUser["_id"];
    }
  }
}
