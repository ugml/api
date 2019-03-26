import {Validator} from "../common/ValidationTools";



class BaseRouter {

    private JSONValidator = require('jsonschema').Validator;

    public jsonValidator = new this.JSONValidator();
    public inputValidator = new Validator();
    public squel = require("squel");
}

export { BaseRouter }