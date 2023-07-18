# Identity service


## Description

Identity service for users. Storage user data

User has:
- email
- token - temporary or permanent token (like from external providers Google, Okta, Azure)
- featureFlags - string with feature flags or permissions (handling on customer service side)

## Installation

```bash
$ npm install

$ cp .env.example .env

update credentials
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Development

```bash
# Generate new module
$ nest generate module <module name>

# Generate new controller
$ nest generate controller <controller name>

# Generate new service
$ nest generate service <service name>
```

## License

[GNU licensed](LICENSE).
