import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiKey } from 'src/Entities/api.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ApiKeyCreationService {
  constructor(
    @InjectRepository(ApiKey) // Inject the repository for the `api_keys` table
    private readonly apiKeyRepository: Repository<ApiKey>,
  ) {}

  /**
   * Create and save a hashed API key in the database.
   * @param plainApiKey - The plain-text API key
   * @param role - The role associated with the API key (e.g., 'client', 'admin')
   */
  async createAndSaveApiKey(plainApiKey: string, role: string): Promise<void> {
    // Hash the API key using bcrypt
    const hashedApiKey = await bcrypt.hash(plainApiKey, 10); // 10 is the salt rounds

    // Save the hashed API key and role into the database
    await this.apiKeyRepository.save({
      key: hashedApiKey,
      role: role,
    });

    console.log('API key created and saved to the database');
  }
}
