import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class HashPasswordProvider {
  abstract hashPassword(password: string): Promise<string>;

  abstract comparePassword(password: string, hashed: string): Promise<boolean>;
}