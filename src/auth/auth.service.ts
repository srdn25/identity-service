import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthPayloadDto } from './dto/authPayload.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  encryptData(payload: AuthPayloadDto): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
