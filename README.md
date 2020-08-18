![N|Solid](https://ugamela.org/images/logo.png)

[![Travis (.org)](https://img.shields.io/travis/ugml/api)](https://travis-ci.org/ugml/api)
[![Sonarcloud Status](https://sonarcloud.io/api/project_badges/measure?project=ugamela-api&metric=alert_status)](https://sonarcloud.io/dashboard?id=ugamela-api) 
[![SonarCloud Coverage](https://sonarcloud.io/api/project_badges/measure?project=ugamela-api&metric=coverage)](https://sonarcloud.io/component_measures/metric/coverage/list?id=ugamela-api)
[![SonarCloud Bugs](https://sonarcloud.io/api/project_badges/measure?project=ugamela-api&metric=bugs)](https://sonarcloud.io/component_measures/metric/reliability_rating/list?id=ugamela-api)
[![SonarCloud Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=ugamela-api&metric=vulnerabilities)](https://sonarcloud.io/component_measures/metric/security_rating/list?id=ugamela-api)
[![Docker Pulls](https://img.shields.io/docker/pulls/ugamela/api)](https://hub.docker.com/r/ugamela/api)
[![Discord](https://img.shields.io/discord/339129999082913794)](https://discord.gg/YDUHM3k)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](./LICENSE)

# ugamela API

This repository contains the official API which can be used to create a client for the browsergame ugamela.
The official API can be found at https://api.ugamela.org/v1/

# Disclaimer

This open-source project is still in an alpha-state, **please do not use this in an production-environment**. Currently, not many features are available and this game is not fully playable. Feel free to contribute by making a pull-request.

# Quick Start

1. Clone the repository

2. Install all required packages

```
npm install
```

3. Run the gulp-task to compile all typescript files and copy assets

```
npm run build
```

4. Create a `.env` file in the root of the folder containing the needed environment-variables.

5.  Run the api

```
npm start
```

Or start the server in watch-mode, recompiling and restarting on changes

```
npm run watch
```

# API specification

The OpenAPI specification can be found by navigating to the swagger-UI (`/v1/swagger`). The specification is defined in `/src/tsoa/swagger.json`.

# Support / Questions

For any further questions, support or general talk, please visit our Discord by clicking on the image below or follow the link.

[![N|Solid](https://t5.rbxcdn.com/18108a5641ff1becc8dfa20aed634d1f)](https://discord.gg/YDUHM3k)

https://discord.gg/YDUHM3k
