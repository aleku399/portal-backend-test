import { hash, compare } from "bcrypt";
import { Response, Request, NextFunction } from "express";
import { sign, verify, decode } from "jsonwebtoken";
import { join } from "path";
require("dotenv").config();

export const customPayloadResponse = (
  status: boolean,
  payload: any
): object => {
  return {
    status: status,
    payload: payload,
  };
};

export const randomStringGenerator = (length: number) => {
  let result = "";
  const characters = "A0B1C2D3E4F5G6H7I8J9K0LMNOPQRSTUVWXYZ";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

export const hashPassword = async (password: string, rounds: number) => {
  try {
    const hashedPassword = await hash(password, rounds);
    return hashedPassword;
  } catch (error) {
    console.log(error);
  }
};

export const validatePassword = async (
  password: string,
  hashedPassword: string
) => {
  try {
    const result = await compare(password, hashedPassword);
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const getAuthAccessToken = (user: object, token: any) => {
  const accessToken = sign(JSON.parse(JSON.stringify(user)), token, {
    expiresIn: "365d",
  });
  return accessToken;
};

export const getAuthRefreshToken = (user: object, token: any) => {
  const refreshToken = sign(JSON.parse(JSON.stringify(user)), token, {
    expiresIn: "365d",
  });
  return refreshToken;
};

export const verifyAuthAccessToken = (token: any, secret: any) => {
  const verifiedToken = verify(token, secret);
  return verifiedToken;
};

export const invalidateToken = (modifiedLoad: any, secret: any) => {
  const newToken = sign(modifiedLoad, secret);
  return newToken;
};

export const decodeToken = (token: any) => {
  const decodeToken = decode(token);
  return decodeToken;
};

export const setTokenExpiryToZero = (decodedToken: any) => {
  const modifiedPayload = { ...decodedToken, exp: 0 };
  return modifiedPayload;
};

export function runMiddleware(req: Request, res: Response, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export const JWTAuthMiddleWare = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json(customPayloadResponse(false, "Token Expired"));
    }
    const decoded = verifyAuthAccessToken(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );
    // @ts-ignore
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json(customPayloadResponse(false, "Invalid Token"));
  }
};

