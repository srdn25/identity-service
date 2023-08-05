import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthStaticTokenGuard } from './authStaticToken.guard';
import { IUserProfile } from '../provider/providers/google/userProfile.interface';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { messages, swaggerMessages } from '../consts';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthStaticTokenGuard)
  @ApiOperation({
    summary: swaggerMessages.requests.auth.authenticate.name,
    parameters: [
      {
        name: 'userId',
        in: 'path',
      },
    ],
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: swaggerMessages.requests.auth.authenticate.description,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: messages.CUSTOMER_HAS_NOT_ACTIVE_PROVIDER,
  })
  @Get('/authenticate/user/:userId')
  async auth(
    @Response() response,
    @Request() request,
    @Param('userId') userId: number,
  ): Promise<IUserProfile> {
    const result = await this.authService.authenticateUser(
      request.customer?.customerId,
      userId,
    );

    return response.status(HttpStatus.OK).json(result);
  }
}
