import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ApiKeyService } from 'src/Service/api.key.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly apiKeyService: ApiKeyService) {} 

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key']; // Get the API key from the request header

    // Use the ApiKeyService to validate the API key
    const isValid = await this.apiKeyService.validateApiKey(apiKey);

    if (!apiKey || !isValid) {
      throw new UnauthorizedException('Invalid or missing API key');
    }
    return true;
  }
}
