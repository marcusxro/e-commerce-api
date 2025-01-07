import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>E-COMMERCE SERVER</title>
        </head>
        <body>
          <h1>YOU ARE CONNECTED TO SERVER</h1>
          <p>Welcome to NestJS!</p>
        </body>
      </html>
    `;
  }
  
}
