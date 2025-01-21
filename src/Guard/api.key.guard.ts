import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ApiKeyService } from 'src/Service/api.key.service';  // Import ApiKeyService
import { API_KEY_ROLE } from 'src/Decorators/api.key.role';  // Import role metadata key
import { Reflector } from '@nestjs/core';

@Injectable()
export class ApiKeyGuard implements CanActivate {
    constructor(
        private readonly apiKeyService: ApiKeyService,  // Inject ApiKeyService
        private readonly reflector: Reflector,  // To access metadata
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const apiKey = request.headers['x-api-key'];  // Get the API key from the request header

        if (!apiKey) {
            throw new UnauthorizedException('API key is missing');
        }

        // Retrieve the required role from metadata, default to 'client'
        const requiredRole = this.reflector.get<string>(API_KEY_ROLE, context.getHandler()) || 'client';

        console.log('Required Role:', requiredRole);  // Log the required role
        console.log('API Key:', apiKey);  // Log the API key

        // Step 1: Check if the API key exists in the database
        const apiKeyRecord = await this.apiKeyService.findByApiKey(apiKey);

        if (!apiKeyRecord) {
            throw new UnauthorizedException('Invalid API key');
        }

        // Step 2: Validate based on required role
        if (requiredRole === 'admin' && apiKeyRecord.role !== 'admin') {
            throw new UnauthorizedException('Admin access required');
        }

        if (requiredRole === 'client' && apiKeyRecord.role !== 'client') {
            console.log('Admin unrestricted access');
        }

        // Admin has unrestricted access to all data
        return true;

    }

    private async getResourceForClient(apiKey: string, resourceId: number) {
        // Example logic for fetching the resource associated with apiKey
        const resource = await this.apiKeyService.findResourceByApiKeyAndResourceId(apiKey, resourceId);
        return resource;  // Return the resource if it matches, otherwise null
    }
}
