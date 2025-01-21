import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ApiKeyService } from 'src/Service/api.key.service';  // Import ApiKeyService
import { API_KEY_ROLE } from 'src/Decorators/api.key.role';  // Import role metadata key
import { Reflector } from '@nestjs/core';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly apiKeyService: ApiKeyService,  // Inject ApiKeyService
    private readonly reflector: Reflector,  // To access metadata
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];  // Get the API key from the request header

    if (!apiKey) {
      throw new UnauthorizedException('API key is missing');
    }

    // Retrieve the role from metadata, or default to 'client'
    const requiredRole = this.reflector.get<string>(API_KEY_ROLE, context.getHandler()) || 'client';

    console.log('Required Role:', requiredRole);  // Debugging: Log the required role
    console.log('API Key:', apiKey);  // Debugging: Log the API key

    // Validate the API key and check role
    const isValid = await this.apiKeyService.validateApiKeyWithRole(apiKey, requiredRole);

    if (!isValid) {
      throw new UnauthorizedException('Invalid or missing API key');
    }

    // If the role is 'admin', allow access to all data (admin has unrestricted access)
    if (requiredRole === 'admin') {
      console.log('Admin Access: Unrestricted');
      return true;  // Admin has unrestricted access to everything
    }

    // If the role is 'client', check resource ownership
    if (requiredRole === 'client') {
      const apiKeyRecord = await this.apiKeyService.findByApiKey(apiKey);

      // If apiKey is assigned to client
      if (apiKeyRecord?.role === 'client') {
        const resourceId: number = request.params?.id || request.body?.resourceId; // Get the resource ID from request

        // If no resource ID is provided, we can't proceed
        if (!resourceId) {
          throw new UnauthorizedException('Resource ID is required');
        }

        // Fetch the resource and check if the client is allowed to access it
        const resource = await this.getResourceForClient(apiKeyRecord.key, resourceId);

        if (!resource) {
          throw new UnauthorizedException('Client is not allowed to access this resource');
        }

        return true;  // Allow the client to proceed if everything checks out
      }
    }

    return true;  // If valid API key and role, allow the request
  }

  private async getResourceForClient(apiKey: string, resourceId: number) {
    // Fetch resource for client using apiKey and resourceId
    const resource = await this.apiKeyService.findResourceByApiKeyAndResourceId(apiKey, resourceId);
    return resource;  // Return the resource if it matches, otherwise null
  }
}
