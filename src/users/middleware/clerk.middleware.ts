import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '@clerk/clerk-sdk-node';


@Injectable()
export class ClerkMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
      const authHeader = req.headers.authorization;
  
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException('Authorization token is missing or invalid');
      }
  
      const token = authHeader.split(' ')[1];
  
      try {
        const { sub, claims } = await verifyToken(token, {}); // Verify Clerk's JWT token
        req['user'] = { id: sub, claims }; // Attach user info to the request
        next();
      } catch (error) {
        throw new UnauthorizedException('Invalid token');
      }
    }
  }