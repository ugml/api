![N|Solid](https://mamen.at/ugamela/images/logo.png)

[![Discord Server](https://discordapp.com/api/guilds/339129999082913794/embed.png)](https://discord.gg/YDUHM3k)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](./LICENSE)

# ugamela API

This repository contains the official API which can be usedto create a client for the browsergame ugamela.
The official API can be found at https://api.ugamela.org/v1/

# Disclaimer

This open-source project is still in an alpha-state, **please do not use this in an production-environment**. Currently, not many features are available and this game is not fully playable. Feel free to contribute by making a pull-request.

# Quick Start

1. Clone the repository

2. Install gulp and all required packages (if not already installed)

```
npm install gulp
npm install
```

3. Run the predefined gulp-task to compile all typescript files

```
gulp scripts
```

4.  Run the api

```
npm start
```

# Routes

### Authentication

#### Login

```
/v1/auth/login
```

**Request-Type:** POST

**Parameters:**

| Parameter | Description              |
|-----------|--------------------------|
| email     | The email of the user    |
| password  | The password of the user |

**Returns:** a JWT-Token for authentications.

**Example:**
```
{
    "status": 200,
    "message": "Success",
    "data": {
        "token": "JWT-TOKEN"
    }
}
```


### Buildings

#### Get all buildings on a planet
```
/v1/buildings/:planetID
```
**Request-Type:** GET

**Parameters:**

| Parameter | Description              |
|-----------|--------------------------|
| planetID  | The ID of the planet     |

**Returns:** A list of all buildings on the given planet.

**Example:**

```
{
    "status": 200,
    "message": "Success",
    "data": {
        "ownerID": 1,
        "planetID": 60881,
        "metal_mine": 1,
        "crystal_mine": 1,
        "deuterium_synthesizer": 4,
        "solar_plant": 1,
        "fusion_reactor": 0,
        "robotic_factory": 3,
        "nanite_factory": 0,
        "shipyard": 8,
        "metal_storage": 2,
        "crystal_storage": 3,
        "deuterium_storage": 2,
        "research_lab": 1,
        "terraformer": 0,
        "alliance_depot": 0,
        "missile_silo": 0
    }
}
```


#### Build a specific buildings on a planet
```
/v1/build/:planetID/:buildingID
```
**Request-Type:** GET

**Parameters:**

| Parameter | Description              |
|-----------|--------------------------|
| planetID  | The ID of the planet     |
| buildingID| The ID of the building   |


**Returns:** The updated planet.

**Example:**

```
{
    "status": 200,
    "message": "Job started",
    "data": {
        "planet": {
            "planetID": 60881,
            "ownerID": 1,
            "name": "Sampleplanet",
            "galaxy": 1,
            "system": 4,
            "planet": 3,
            .
            .
            .
        }
    }
}
```

### Configurations

#### Get the current game-configuration

```
/v1/config/game
```
**Request-Type:** GET

**Parameters:** none

**Returns:** The current game-config

**Example:**

```
{
    "speed": 1,
    "metal_start": 500,
    "crystal_start": 500,
    "deuterium_start": 500,
    "startplanet_name": "Homeplanet",
    "startplanet_diameter": 150000,
    "startplanet_maxfields": 138,
    "pos_galaxy_max": 9,
    "pos_system_max": 100,
    "pos_planet_max": 15
}
```

#### Get the current unit-configuration

```
/v1/config/units
```

**Request-Type:** GET

**Parameters:** none

**Returns:** The config for all ingame-units

**Example:**

```
{
    "units": {
        "buildings":  { ... },
        "ships":  { ... },
        "defenses":  { ... },
        "technologies":  { ... }
     }
    "requirements":  { ... },
    "mappings": { ... }
}
```


### Defenses
```
/v1/defenses
```

**Request-Type:** GET

### Planets

```
/v1/planets
```

### Ships on a planet

```
/v1/ships
```


### Technologies
```
/v1/techs
```


### Users

#### Get the current user
```
/v1/user
```
**Request-Type:** GET

**Parameters:** none

**Returns:** The current user

**Example:**

```
{
    "status": 200,
    "message": "Success",
    "data": {
        "userID": 1,
        "username": "admin",
        "email": "xxx@xxx.xx",
        "onlinetime": "1548524754",
        "currentplanet": 167546850
    }
}
```

#### Get a specific user

```
/v1/users/:userID
```
**Request-Type:** GET

**Parameters:**

| Parameter | Description              |
|-----------|--------------------------|
| userID    | The ID of the user       |

**Returns:** The current user

**Example:**
```
{
    "status": 200,
    "message": "Success",
    "data": {
        "userID": 1,
        "username": "xxx"
    }
}
```

#### Get all planets of the current player
```
/v1/users/create
```
**Request-Type:** GET

**Parameters:** none

**Returns:** A list of all planets owned by the current player

**Example:**
```
{
    "status": 200,
    "message": "Success",
    "data": [
        {
            "planetID": 60881,
            "ownerID": 1,
            "name": "Homeplanet",
            .
            .
            .
        },
        {
            "planetID": 167546850,
            "ownerID": 1,
            "name": "Planet",
            .
            .
            .
        }
    ]
}
```

#### Create a new user
```
/v1/users/create
```
**Request-Type:** POST

**Parameters:**

| Parameter   | Description                   |
|-------------|-------------------------------|
| username    | The username for the new user |
| email       | The email for the new user    |
| password    | The password for the new user |

**Returns:** The current user

**Example:**
```
{
    "status": 200,
    "message": "Success",
    "data": {}
}
```



# Support / Questions

For any further questions, support or general talk, please visit our Discord by clicking on the image below or follow the link.

[![N|Solid](https://t5.rbxcdn.com/18108a5641ff1becc8dfa20aed634d1f)](https://discord.gg/YDUHM3k)

https://discord.gg/YDUHM3k