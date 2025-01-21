import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiKey } from 'src/Entities/api.entity';  // Your ApiKey entity

@Injectable()
export class ApiKeyService {
  constructor(
    @InjectRepository(ApiKey) // Injecting the repository for api_keys
    private readonly apiKeyRepository: Repository<ApiKey>,  // Repository to handle the api keys
  ) {}

  // Validate API Key and Role from DB
  async validateApiKeyWithRole(apiKey: string, requiredRole: string): Promise<boolean> {
    const apiKeyRecord = await this.apiKeyRepository.findOne({
      where: { key: apiKey, role: requiredRole },  // Check if the apiKey exists with the required role
    });

    return !!apiKeyRecord;  // Return true if a valid record is found, false otherwise
  }

  // Find the API key record by key (used to verify key)
  async findByApiKey(apiKey: string): Promise<ApiKey | null> {
    return await this.apiKeyRepository.findOne({ where: { key: apiKey } });  // Find API key record
  }

  // Fetch resource based on API Key and ResourceId (e.g., itemId)
  async findResourceByApiKeyAndResourceId(apiKey: string, resourceId: number) {
    // Example: Check if the resource belongs to the client via apiKey
    const apiKeyRecord = await this.apiKeyRepository.findOne({ where: { key: apiKey } });

    if (!apiKeyRecord) {
      return null;
    }

    // Here, you'd typically query another repository for the resource, but we'll assume
    // it's the same as apiKey here for simplicity (e.g., checking ownership of items).
    // Example check for ownership:
    const resource = await this.apiKeyRepository.findOne({
      where: { key: apiKey, id: resourceId },  // Check if resource belongs to the client via apiKey
    });

    return resource;  // Return the resource if it matches, otherwise null
  }
}
