import { Injectable } from '@nestjs/common';

@Injectable()
export class ApiKeyService {
  private validApiKeys: string[] = ['Eqasds-1241-asgg', 'key2', 'key3']; // Could be from DB

  async validateApiKey(apiKey: string): Promise<boolean> {
    return this.validApiKeys.includes(apiKey);
  }
}
