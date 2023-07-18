export class CreateUserDto {
  readonly email: string;
  readonly featureFlags?: string;
  readonly token?: string;
}
