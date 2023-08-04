import {
  Controller,
  Get,
  HttpStatus,
  Logger,
  Response,
  Request,
  Query,
  UseGuards,
  Body,
  Post,
  Put,
  Param,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { swaggerMessages } from '../consts';
import { ProviderService } from './provider.service';
import { AuthLinkResponseDto } from './dto/authLinkResponse.dto';
import { CallbackRequestQueryDto } from './dto/callbackRequestQuery.dto';
import { AuthStaticTokenGuard } from '../auth/authStaticToken.guard';
import { Provider } from './provider.entity';
import { CreateProviderDto } from './dto/create.dto';
import { UpdateProviderDto } from './dto/update.dto';

@ApiTags(swaggerMessages.tags.provider.tag)
@Controller('provider')
export class ProviderController {
  constructor(
    private logger: Logger,
    private providerService: ProviderService,
  ) {}

  @ApiOperation({
    summary: swaggerMessages.requests.provider.callback.name,
    parameters: [
      {
        name: 'provider',
        in: 'path',
        required: true,
        description: swaggerMessages.requests.provider.callback.params.provider,
        example: 'google',
      },
      {
        name: 'code',
        in: 'query',
      },
      {
        name: 'state',
        in: 'query',
      },
      {
        name: 'error',
        in: 'query',
      },
      {
        name: 'error_description',
        in: 'query',
      },
    ],
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: swaggerMessages.requests.provider.callback.description,
  })
  @Get('/callback')
  async callback(
    @Response() response,
    @Query() query: CallbackRequestQueryDto,
  ) {
    const preparedCode = decodeURIComponent(query.code);

    await this.providerService.getUserProviderDataAndSave(
      query.state,
      preparedCode,
    );

    return response.status(HttpStatus.NO_CONTENT);
  }

  @UseGuards(AuthStaticTokenGuard)
  @ApiOperation({
    summary: swaggerMessages.requests.provider.authorization.name,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: swaggerMessages.requests.provider.authorization.description,
  })
  @Get('/authorization')
  async authorization(
    @Response() response,
    @Request() request,
  ): Promise<AuthLinkResponseDto> {
    const link = await this.providerService.prepareAuthorizationRequest(
      request.customer?.customerId,
    );

    return response.status(HttpStatus.OK).json({ link });
  }

  @UseGuards(AuthStaticTokenGuard)
  @ApiOperation({
    summary: swaggerMessages.requests.provider.createProvider.name,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: swaggerMessages.requests.provider.createProvider.description,
  })
  @Post()
  async create(
    @Response() response,
    @Body() body: CreateProviderDto,
    @Request() request,
  ): Promise<Provider> {
    const provider = await this.providerService.create(
      body,
      request.customer?.customerId,
    );

    return response.status(HttpStatus.OK).json(provider);
  }

  @UseGuards(AuthStaticTokenGuard)
  @Put('/:id')
  async update(
    @Response() response,
    @Body() body: UpdateProviderDto,
    @Request() request,
    @Param('id') id: number,
  ): Promise<Provider> {
    const provider = await this.providerService.updateProviderConfig(
      id,
      request.customer.customerId,
      body,
    );

    return response.status(HttpStatus.OK).json(provider);
  }
}
