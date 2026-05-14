import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import crypto from 'crypto';

@Injectable()
export class HashTokenProvider {
  constructor(
    // Inject ConfigService
    private readonly configService: ConfigService
  ) {}

  public hashToken(token: string): Promise<string> {
    return new Promise((resolve, reject) => {
      crypto.pbkdf2(
        token,
        this.configService.get('jwt.hashTokenSalt') as string,
        100000,
        32,
        'sha-256',
        (err, derivedKey) => {
          if (err)
            return reject(err);
          resolve(derivedKey.toString('hex'));
        }
      );
    });
  }
}