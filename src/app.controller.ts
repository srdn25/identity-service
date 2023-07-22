import { Controller, Get, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { swaggerMessages } from './consts';

@ApiTags(swaggerMessages.tags.info.tag)
@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: swaggerMessages.requests.app.ping.name })
  @ApiResponse({
    status: HttpStatus.OK,
    description: swaggerMessages.requests.app.ping.description,
  })
  @Get('/ping')
  ping(): string {
    return this.appService.ping();
  }
}
