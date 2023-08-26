import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { messages, swaggerMessages } from '../../consts';
import { ProviderService } from './provider.service';
import { AuthLinkResponseDto } from './dto/authLinkResponse.dto';
import { GoogleCallbackQueryDto } from './dto/googleCallbackQueryDto';
import { AuthStaticTokenGuard } from '../../auth/authStaticToken.guard';
import { Provider } from './provider.entity';
import { CreateProviderDto } from './dto/create.dto';
import { UpdateProviderDto } from './dto/update.dto';
import { TelegramCallbackQueryDto } from './dto/telegramCallbackQueryDto';
import { IProviderType } from './common.interface';
import { validateData } from '../../tools/validateData.validation';

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
    status: HttpStatus.NO_CONTENT,
    description: swaggerMessages.requests.provider.callback.description,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: messages.UNSUPPORTED_PROVIDER,
  })
  @Get('/callback/google/:customerId')
  async callbackGoogle(
    @Response() response,
    @Query() query: GoogleCallbackQueryDto,
    @Param('customerId') customerId: number,
  ) {
    const preparedCode = decodeURIComponent(query.code);
    await this.providerService.handleCallbackAndSaveData(
      IProviderType.google,
      query.state,
      customerId,
      preparedCode,
    );

    return response.status(HttpStatus.OK).send('ok');
  }

  @ApiOperation({
    summary: swaggerMessages.requests.provider.callback.name,
    parameters: [
      {
        name: 'tgAuthResult',
        in: 'query',
      },
    ],
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: swaggerMessages.requests.provider.callback.description,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: messages.UNSUPPORTED_PROVIDER,
  })
  @Get('/callback/telegram/:customerId')
  async callbackTelegram(
    @Response() response,
    @Query() query,
    @Param('customerId') customerId: number,
  ) {
    // telegram will redirect to /identity-provider/provider/callback/telegram/1#tgAuthResult=eyJpZCI6Mjk1MzY4Mzg2LCJmaX
    // # tag can handle only on client side
    let validData;
    try {
      validData = validateData(query, TelegramCallbackQueryDto);
    } catch (err) {
      if (Object.keys(query).length) {
        this.logger.debug(
          'Telegram callback query is not valid',
          err.serialize(),
        );
      }
    }

    if (!validData) {
      /**
       * Get window.location.hash and send data to backend (this endpoint)
       */
      return response.status(HttpStatus.OK).render('telegram-oauth.hbs');
    }

    await this.providerService.handleCallbackAndSaveData(
      IProviderType.telegram,
      validData,
      customerId,
    );

    return response.status(HttpStatus.OK).send('ok');
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
      request.customer.id,
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
      request.customer.id,
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
      request.customer.id,
      body,
    );

    return response.status(HttpStatus.OK).json(provider);
  }

  @ApiOperation({
    summary: swaggerMessages.requests.provider.getAvailable.name,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: swaggerMessages.requests.provider.getAvailable.description,
  })
  @Get('/')
  async getAvailableProviders(
    @Response() response,
  ): Promise<AuthLinkResponseDto> {
    const providers = await this.providerService.getSupportedProviders();

    return response.status(HttpStatus.OK).json({ providers });
  }

  @UseGuards(AuthStaticTokenGuard)
  @ApiOperation({
    summary: swaggerMessages.requests.provider.getAvailable.name,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: swaggerMessages.requests.provider.getAvailable.description,
  })
  @Put('/set-active/:id')
  async setActiveProvider(
    @Response() response,
    @Request() request,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<AuthLinkResponseDto> {
    await this.providerService.setActiveProvider(request.customer.id, id);

    return response.status(HttpStatus.OK).send('updated');
  }
}
