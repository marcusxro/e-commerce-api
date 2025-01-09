import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class IsOwnerGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authenticatedUser = request.user; 

    const { userid } = request.params;  

    if (authenticatedUser.id !== userid) {
      throw new UnauthorizedException('You can only access your own data.');
    }

    return true;  // User is authorized
  }
}
