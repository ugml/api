![N|Solid](https://ugamela.org/images/logo.png)

[![Travis-ci](https://travis-ci.org/ugml/api.svg?branch=master)](https://travis-ci.org/ugml/api)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/d850b7bc3284402583106ac38ec3d995)](https://www.codacy.com/app/mamen/api?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=ugml/api&amp;utm_campaign=Badge_Grade)
[![Codacy Badge](https://api.codacy.com/project/badge/Coverage/d850b7bc3284402583106ac38ec3d995)](https://www.codacy.com/app/mamen/api?utm_source=github.com&utm_medium=referral&utm_content=ugml/api&utm_campaign=Badge_Coverage)
[![Discord Server](https://discordapp.com/api/guilds/339129999082913794/embed.png)](https://discord.gg/YDUHM3k)
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

4.  Run the api

```
npm start
```

5. Or start the server in watch-mode, recompiling and restarting on changes

```
npm run watch
```

# Routes

### Authentication

#### Login

```
/v1/auth/login
```

**Request-Type:** POST

**Parameters:**

| Parameter | Description              | Required |
|-----------|--------------------------|----------|
| email     | The email of the user    |    Yes   |
| password  | The password of the user |    Yes   |

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

### Planets

#### Get a specific planet
```
/v1/planets/{planetID}
```
**Request-Type:** GET

**Parameters:** 

| Parameter   | Description                   | Required |
|-------------|-------------------------------|----------|
| planetID    | The ID of the planet          |    Yes   |


**Returns:** Available information about the planet

**Example:**

```
{
    "status": 200,
    "message": "Success",
    "data": {
        "planetID": 333,
        "ownerID": 76487,
        "name": "Homeplanet",
        "pos_galaxy": 1,
        "pos_system": 16,
        "pos_planet": 11,
        "last_update": 1521056629,
        "planet_type": 1,
        "image": "trockenplanet08",
        "destroyed": 0
    }
}
```

#### Get a specific planet owned by the current player
```
/v1/user/planet/{planetID}
```
**Request-Type:** GET

**Parameters:** 

| Parameter   | Description                   | Required |
|-------------|-------------------------------|----------|
| planetID    | The ID of the planet          |    Yes   |


**Returns:** Available information about the planet

**Example:**

```
{
    "status": 200,
    "message": "Success",
    "data": {
        "planetID": 60881,
        "ownerID": 1,
        "name": "test123",
        "pos_galaxy": 1,
        "pos_system": 4,
        "pos_planet": 3,
        "last_update": 1521057636,
        "planet_type": 1,
        "image": "trockenplanet08",
        "diameter": 11188,
        "fields_current": 0,
        "fields_max": 125,
        .
        .
        .
    }
}
```

#### Get all planets of the current player
```
/v1/user/planetlist
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

#### Set the current planet
```
/v1/user/currentplanet/set
```
**Request-Type:** POST

**Parameters:**

| Parameter   | Description                      | Required |
|-------------|----------------------------------|----------|
| planetID    | The ID of the new current planet |    Yes   |

**Returns:** Success or error

**Example:**
```
{
    "status": 200,
    "message": "Success",
    "data": {}
}
```

#### Destroy a planet
```
/v1/planet/destroy
```
**Request-Type:** POST

**Parameters:**

| Parameter   | Description                      | Required |
|-------------|----------------------------------|----------|
| planetID    | The ID of the new current planet |    Yes   |

**Returns:** Success or error

**Example:**
```
{
    "status": 200,
    "message": "Success",
    "data": {}
}
```

#### Rename a planet
```
/v1/planet/rename
```
**Request-Type:** POST

**Parameters:**

| Parameter   | Description                      | Required |
|-------------|----------------------------------|----------|
| planetID    | The ID of the new current planet |    Yes   |
| name        | The new name for the planet      |    Yes   |

**Returns:** Success or error

**Example:**
```
{
    "status": 200,
    "message": "Success",
    "data": {}
}
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
        "last_time_online": "1548524754",
        "current_planet": 167546850
    }
}
```

#### Get a specific user

```
/v1/users/{userID}
```
**Request-Type:** GET

**Parameters:**

| Parameter | Description              | Required |
|-----------|--------------------------|----------|
| userID    | The ID of the user       |    Yes   |

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

#### Create a new user
```
/v1/users/create
```
**Request-Type:** POST

**Parameters:**

| Parameter   | Description                   | Required |
|-------------|-------------------------------|----------|
| username    | The username for the new user |    Yes   |
| email       | The email for the new user    |    Yes   |
| password    | The password for the new user |    Yes   |

**Returns:** Success or error

**Example:**
```
{
    "status": 200,
    "message": "Success",
    "data": {}
}
```

#### Update an user
```
/v1/users/update
```
**Request-Type:** POST

**Parameters:**

| Parameter   | Description                   | Required |
|-------------|-------------------------------|----------|
| username    | The username for the new user |    No    |
| email       | The email for the new user    |    No    |
| password    | The password for the new user |    No    |

**Returns:** Success or error

**Example:**
```
{
    "status": 200,
    "message": "Success",
    "data": {}
}
```

### Buildings

#### Get all buildings on a planet
```
/v1/buildings/{planetID}
```
**Request-Type:** GET

**Parameters:**

| Parameter | Description              | Required |
|-----------|--------------------------|----------|
| planetID  | The ID of the planet     |    Yes   |

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
/v1/buildings/build
```
**Request-Type:** POST

**Parameters:**

| Parameter | Description              | Required |
|-----------|--------------------------|----------|
| planetID  | The ID of the planet     |    Yes   |
| buildingID| The ID of the building   |    Yes   |


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
            "pos_galaxy": 1,
            "pos_system": 4,
            "pos_planet": 3,
            .
            .
            .
        }
    }
}
```

#### Cancel a build-order on a planet
```
/v1/buildings/cancel
```
**Request-Type:** POST

**Parameters:**

| Parameter | Description              | Required |
|-----------|--------------------------|----------|
| planetID  | The ID of the planet     |    Yes   |
| buildingID| The ID of the building   |    Yes   |


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
            "pos_galaxy": 1,
            "pos_system": 4,
            "pos_planet": 3,
            .
            .
            .
        }
    }
}
```

### Ships

#### Get all ships on a planet
```
/v1/ships/{planetID}
```
**Request-Type:** GET

**Parameters:**

| Parameter | Description              | Required |
|-----------|--------------------------|----------|
| planetID  | The ID of the planet     |    Yes   |

**Returns:** A list of all ships on the given planet.

**Example:**

```
{
    "status": 200,
    "message": "Success",
    "data": {
        "ownerID": 1,
        "planetID": 60881,
        "small_cargo_ship": 0,
        "large_cargo_ship": 0,
        "light_fighter": 0,
        "heavy_fighter": 0,
        "cruiser": 0,
        "battleship": 0,
        "colony_ship": 0,
        "recycler": 0,
        "espionage_probe": 0,
        "bomber": 0,
        "solar_satellite": 0,
        "destroyer": 0,
        "battlecruiser": 0,
        "deathstar": 0
    }
}
```

#### Build ships on a planet
```
/v1/ships/build
```
**Request-Type:** POST

**Parameters:**

| Parameter | Description                                                  | Required |
|-----------|--------------------------------------------------------------|----------|
| planetID  | The ID of the planet                                         |    Yes   |
| buildOrder| A JSON-string with key-value pairs. {unitID: amount, ...}    |    Yes   |


**Returns:** Success or error

**Example:**

```
{
    "status": 200,
    "message": "Success",
    "data": {}
}
```

### Defenses

#### Get all defenses on a planet
```
/v1/defenses/{planetID}
```
**Request-Type:** GET

**Parameters:**

| Parameter | Description              | Required |
|-----------|--------------------------|----------|
| planetID  | The ID of the planet     |    Yes   |

**Returns:** A list of all defenses on the given planet.

**Example:**

```
{
    "status": 200,
    "message": "Success",
    "data": {
        "ownerID": 1,
        "planetID": 60881,
        "rocket_launcher": 0,
        "light_laser": 0,
        "heavy_laser": 0,
        "ion_cannon": 0,
        "gauss_cannon": 0,
        "plasma_turret": 0,
        "small_shield_dome": 0,
        "large_shield_dome": 0,
        "anti_ballistic_missile": 0,
        "interplanetary_missile": 0
    }
}
```

#### Build defenses on a planet
```
/v1/defenses/build
```
**Request-Type:** POST

**Parameters:**

| Parameter | Description                                                  | Required |
|-----------|--------------------------------------------------------------|----------|
| planetID  | The ID of the planet                                         |    Yes   |
| buildOrder| A JSON-string with key-value pairs. {unitID: amount, ...}    |    Yes   |


**Returns:** Success or error

**Example:**

```
{
    "status": 200,
    "message": "Success",
    "data": {}
}
```



### Technologies

#### Get all technologies
```
/v1/techs
```
**Request-Type:** GET

**Parameters:** none

**Returns:** A list of all technologies the player has.

**Example:**

```
{
    "status": 200,
    "message": "Success",
    "data": [
        {
            "userID": 1,
            "espionage_tech": 0,
            "computer_tech": 0,
            "weapon_tech": 0,
            "armour_tech": 0,
            "shielding_tech": 0,
            "energy_tech": 0,
            "hyperspace_tech": 0,
            "combustion_drive_tech": 0,
            "impulse_drive_tech": 0,
            "hyperspace_drive_tech": 0,
            "laser_tech": 0,
            "ion_tech": 0,
            "plasma_tech": 0,
            "intergalactic_research_tech": 0,
            "graviton_tech": 0
        }
    ]
}
```

#### Build a technology
```
/v1/techs/build
```
**Request-Type:** POST

**Parameters:**

| Parameter | Description              | Required |
|-----------|--------------------------|----------|
| planetID  | The ID of the planet     |    Yes   |
| techID    | The ID of the technology |    Yes   |

**Returns:** Success or error

**Example:**

```
{
    "status": 200,
    "message": "Success",
    "data": {}
}
```

#### Cancel a technology
```
/v1/techs/cancel
```
**Request-Type:** POST

**Parameters:**

| Parameter | Description              | Required |
|-----------|--------------------------|----------|
| planetID  | The ID of the planet     |    Yes   |


**Returns:** Success or error

**Example:**

```
{
    "status": 200,
    "message": "Success",
    "data": {}
}
```

### Galaxy

#### Get information for a given galaxy and system
```
/v1/galaxy/{pos_galaxy}/{pos_system}
```
**Request-Type:** GET

**Parameters:**

| Parameter | Description              | Required |
|-----------|--------------------------|----------|
| pos_galaxy    | The galaxy-position      |    Yes   |
| pos_system    | The system-position      |    Yes   |

**Returns:** Information about the galaxy

**Example:**

```
{
    "status": 200,
    "message": "Success",
    "data": {
        "0": {
            "planetID": 1476777762,
            "ownerID": 751782555,
            "username": "Testuser",
            "name": "Homeplanet",
            "pos_galaxy": 4,
            "pos_system": 88,
            "pos_planet": 6,
            "last_update": 1558452853,
            "planet_type": 1,
            "image": "normal3.png",
            "debris_metal": 0,
            "debris_crystal": 0,
            "destroyed": 0
        },
        "1": {
            .
            .
            .
        },
        .
        .
        .
    }
}
```

### Messages

#### Get all messages
```
/v1/messages/get
```
**Request-Type:** GET

**Parameters:** none

**Returns:** A list of all messages sent to the current user

**Example:**

```
{
    "status": 200,
    "message": "Success",
    "data": {
        "0": {
            "messageID": 6,
            "senderID": 1,
            "receiverID": 1,
            "sendtime": 1558030571,
            "type": 1,
            "subject": "test1",
            "body": "test1"
        },
        "1": {
            "messageID": 5,
            "senderID": 1,
            "receiverID": 1,
            "sendtime": 1558030570,
            "type": 1,
            "subject": "test2",
            "body": "test2"
        }
    }
}
```

#### Get a specific message
```
/v1/messages/get/{messageID}
```
**Request-Type:** GET

**Parameters:** 

| Parameter | Description              | Required |
|-----------|--------------------------|----------|
| messageID | The ID of the message    |    Yes   |

**Returns:** The message

**Example:**

```
{
    "status": 200,
    "message": "Success",
    "data": {
        "messageID": 5,
        "senderID": 1,
        "receiverID": 1,
        "sendtime": 1558030570,
        "type": 1,
        "subject": "test",
        "body": "test"
    }
}
```

#### Send a message
```
/v1/messages/send
```
**Request-Type:** POST

**Parameters:** 

| Parameter  | Description                | Required |
|------------|----------------------------|----------|
| receiverID | The ID of the receiver     |    Yes   |
| subject    | The subject of the message |    Yes   |
| body       | The body of the message    |    Yes   |

**Returns:** Success or error

**Example:**

```
{
    "status": 200,
    "message": "Success",
    "data": {}
}
```

#### Delete a message
```
/v1/messages/delete
```
**Request-Type:** POST

**Parameters:** 

| Parameter | Description              | Required |
|-----------|--------------------------|----------|
| messageID | The ID of the message    |    Yes   |

**Returns:** Success or error

**Example:**

```
{
    "status": 200,
    "message": "Success",
    "data": {}
}
```

### Events

#### Send fleet
```
/v1/events/create/
```
**Request-Type:** POST

**Parameters:** 

| Parameter  | Description                     | Required |
|------------|---------------------------------|----------|
| event      | The event-data as a JSON object |    Yes   |

**Schema:** https://api.ugamela.org/fleetevent.schema.json

**Returns:** The data of the created event

**Example:**

```
{
    "status": 200,
    "message": "Event successfully created.",
    "data": {
        "eventID": 15,
        "ownerID": 1,
        "mission": "attack",
        "speed": 30,
        "data": {
            "origin": {
                "pos_galaxy": 1,
                "pos_system": 4,
                "pos_planet": 3,
                "type": "planet"
            },
            "destination": {
                "pos_galaxy": 9,
                "pos_system": 84,
                "pos_planet": 14,
                "type": "planet"
            },
            "ships": {
                "201": 612,
                "202": 357,
                "203": 617,
                "204": 800,
                "205": 709,
                "206": 204,
                "207": 703,
                "208": 85,
                "209": 631,
                "210": 388,
                "211": 0,
                "212": 723,
                "213": 557,
                "214": 106
            },
            "loadedRessources": {
                "metal": 443,
                "crystal": 980,
                "deuterium": 220
            }
        },
        "starttime": 1558456480,
        "endtime": 1558470153
    }
}
```

#### Call back fleet
```
/v1/events/cancel/
```
**Request-Type:** POST

**Parameters:** 

| Parameter  | Description                     | Required |
|------------|---------------------------------|----------|
| eventID    | The ID of the event             |    Yes   |

**Returns:** Success or error

**Example:**

```
{
    "status": 200,
    "message": "Success",
    "data": {}
}
```

#### Get all events on a planet
```
/v1/planets/movement/{planetID}
```
**Request-Type:** GET

**Parameters:** 

| Parameter  | Description                | Required |
|------------|----------------------------|----------|
| planetID   | The ID of the planet       |    Yes   |

**Returns:** A list of events happening on the given planet

**Example:**

```
{
    "status": 200,
    "message": "Success",
    "data": {
        "0": {
            "eventID": 1,
            "ownerID": 1,
            "mission": 2,
            "fleetlist": "{\"201\":612,\"202\":357,\"203\":617,\"204\":800,\"205\":709,\"206\":204,\"207\":703,\"208\":85,\"209\":631,\"210\":388,\"211\":0,\"212\":723,\"213\":557,\"214\":106}",
            "start_id": 60881,
            "start_type": 1,
            "start_time": 1558449681,
            "end_id": 18341,
            "end_type": 1,
            "end_time": 1558450681,
            "loaded_metal": 443,
            "loaded_crystal": 980,
            "loaded_deuterium": 220,
            "returning": 0
        },
        .
        .
        .
    }
}
```

# Support / Questions

For any further questions, support or general talk, please visit our Discord by clicking on the image below or follow the link.

[![N|Solid](https://t5.rbxcdn.com/18108a5641ff1becc8dfa20aed634d1f)](https://discord.gg/YDUHM3k)

https://discord.gg/YDUHM3k
