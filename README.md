# Team.Up - backend, v.1.0.0

## Description

Ever wanted to find a team to play some football or find a partner to go to gym? Team.Up allows you to do so! Create your own sport event or join existing one and keep up your healthy lifestyle!

Team.Up backend application is created in Express.js and uses MongoDB. It is built on top of three-layer architecture.

### Frontend URL

Frontend is available here: https://github.com/hejs22/team.up-ui

## Built with

Express.js, Node.js, TypeScript, MongoDB. For tests I have used Jest with Supertest.

## Features

### What can user do?

- create account, sign in and sign out ✅
- authenticate with usage of JWT ✅
- refresh set of auth tokens ✅
- access own details ✅
- access list of sport disciplines ✅
- access list of sport events ✅
- create own sport events ✅
- modify or delete sport events created by that user ✅
- enroll for any sport event ⌛
- remove enrollment ⌛

### What can admin do?

- everything user can do ✅
- access list of users' details ✅
- change other users' roles ✅
- remove users accounts ⌛
- add, modify or delete sport disciplines ✅
- modify or delete sport events created by anyone ✅

### Additional implemented things

- Migrations system ✅
- Integration tests based on use cases ✅
- High code coverage of each use case ✅
- Configuration via envs ✅
- OpenAPI ✅
- Logger ✅
- Tests environment ✅

## Coverage

![coverage.png](media/coverage.png)

## OpenApi

https://app.swaggerhub.com/apis/HCYWKA/TeamUp/1.0.0

## Configuration

`PORT` - port on which server should listen

`ADMIN_PASSWORD` - password for default admin account

`ADMIN_EMAIL` - admin for default admin account

`FRONTEND_URL` - Frontend URLs, can list multiple, eg. http://localhost:3000,https://site.com,https://domain.com

`MONGO_USER` - MongoDB user for production environment

`MONGO_PASSWORD` - MongoDB user's password for production environment

`MONGO_PATH` - MongoDB path for production environment

`MONGO_TEST_USER` - MongoDB user for test environment

`MONGO_TEST_PASSWORD` - MongoDB user's password for test environment

`MONGO_TEST_PATH` - MongoDB path for test environment

`JWT_EXPIRATION_TIME` - JWT expiration time in seconds

`REFRESH_TOKEN_EXPIRATION_TIME` - Refresh token expiration time in seconds

`JWT_SECRET` - JWT secret

`REFRESH_TOKEN_SECRET` - Refresh token secret

`RATE_LIMIT_TIMESPAN` - Request rate limit timespan in ms

`RATE_LIMIT` - Request rate limit
