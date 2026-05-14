import { Injectable } from '@nestjs/common';
import { HashPasswordProvider } from './hash-password.provider';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptProvider implements HashPasswordProvider {
  public async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }

  public async comparePassword(password: string, hashed: string): Promise<boolean> {
    return await bcrypt.compare(password, hashed);
  }
}