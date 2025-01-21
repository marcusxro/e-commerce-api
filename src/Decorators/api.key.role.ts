import { SetMetadata } from '@nestjs/common';

export const API_KEY_ROLE = 'apiKeyRole';

export const ApiKeyRole = (role: 'client' | 'admin') => SetMetadata(API_KEY_ROLE, role);
