import jwt, { JwtPayload } from 'jsonwebtoken';
import { Response, Request, NextFunction } from 'express';
export const SECRET = 'SECr3t';  // This should be in an environment variable in a real application

export const authenticateJwt = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET, (err, payload) => {
      if (err) {
        return res.sendStatus(4036);
      }
      if (!payload) {
        return res.sendStatus(403)
      }
      if (typeof payload === 'string') {
        return res.sendStatus(403)
      }
      req.headers['id'] = payload.id
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

