import { Database } from '../common/Database';
import {IUnits} from "../interfaces/IUnits";
const squel = require("squel");
const Logger = require('../common/Logger');


class User implements IUnits {

    userID : number;
    username : string;
    password : string;
    email : string;
    onlinetime : number;
    currentplanet : number;


    public save() : Promise<{}> {
        return new Promise((resolve, reject) => {

            let query = squel.update()
                .table("users")
                .set("username", this.username)
                .set("password", this.password)
                .set("email", this.email)
                .set("onlinetime", this.onlinetime)
                .set("currentplanet", this.currentplanet)
                .where("userID = ?", this.userID)
                .toString();

            Database.query(query).then(() => {
                return resolve(this);
            }).catch(error => {
                Logger.error(error);
                return reject(error);
            });

        });
    }

    public create() : Promise<{}> {
        return new Promise((resolve, reject) => {

            let query = squel.insert()
                .table("users")
                .set("userID", this.userID)
                .set("username", this.username)
                .set("password", this.password)
                .set("email", this.email)
                .set("onlinetime", this.onlinetime)
                .set("currentplanet", this.currentplanet)
                .toString();

            Database.query(query).then(() => {
                return resolve(this);
            }).catch(error => {
                Logger.error(error);
                return reject(error);
            });

        });
    }

    isValid() : boolean {
        return false;
    }

}

export { User }