CREATE DATABASE  IF NOT EXISTS `ugamela` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `ugamela`;
-- MySQL dump 10.17  Distrib 10.3.13-MariaDB, for osx10.14 (x86_64)
--
-- Host: 127.0.0.1    Database: ugamela
-- ------------------------------------------------------
-- Server version	10.3.13-MariaDB-1:10.3.13+maria~bionic

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `buildings`
--

DROP TABLE IF EXISTS `buildings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `buildings` (
  `planetID` int(11) NOT NULL,
  `metal_mine` int(11) NOT NULL DEFAULT 0,
  `crystal_mine` int(11) NOT NULL DEFAULT 0,
  `deuterium_synthesizer` int(11) NOT NULL DEFAULT 0,
  `solar_plant` int(11) NOT NULL DEFAULT 0,
  `fusion_reactor` int(11) NOT NULL DEFAULT 0,
  `robotic_factory` int(11) NOT NULL DEFAULT 0,
  `nanite_factory` int(11) NOT NULL DEFAULT 0,
  `shipyard` int(11) NOT NULL DEFAULT 0,
  `metal_storage` int(11) NOT NULL DEFAULT 0,
  `crystal_storage` int(11) NOT NULL DEFAULT 0,
  `deuterium_storage` int(11) NOT NULL DEFAULT 0,
  `research_lab` int(11) NOT NULL DEFAULT 0,
  `terraformer` int(11) NOT NULL DEFAULT 0,
  `alliance_depot` int(11) NOT NULL DEFAULT 0,
  `missile_silo` int(11) NOT NULL DEFAULT 0,
  UNIQUE KEY `planetid_UNIQUE` (`planetID`),
  CONSTRAINT `fk_building_planetid` FOREIGN KEY (`planetID`) REFERENCES `planets` (`planetID`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `defenses`
--

DROP TABLE IF EXISTS `defenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `defenses` (
  `planetID` int(11) NOT NULL,
  `rocket_launcher` int(11) NOT NULL DEFAULT 0,
  `light_laser` int(11) NOT NULL DEFAULT 0,
  `heavy_laser` int(11) NOT NULL DEFAULT 0,
  `ion_cannon` int(11) NOT NULL DEFAULT 0,
  `gauss_cannon` int(11) NOT NULL DEFAULT 0,
  `plasma_turret` int(11) NOT NULL DEFAULT 0,
  `small_shield_dome` int(11) NOT NULL DEFAULT 0,
  `large_shield_dome` int(11) NOT NULL DEFAULT 0,
  `anti_ballistic_missile` int(11) NOT NULL DEFAULT 0,
  `interplanetary_missile` int(11) NOT NULL DEFAULT 0,
  UNIQUE KEY `planetid_UNIQUE` (`planetID`),
  CONSTRAINT `fk_defense_planetid` FOREIGN KEY (`planetID`) REFERENCES `planets` (`planetID`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `errors`
--

DROP TABLE IF EXISTS `errors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `errors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `class` text NOT NULL,
  `method` text NOT NULL,
  `line` text NOT NULL,
  `exception` text NOT NULL,
  `description` text NOT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `fleet`
--

DROP TABLE IF EXISTS `fleet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `fleet` (
  `planetID` int(11) NOT NULL,
  `small_cargo_ship` int(11) NOT NULL DEFAULT 0,
  `large_cargo_ship` int(11) NOT NULL DEFAULT 0,
  `light_fighter` int(11) NOT NULL DEFAULT 0,
  `heavy_fighter` int(11) NOT NULL DEFAULT 0,
  `cruiser` int(11) NOT NULL DEFAULT 0,
  `battleship` int(11) NOT NULL DEFAULT 0,
  `colony_ship` int(11) NOT NULL DEFAULT 0,
  `recycler` int(11) NOT NULL DEFAULT 0,
  `espionage_probe` int(11) NOT NULL DEFAULT 0,
  `bomber` int(11) NOT NULL DEFAULT 0,
  `solar_satellite` int(11) NOT NULL DEFAULT 0,
  `destroyer` int(11) NOT NULL DEFAULT 0,
  `battlecruiser` int(11) NOT NULL DEFAULT 0,
  `deathstar` int(11) NOT NULL DEFAULT 0,
  UNIQUE KEY `planetid_UNIQUE` (`planetID`),
  CONSTRAINT `fk_fleet_planetid` FOREIGN KEY (`planetID`) REFERENCES `planets` (`planetID`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `flights`
--

DROP TABLE IF EXISTS `flights`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `flights` (
  `flightID` int(11) NOT NULL AUTO_INCREMENT,
  `ownerID` int(11) NOT NULL,
  `mission` tinyint(1) NOT NULL,
  `fleetlist` text NOT NULL,
  `start_id` int(11) NOT NULL,
  `start_type` tinyint(1) NOT NULL,
  `start_time` int(11) NOT NULL,
  `end_id` int(11) NOT NULL,
  `end_type` tinyint(1) NOT NULL,
  `end_time` int(11) NOT NULL,
  `loaded_metal` int(11) NOT NULL DEFAULT 0,
  `loaded_crystal` int(11) NOT NULL DEFAULT 0,
  `loaded_deuterium` int(11) NOT NULL DEFAULT 0,
  `returning` tinyint(1) NOT NULL DEFAULT 0,
  `processed` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`flightID`),
  KEY `fk_flight_ownerid` (`ownerID`),
  CONSTRAINT `fk_flight_ownerid` FOREIGN KEY (`ownerID`) REFERENCES `users` (`userID`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `galaxy`
--

DROP TABLE IF EXISTS `galaxy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `galaxy` (
  `planetID` int(11) NOT NULL DEFAULT 0,
  `debris_metal` int(11) NOT NULL DEFAULT 0,
  `debris_crystal` int(11) NOT NULL DEFAULT 0,
  UNIQUE KEY `planetid_UNIQUE` (`planetID`),
  CONSTRAINT `fk_galaxy_planetid` FOREIGN KEY (`planetID`) REFERENCES `planets` (`planetID`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `messages` (
  `messageID` int(11) NOT NULL AUTO_INCREMENT,
  `senderID` int(11) NOT NULL,
  `receiverID` int(11) NOT NULL,
  `sendtime` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `type` tinyint(1) NOT NULL,
  `subject` varchar(45) NOT NULL,
  `body` text NOT NULL,
  PRIMARY KEY (`messageID`),
  UNIQUE KEY `messageID_UNIQUE` (`messageID`),
  KEY `fk_messages_users1_idx` (`senderID`),
  KEY `fk_messages_users2_idx` (`receiverID`),
  CONSTRAINT `fk_messages_users1` FOREIGN KEY (`senderID`) REFERENCES `users` (`userID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_messages_users2` FOREIGN KEY (`receiverID`) REFERENCES `users` (`userID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `planets`
--

DROP TABLE IF EXISTS `planets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `planets` (
  `planetID` int(11) NOT NULL,
  `ownerID` int(11) NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  `galaxy` int(3) NOT NULL,
  `system` int(3) NOT NULL,
  `planet` int(3) NOT NULL,
  `last_update` int(11) DEFAULT NULL,
  `planet_type` int(1) NOT NULL,
  `image` varchar(32) NOT NULL,
  `diameter` int(11) NOT NULL,
  `fields_current` int(3) NOT NULL DEFAULT 0,
  `fields_max` int(3) NOT NULL,
  `temp_min` int(3) NOT NULL,
  `temp_max` int(3) NOT NULL,
  `metal` double(16,6) NOT NULL DEFAULT 500.000000,
  `crystal` double(16,6) NOT NULL DEFAULT 500.000000,
  `deuterium` double(16,6) NOT NULL DEFAULT 0.000000,
  `energy_used` int(11) NOT NULL DEFAULT 0,
  `energy_max` int(11) NOT NULL DEFAULT 0,
  `metal_mine_percent` int(3) NOT NULL DEFAULT 100,
  `crystal_mine_percent` int(3) NOT NULL DEFAULT 100,
  `deuterium_synthesizer_percent` int(3) NOT NULL DEFAULT 100,
  `solar_plant_percent` int(3) NOT NULL DEFAULT 100,
  `fusion_reactor_percent` int(3) NOT NULL DEFAULT 100,
  `solar_satellite_percent` int(3) NOT NULL DEFAULT 100,
  `b_building_id` int(3) DEFAULT NULL,
  `b_building_endtime` int(10) DEFAULT NULL,
  `b_tech_id` int(3) DEFAULT NULL,
  `b_tech_endtime` int(10) DEFAULT NULL,
  `b_hangar_id` text DEFAULT NULL,
  `b_hangar_start_time` int(11) NOT NULL DEFAULT 0,
  `b_hangar_plus` tinyint(1) NOT NULL DEFAULT 0,
  `destroyed` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`planetID`),
  KEY `fk_planet_ownerid` (`ownerID`),
  CONSTRAINT `fk_planet_ownerid` FOREIGN KEY (`ownerID`) REFERENCES `users` (`userID`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `stats`
--

DROP TABLE IF EXISTS `stats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stats` (
  `userID` int(11) NOT NULL,
  `points` bigint(11) NOT NULL DEFAULT 0,
  `old_rank` tinyint(4) NOT NULL DEFAULT 0,
  `rank` tinyint(4) NOT NULL DEFAULT 0,
  UNIQUE KEY `userid_UNIQUE` (`userID`),
  CONSTRAINT `fk_stats_userid` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `techs`
--

DROP TABLE IF EXISTS `techs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `techs` (
  `userID` int(11) NOT NULL,
  `espionage_tech` tinyint(2) NOT NULL DEFAULT 0,
  `computer_tech` tinyint(2) NOT NULL DEFAULT 0,
  `weapon_tech` tinyint(2) NOT NULL DEFAULT 0,
  `armour_tech` tinyint(2) NOT NULL DEFAULT 0,
  `shielding_tech` tinyint(2) NOT NULL DEFAULT 0,
  `energy_tech` tinyint(2) NOT NULL DEFAULT 0,
  `hyperspace_tech` tinyint(2) NOT NULL DEFAULT 0,
  `combustion_drive_tech` tinyint(2) NOT NULL DEFAULT 0,
  `impulse_drive_tech` tinyint(2) NOT NULL DEFAULT 0,
  `hyperspace_drive_tech` tinyint(2) NOT NULL DEFAULT 0,
  `laser_tech` tinyint(2) NOT NULL DEFAULT 0,
  `ion_tech` tinyint(2) NOT NULL DEFAULT 0,
  `plasma_tech` tinyint(2) NOT NULL DEFAULT 0,
  `intergalactic_research_tech` tinyint(2) NOT NULL DEFAULT 0,
  `graviton_tech` tinyint(2) NOT NULL DEFAULT 0,
  UNIQUE KEY `userid_UNIQUE` (`userID`),
  CONSTRAINT `fk_research_userid` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `userID` int(11) NOT NULL,
  `username` varchar(20) NOT NULL,
  `password` varchar(60) NOT NULL,
  `salt` varchar(32) NOT NULL,
  `email` varchar(64) NOT NULL,
  `onlinetime` varchar(10) NOT NULL,
  `currentplanet` int(11) NOT NULL,
  PRIMARY KEY (`userID`),
  UNIQUE KEY `id_UNIQUE` (`userID`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `currentplanet_UNIQUE` (`currentplanet`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping routines for database 'ugamela'
--
/*!50003 DROP PROCEDURE IF EXISTS `createPlanet` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `createPlanet`(
    IN planet_ownerID INT(11),
	IN planet_name VARCHAR(45), 
    IN planet_galaxy INT(3), 
    IN planet_system INT(3),
    IN planet_planet INT(3),
    IN planet_type INT(1),
    IN planet_diameter INT(11),
    IN planet_image VARCHAR(32),
    IN planet_fields_max INT(3),
    IN planet_temp_min INT(3),
    IN planet_temp_max INT(3),
    OUT planet_planetid INT(11)
)
    MODIFIES SQL DATA
BEGIN
	DECLARE planet_planetid INT(11);
    
    CALL `ugamela`.`getNewPlanetId`(planet_planetid);

    INSERT INTO `ugamela`.`planets`
(`planetID`,
`ownerID`,
`name`,
`galaxy`,
`system`,
`planet`,
`last_update`,
`planet_type`,
`image`,
`diameter`,
`fields_current`,
`fields_max`,
`temp_min`,
`temp_max`,
`metal`,
`crystal`,
`deuterium`,
`energy_used`,
`energy_max`,
`metal_mine_percent`,
`crystal_mine_percent`,
`deuterium_synthesizer_percent`,
`solar_plant_percent`,
`fusion_reactor_percent`,
`solar_satellite_percent`,
`b_building_id`,
`b_building_endtime`,
`b_tech_id`,
`b_tech_endtime`,
`b_hangar_id`,
`b_hangar_start_time`,
`b_hangar_plus`,
`destroyed`)
VALUES
(planet_planetid,
planet_ownerID,
planet_name,
planet_galaxy,
planet_system,
planet_planet,
0,
planet_type,
planet_image,
planet_diameter,
0,
planet_fields_max,
planet_temp_min,
planet_temp_max,
500,
500,
500,
0,
0,
100,
100,
100,
100,
100,
100,
0,
0,
0,
0,
0,
0,
0,
0);

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `createUser` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `createUser`(
	IN usr_username VARCHAR(20), 
    IN usr_password VARCHAR(20), 
    IN usr_email VARCHAR(20),
    OUT result INT(11)
)
    MODIFIES SQL DATA
BEGIN
	DECLARE usr_userid INT(11);
    
    SET @usr_userid := 0;
    
    -- check if username already taken
    IF NOT EXISTS (SELECT 1 FROM  `ugamela`.`users` WHERE `username` LIKE usr_username) THEN
			-- check if email already taken
			IF NOT EXISTS (SELECT 1 FROM  `ugamela`.`users` WHERE `email` LIKE usr_email) THEN
				-- CALL `ugamela`.`getNewUserId`(@usr_userid);
                -- TODO: check if a new userID was created
				INSERT INTO `ugamela`.`users` (`userID`, `username`, `password`, `salt`, `email`, `onlinetime`, `currentplanet`) VALUES (9999999,  usr_username, usr_password, "SALT", usr_email, 0, -1);
			ELSE
                -- email already taken
				SET @usr_userid := -2; 
			END IF;
    ELSE
		-- username already taken
		SET @usr_userid := -1; 
    END IF;
	
    SELECT @usr_userid AS `userID` INTO result;
    
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `getNewPlanetId` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `getNewPlanetId`(
	OUT planet_id INT(11)
)
    DETERMINISTIC
BEGIN
	DECLARE idtaken INT(1);

	SET idtaken = 1;
    
    getNextFreePlanetId: WHILE idtaken > 0 DO
		SET planet_id = RAND()* (10^10);
        
        SET idtaken = (SELECT 1 FROM ugamela.planets WHERE planetID = planet_id);
        
        -- if the userID was free
        IF(idtaken IS NULL) THEN
			SET idtaken = 0;
        END IF;
        
	END WHILE getNextFreePlanetId;
    
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `getNewUserId` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `getNewUserId`(
	OUT usr_userId INT(11)
)
    DETERMINISTIC
BEGIN
	DECLARE idtaken INT(1);

	SET idtaken = 1;
    
    getNextFreeUserId: WHILE idtaken > 0 DO
		SET usr_userid = RAND()* (10^10);
        
        SET idtaken = (SELECT 1 FROM ugamela.users WHERE userID = usr_userid);
        
        -- if the userID was free
        IF(idtaken IS NULL) THEN
			SET idtaken = 0;
        END IF;
        
	END WHILE getNextFreeUserId;
    
	SELECT usr_userid as `userID`;
        
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-04-09 13:58:11
