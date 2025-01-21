import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiKey } from 'src/Entities/api.entity';  

@Injectable()
export class ApiKeyService {
    constructor(
        @InjectRepository(ApiKey) // Injecting the repository for api_keys
        private readonly apiKeyRepository: Repository<ApiKey>,  // Repository to handle the api keys
    ) { }


    async validateApiKeyWithRole(apiKey: string, requiredRole: string): Promise<boolean> {
        const apiKeyRecord = await this.apiKeyRepository.findOne({
            where: { key: apiKey, role: requiredRole }, 
        });
    
        return !!apiKeyRecord;  
    }
    
    async findByApiKey(apiKey: string): Promise<ApiKey | null> {
        return await this.apiKeyRepository.findOne({ where: { key: apiKey } });  // Find API key record
    }

    async findResourceByApiKeyAndResourceId(apiKey: string, resourceId: number) {
        const apiKeyRecord = await this.apiKeyRepository.findOne({ where: { key: apiKey } });

        if (!apiKeyRecord) {
            return null;
        }

        const resource = await this.apiKeyRepository.findOne({
            where: { key: apiKey, id: resourceId },  
        });
        return resource;  
    }
}
