import { SetMetadata } from '@nestjs/common';

export const API_KEY_ROLE = 'apiKeyRole';  // Define a key for metadata

export const ApiKeyRole = (role: 'client' | 'admin') => SetMetadata(API_KEY_ROLE, role);
