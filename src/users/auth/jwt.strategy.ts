// // auth/jwt.strategy.ts
// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy, ExtractJwt } from 'passport-jwt';
// import { JwtPayload } from '../types/jwt-payload.interface';


// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(private authService: AuthService) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract token from Authorization header
//       secretOrKey: 'your-jwt-secret-key', // Use a secret key for signing JWTs
//     });
//   }

//   async validate(payload: JwtPayload) {
//     // The validate method will be called after the JWT is verified
//     // Here you can add logic to fetch user from DB or just return the user data
//     return { userId: payload.sub, username: payload.username }; // Adjust the returned object according to your needs
//   }
// }
