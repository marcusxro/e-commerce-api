import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiKey } from 'src/Entities/api.entity';
import { BcryptHelper } from 'src/utils/bcrypt.helper';

@Injectable()
export class ApiKeyService {
    constructor(
        @InjectRepository(ApiKey) // Injecting the repository for api_keys
        private readonly apiKeyRepository: Repository<ApiKey>,  // Repository to handle the api keys
    ) { }

    /**
 * Validate an API key and role by comparing the hashed key.
 * @param apiKey - The API key from the request
 * @param requiredRole - The required role to validate
 * @returns - True if the API key and role are valid
 */




    async validateApiKeyWithRole(apiKey: string, requiredRole: string): Promise<boolean> {
        const apiKeyRecord = await this.apiKeyRepository.findOne({
          where: { role: requiredRole }, // Find the API key by role
        });
    
        if (!apiKeyRecord) return false;
    
        console.log(BcryptHelper.compare(apiKey, apiKeyRecord.key))
        // Use bcrypt to compare the plain API key with the hashed key in the database
        return BcryptHelper.compare(apiKey, apiKeyRecord.key);
      }

       /**
   * Find an API key record by its hashed key.
   * @param apiKey - The API key to search for
   * @returns - The API key record if found
   */

       async findByApiKey(apiKey: string): Promise<ApiKey | null> {
        const apiKeyRecords = await this.apiKeyRepository.find();
    
        // Iterate through records and compare the hashed key
        for (const record of apiKeyRecords) {
          const isMatch = await BcryptHelper.compare(apiKey, record.key);
          if (isMatch) {
            return record;
          }
        }
        return null;
      }

  /**
   * Find a resource based on an API key and resource ID.
   * @param apiKey - The API key to validate
   * @param resourceId - The resource ID to check
   * @returns - The resource if it belongs to the API key
   */
  async findResourceByApiKeyAndResourceId(apiKey: string, resourceId: number): Promise<ApiKey | null> {
    const apiKeyRecord = await this.findByApiKey(apiKey);

    if (!apiKeyRecord) {
      return null;
    }

    // Example logic: Verify the resource belongs to the client (adjust based on your schema)
    return this.apiKeyRepository.findOne({ where: { id: resourceId, key: apiKeyRecord.key } });
  }
}
