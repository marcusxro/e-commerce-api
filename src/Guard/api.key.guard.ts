import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ApiKeyService } from 'src/Service/api.key.service';  // Import ApiKeyService
import { API_KEY_ROLE } from 'src/Decorators/api.key.role';  // Import role metadata key
import { Reflector } from '@nestjs/core';

@Injectable()
export class ApiKeyGuard implements CanActivate {
    constructor(
        private readonly apiKeyService: ApiKeyService,  
        private readonly reflector: Reflector,  
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const apiKey = request.headers['x-api-key'];  // Get the API key from the request header

        if (!apiKey) {
            throw new UnauthorizedException('API key is missing');
        }

        // Retrieve the required role from metadata, default to 'client'
        const requiredRole = this.reflector.get<string>(API_KEY_ROLE, context.getHandler()) || 'client';

        console.log('Required Role:', requiredRole);  
        console.log('API Key:', apiKey); 


        const apiKeyRecord = await this.apiKeyService.findByApiKey(apiKey);

        if (!apiKeyRecord) {
            throw new UnauthorizedException('Invalid API key');
        }

        if (requiredRole === 'admin' && apiKeyRecord.role !== 'admin') {
            throw new UnauthorizedException('Admin access required');
        }

        if (requiredRole === 'client' && apiKeyRecord.role !== 'client') {
            console.log('Admin unrestricted access');
        }

        return true;

    }

}
