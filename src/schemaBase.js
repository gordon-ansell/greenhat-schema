/**
 * @file        Schema base class.
 * @module      Schema/SchemaBase
 * @author      Gordon Ansell   <contact@gordonansell.com> 
 * @copyright   Gordon Ansell, 2020.
 * @license     MIT
 */

'use strict';

const path = require('path');
const str = require("greenhat-util/string");
const YamlFile = require("greenhat-util/yaml");
const GreenHatError = require("greenhat-util/error");
const arr = require("greenhat-util/array");
const syslog = require('greenhat-util/syslog');

class GreenHatSchemaError extends GreenHatError {};

/**
 * Schema base class.
 */
class SchemaBase
{
    /**
     * ID specifications object.
     * @type    {object}
     * @static
     */
    static idSpec = {
        prefix: path.sep + "#",
        slugify: true,
        slugifyOpts: {replacement: '-', lower: true, strict: true},
    }

    /**
     * Schema specifications.
     * @type    {object}
     * @static
     */
    static allSpecs = null;

    /**
     * Properties.
     * @type    {object}
     */
    _props = {};

    /**
     * Specs for this class.
     * @type    {object}
     */
    _specs = {};

    /**
     * Type of class.
     * @type    {string}
     */
    _type = null;

    /**
     * Sanitize an ID.
     * 
     * @param   {string}    raw     Raw ID.
     * @return  {string}            Sanitized ID. 
     */
    static sanitizeId(raw)
    {
        if (SchemaBase.idSpec.slugify) {
            let opts = (SchemaBase.idSpec.slugifyOpts) 
                ? SchemaBase.idSpec.slugifyOpts 
                : {replacement: '-', lower: true, strict: true};
            raw = str.slugify(raw, opts);
        }
        if (SchemaBase.idSpec.prefix) {
            raw = SchemaBase.idSpec.prefix + raw;
        }
        return raw;
    }

    /**
     * Create an ID.
     * 
     * @param   {string}    raw     Raw ID.
     * @return  {string}            Prefixed ID. 
     */
    static makeId(raw)
    {
        return SchemaBase.sanitizeId(raw);
    }

    /**
     * Create an ID reference.
     * 
     * @param   {string}    raw     Raw ID.
     * @return  {string}            ID reference.
     */
    static ref(raw)
    {
        return {'@id': SchemaBase.sanitizeId(raw)};
    }

    /**
     * Get the specifications.
     * 
     * @return  {object}            Schema specifications.
     */
    static getSpecs()
    {
        if (SchemaBase.allSpecs == null) {
            let fn = path.join(path.dirname(path.dirname(__filename)), 'data', 'spec.yaml');
            let yamlFile = new YamlFile(fn);
            SchemaBase.allSpecs = yamlFile.parse();

        }
        return SchemaBase.allSpecs;
    }

    /**
     * Get the specs for a class.
     * 
     * @param   {string}    cls     Class to get specs for.
     * @return  {object}            Specs.
     * 
     * @throws  {GreenHatSchemaError}   If they're not found.
     */
    static getSpecsForClass(cls)
    {
        let classSpecs = this.getSpecs().classes;
        if (!cls in classSpecs) {
            throw new GreenHatSchemaError(`No schema class definition specs found for '${cls}'.`)
        }

        return classSpecs[cls];
    }

    /**
     * Constructor.
     * 
     * @param   {string}    id      ID value.
     */
    constructor(id)
    {
        if (id) {
            this.id(id);
        }
        this._type = this.constructor.name;
        this.setProp('@type', this._type);
        syslog.trace('SchemaBase:constructor', `Created schema class ${this._type}.`);

        this._specs = SchemaBase.getSpecsForClass(this._type);

        if (this._specs.inherits) {
            let inherits = arr.makeArray(this._specs.inherits);

            for (let inher of inherits) {
                let otherSpecs = SchemaBase.getSpecsForClass(inher);

                if (otherSpecs.fields) {
                    if (!this._specs.fields) {
                        this._specs.fields = {};
                    }
                    for (let key in otherSpecs.fields) {
                        this._specs.fields[key] = otherSpecs.fields[key];
                    }
                }
            }

        }
    }

    /**
     * See if we have a property.
     * 
     * @param   {string}    name    Property name to check.
     * @return  {boolean}           True if it exists, else false.
     */
    hasProp(name)
    {
        return (name in this._props);
    }

    /**
     * Get a property.
     * 
     * @param   {string}    name        Property name to get.
     * @return  {any}                   Property value.
     * 
     * @throws  {GreenHatSchemaError}   If we do not have the property.
     */
    getProp(name)
    {
        if (this.hasProp(name)) {
            return this._props[name];
        }
        throw new GreenHatSchemaError(`Schema ${this._type} does not have property '${name}'.`);
    }

    /**
     * Add a property.
     * 
     * @param   {string}    name            Property name to set.
     * @param   {any}       val             Value to set it to.
     * @return  {BaseType}                  Ourself.
     */
    addProp(name, val)
    {
        return this.setProp(name, val, true);
    }

    /**
     * Is this a valid property?
     * 
     * @param   {string}    name                Property name to check.
     * @param   {any}       val                 Value to check.
     * @param   {boolean}   throwExceptions     Throw exceptions?
     * @return  {boolean}                       True if it's valid, else false.
     */
    _isValidProperty(name, val, throwExceptions = true)
    {
        if (['@id', '@type', '@context'].includes(name)) {
            return true;
        }

        if (!(name in this._specs.fields)) {
            if (throwExceptions) {
                throw new GreenHatSchemaError(`Property '${name}' is not valid for schema ${this._type}.`);
            }
            return false;
        }

        let allowedTypes = arr.makeArray(this._specs.fields[name]);
        let valid = true;

        if (Array.isArray(val)) {
            for (let item of val) {
                if (!this._checkValueAgainstMultiple(item, allowedTypes)) {
                    valid = false;
                }
            }
        } else {
            if (!this._checkValueAgainstMultiple(val, allowedTypes)) {
                valid = false;
            }
        }

        if (!valid) {
            throw new GreenHatSchemaError(`Invalid type for property '${name}' in schema ${this._type}.` + 
            ` It must be one of: ${allowedTypes.join(', ')}. Value: ${val}`);
        }

        return valid;
    }

    /**
     * Check a property against an array of types.
     * 
     * @param   {any}       val         Property value.
     * @param   {string}    types       Types to check against.
     * @return  {boolean}               True if it's ok, else false.
     */
    _checkValueAgainstMultiple(val, types)
    {
        types = arr.makeArray(types);

        for (let t of types) {
            if (this._checkValueAgainst(val, t)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check a property against a type.
     * 
     * @param   {any}       val         Property value.
     * @param   {string}    type        Type to check against.
     * @return  {boolean}               True if it's ok, else false.
     */
    _checkValueAgainst(val, type)
    {
        if (type == 'URL' && typeof(val) == "string") {
            return true;
        } else if (type == 'Text' && (typeof(val) == "string" || typeof(val) == "number")) {
            return true;
        } else if (type == 'Integer') {
            const p = parseInt(val, 10);
            if (isNaN(p)) {
                return false;
            } else {
                return true;
            }
        } else if (type == 'Boolean') {
            return typeof(val) == "boolean";
        } else if (type == 'Number') {
            const p = parseFloat(val);
            if (isNaN(p)) {
                return false;
            } else {
                return true;
            }
        } else if (type == 'Date' || type == 'DateTime' || type == 'Time') {
            const p = new Date(val);
            if (p == 'Invalid Date') {
                return false;
            } else {
                return true;
            }
        } else if (typeof(val) == "object" && val instanceof SchemaBase) {
            if (val.inheritsFrom(type)) {
                return true;
            }
        } else if (typeof(val) == "object") {
            let k = Object.keys(val);
            if (k.length == 1 && k[0] == '@id') {
                return true;
            }
        }

        return false;
    }

    /**
     * See if something is part of the inheritance chain.
     * 
     * @param   {string}    type            Type to test.
     * @return  {boolean}                   True if it is, else false.
     */
    inheritsFrom(type)
    {
        if (type == this._type) {
            return true;
        }
        if (this._specs.inherits) {
            let inherits = arr.makeArray(this._specs.inherits);
            if (inherits.includes(type)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Set a property. This is polymorphic though, so it gets the property if val is undefined.
     * 
     * @param   {string}    name            Property name to set.
     * @param   {any}       val             Value to set it to.
     * @param   {boolean}   mustNotExist    Property must not already exist?
     * @return  {BaseType|any}              Ourself unless val is undefined, in which case just return property value.
     * 
     * @throws  {GreenHatSchemaError}       If the mustNotExist flag is set and the property already exists.
     */
    setProp(name, val, mustNotExist = false)
    {
        if (val == undefined) {
            return this.getProp(name);
        }

        this._isValidProperty(name, val);

        if (mustNotExist && this.hasProp(name)) {
            throw new GreenHatSchemaError(`Schema ${this._type} alreday has property '${name}'.`);
        }

        if (name == 'id' || name == '@id') {
            throw new GreenHatSchemaError(`Use the specific id() function to set ID values.`);
        }

        this._props[name] = val;
        return this;
    }

    /**
     * Get the type.
     * 
     * @return  {string}                Schema class type.
     */
    getType()
    {
        return this._props['@type'];
    }

    /**
     * Get the ID.
     * 
     * @return  {string}                ID.
     */
    getId()
    {
        return this._props['@id'];
    }

    /**
     * Set the ID.
     * 
     * @param   {string}    val         ID to set.
     * @return  {object}                Ourself. 
     */
    id(val) 
    {
        if (val == undefined) {
            return this._propd['@id'];
        }
        this._props['@id'] = SchemaBase.sanitizeId(val);
        return this;
    }

    /**
     * Resolve properties.
     * 
     * @return  {object}                Resolved properties. 
     */
    resolveProps()
    {
        let ret = {};

        for (let key in this._props) {
            if (this._props[key] instanceof SchemaBase) {
                ret[key] = this._props[key].resolveProps();
            } else if (Array.isArray(this._props[key])) {
                let all = [];
                for (let item of this._props[key]) {
                    if (item instanceof SchemaBase) {
                        all.push(item.resolveProps());
                    } else {
                        all.push(item);
                    }
                }
                ret[key] = all;
            } else {
                ret[key] = this._props[key];
            }
        }

        return ret;
    }

    /**
     * Dump this schema.
     * 
     * @return  {object}                Object withot blurb. 
     */
    dump()
    {
        let tmp = {...this};
        delete tmp._specs;
        return tmp; 
    }

}

module.exports = SchemaBase;
