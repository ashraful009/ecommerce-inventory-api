import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = 12;

export class securityUtils{
    static async hashPassword(password: string): Promise<string>{
        return await bcrypt.hash(password, SALT_ROUNDS);
    }

    static async comparePassword( plain: string, hashed: string): Promise<boolean>{
       return await bcrypt.compare(plain, hashed); 
    }

    static generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  static generateAccessToken(payload: { id: number; email: string; role: string }): string {
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {
      expiresIn: '15m',
    });
  }
  static generateRefreshToken(payload: { id: number }): string {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: '7d',
    });
  }
  static verifyToken<T>(token: string, secret: string): T {
    return jwt.verify(token, secret) as T;
  }
}