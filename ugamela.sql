create schema ugamela collate latin1_swedish_ci;

create table errors
(
	id int auto_increment
		primary key,
	class text not null,
	method text not null,
	line text not null,
	exception text not null,
	description text not null,
	time timestamp default current_timestamp() not null on update current_timestamp()
)
engine=MyISAM;

create table users
(
	userID int not null,
	username varchar(20) not null,
	password varchar(60) not null,
	email varchar(64) not null,
	onlinetime varchar(10) not null,
	currentplanet int not null,
	constraint currentplanet_UNIQUE
		unique (currentplanet),
	constraint email_UNIQUE
		unique (email),
	constraint id_UNIQUE
		unique (userID),
	constraint username_UNIQUE
		unique (username)
);

alter table users
	add primary key (userID);

create table flights
(
	flightID int auto_increment
		primary key,
	ownerID int not null,
	mission tinyint(1) not null,
	fleetlist text not null,
	start_id int not null,
	start_type tinyint(1) not null,
	start_time int not null,
	end_id int not null,
	end_type tinyint(1) not null,
	end_time int not null,
	loaded_metal int default 0 not null,
	loaded_crystal int default 0 not null,
	loaded_deuterium int default 0 not null,
	returning tinyint(1) default 0 not null,
	constraint fk_flight_ownerid
		foreign key (ownerID) references users (userID)
			on delete cascade
);

create table messages
(
	messageID int auto_increment,
	senderID int not null,
	receiverID int not null,
	sendtime int null,
	type tinyint(1) not null,
	subject varchar(45) not null,
	body text not null,
	deleted tinyint(1) default 0 null,
	constraint messageID_UNIQUE
		unique (messageID),
	constraint fk_messages_users1
		foreign key (senderID) references users (userID),
	constraint fk_messages_users2
		foreign key (receiverID) references users (userID)
);

create index fk_messages_users1_idx
	on messages (senderID);

create index fk_messages_users2_idx
	on messages (receiverID);

alter table messages
	add primary key (messageID);

create table planets
(
	planetID int not null
		primary key,
	ownerID int not null,
	name varchar(45) null,
	galaxy int not null,
	`system` int not null,
	planet int not null,
	last_update int null,
	planet_type int(1) not null,
	image char(32) not null,
	diameter int not null,
	fields_current int(3) default 0 not null,
	fields_max int(3) not null,
	temp_min int(3) not null,
	temp_max int(3) not null,
	metal double(16,6) default 500.000000 not null,
	crystal double(16,6) default 500.000000 not null,
	deuterium double(16,6) default 0.000000 not null,
	energy_used int default 0 not null,
	energy_max int default 0 not null,
	metal_mine_percent int(3) default 100 not null,
	crystal_mine_percent int(3) default 100 not null,
	deuterium_synthesizer_percent int(3) default 100 not null,
	solar_plant_percent int(3) default 100 not null,
	fusion_reactor_percent int(3) default 100 not null,
	solar_satellite_percent int(3) default 100 not null,
	b_building_id int(3) default 0 null,
	b_building_endtime int(10) default 0 null,
	b_tech_id int(3) default 0 null,
	b_tech_endtime int(10) default 0 null,
	b_hangar_id text null,
	b_hangar_start_time int default 0 not null,
	b_hangar_plus tinyint(1) default 0 not null,
	destroyed tinyint(1) default 0 not null,
	constraint fk_planet_ownerid
		foreign key (ownerID) references users (userID)
			on delete cascade
);

create table buildings
(
	planetID int not null,
	metal_mine int default 0 not null,
	crystal_mine int default 0 not null,
	deuterium_synthesizer int default 0 not null,
	solar_plant int default 0 not null,
	fusion_reactor int default 0 not null,
	robotic_factory int default 0 not null,
	nanite_factory int default 0 not null,
	shipyard int default 0 not null,
	metal_storage int default 0 not null,
	crystal_storage int default 0 not null,
	deuterium_storage int default 0 not null,
	research_lab int default 0 not null,
	terraformer int default 0 not null,
	alliance_depot int default 0 not null,
	missile_silo int default 0 not null,
	constraint planetid_UNIQUE
		unique (planetID),
	constraint fk_building_planetid
		foreign key (planetID) references planets (planetID)
			on delete cascade
);

create table defenses
(
	planetID int not null,
	rocket_launcher int default 0 not null,
	light_laser int default 0 not null,
	heavy_laser int default 0 not null,
	ion_cannon int default 0 not null,
	gauss_cannon int default 0 not null,
	plasma_turret int default 0 not null,
	small_shield_dome int default 0 not null,
	large_shield_dome int default 0 not null,
	anti_ballistic_missile int default 0 not null,
	interplanetary_missile int default 0 not null,
	constraint planetid_UNIQUE
		unique (planetID),
	constraint fk_defense_planetid
		foreign key (planetID) references planets (planetID)
			on delete cascade
);

create table fleet
(
	planetID int not null,
	small_cargo_ship int default 0 not null,
	large_cargo_ship int default 0 not null,
	light_fighter int default 0 not null,
	heavy_fighter int default 0 not null,
	cruiser int default 0 not null,
	battleship int default 0 not null,
	colony_ship int default 0 not null,
	recycler int default 0 not null,
	espionage_probe int default 0 not null,
	bomber int default 0 not null,
	solar_satellite int default 0 not null,
	destroyer int default 0 not null,
	battlecruiser int default 0 not null,
	deathstar int default 0 not null,
	constraint planetid_UNIQUE
		unique (planetID),
	constraint fk_fleet_planetid
		foreign key (planetID) references planets (planetID)
			on delete cascade
);

create table galaxy
(
	planetID int null,
	pos_galaxy int null,
	pos_system int null,
	pos_planet int not null,
	debris_metal int default 0 not null,
	debris_crystal int default 0 not null,
	constraint galaxy_planets_planetID_fk
		foreign key (planetID) references planets (planetID)
			on delete set null
);

create index galaxy_pos_galaxy_pos_system_pos_planet_index
	on galaxy (pos_galaxy, pos_system, pos_planet);

create table stats
(
	userID int not null,
	points bigint(11) default 0 not null,
	old_rank tinyint default 0 not null,
	`rank` tinyint default 0 not null,
	constraint userid_UNIQUE
		unique (userID),
	constraint fk_stats_userid
		foreign key (userID) references users (userID)
			on delete cascade
);

create table techs
(
	userID int not null,
	espionage_tech tinyint(2) default 0 not null,
	computer_tech tinyint(2) default 0 not null,
	weapon_tech tinyint(2) default 0 not null,
	armour_tech tinyint(2) default 0 not null,
	shielding_tech tinyint(2) default 0 not null,
	energy_tech tinyint(2) default 0 not null,
	hyperspace_tech tinyint(2) default 0 not null,
	combustion_drive_tech tinyint(2) default 0 not null,
	impulse_drive_tech tinyint(2) default 0 not null,
	hyperspace_drive_tech tinyint(2) default 0 not null,
	laser_tech tinyint(2) default 0 not null,
	ion_tech tinyint(2) default 0 not null,
	plasma_tech tinyint(2) default 0 not null,
	intergalactic_research_tech tinyint(2) default 0 not null,
	graviton_tech tinyint(2) default 0 not null,
	constraint userid_UNIQUE
		unique (userID),
	constraint fk_research_userid
		foreign key (userID) references users (userID)
			on delete cascade
);

create definer = root@`%` procedure getFreePosition(IN maxGalaxy int, IN maxSystem int, IN minPlanet int, IN maxPlanet int)
BEGIN
	DECLARE pos_galaxy INT;
	DECLARE pos_system INT;
	DECLARE pos_planet INT;

	DECLARE taken TINYINT(1) DEFAULT 1;

    WHILE taken > 0 DO
		SET pos_galaxy = ROUND(RAND()*(maxGalaxy-1)+1);
		SET pos_system = ROUND(RAND()*(maxSystem-1)+1);
		SET pos_planet = ROUND(RAND()*(maxPlanet-minPlanet)+minPlanet);

        SET taken = (SELECT 1 FROM ugamela.planets WHERE 'galaxy' = CONCAT('', pos_galaxy) AND 'system' = CONCAT('', pos_system) AND 'planet' = CONCAT('', pos_planet));

        -- if the userID was free
        IF(taken IS NULL) THEN
			SET taken = 0;
        END IF;

	END WHILE;

	SELECT pos_galaxy AS `posGalaxy`, pos_system AS `posSystem`, pos_planet AS `posPlanet`;

END;

create definer = root@`%` procedure getNewPlanetId()
BEGIN
	DECLARE idtaken TINYINT(1) DEFAULT 1;
	DECLARE planet_id INT;

	SET idtaken = 1;
	SET planet_id = 0;

    WHILE idtaken > 0 DO
		SET planet_id = FLOOR(RAND()*(2147483648-200+1)+200);

        SET idtaken = (SELECT 1 FROM ugamela.planets WHERE planetID = planet_id);

        -- if the userID was free
        IF(idtaken IS NULL) THEN
			SET idtaken = 0;
        END IF;

	END WHILE;

	SELECT planet_id AS `planetID`;

END;

create definer = root@`%` procedure getNewUserId()
BEGIN
	DECLARE idtaken TINYINT(1) DEFAULT 1;
	DECLARE usr_userid INT;

	SET idtaken = 1;
	SET usr_userid = 0;

    WHILE idtaken > 0 DO
		SET usr_userid = FLOOR(RAND()*(2147483648-200+1)+200);

        SET idtaken = (SELECT 1 FROM ugamela.users WHERE userID = usr_userid);

        -- if the userID was free
        IF(idtaken IS NULL) THEN
			SET idtaken = 0;
        END IF;

	END WHILE;

	SELECT usr_userid AS `userID`;

END;
