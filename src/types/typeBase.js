/**
 * @file        Schema base type.
 * @module      TypeBase
 * @author      Gordon Ansell   <contact@gordonansell.com> 
 * @copyright   Gordon Ansell, 2020.
 * @license     MIT
 */

'use strict';

const path = require('path');
const url = require('url');
const GreenHatError = require("greenhat-util/error");
const syslog = require('greenhat-util/syslog');

class GreenHatSchemaError extends GreenHatError {};

/**
 * Base type class.
 */
class TypeBase
{
    /**
     * Context.
     * @type    {string}
     */
    static context = "https://schema.org";

    /**
     * Value.
     * @type    {string}
     */
    _val = {};    

    /**
     * Allowed values.
     * @type    {string[]}
     */
    _allowed = [];

    /**
     * Prefix.
     * @param   {string}
     */
    _prefix = '';     

    /**
     * Input text.
     * @param   {string}
     */
    _txt = '';     

    /**
     * Constructor.
     * 
     * @param   {string}    txt     The text of the type.
     */
    constructor(txt)
    {
        this._txt = txt;
        this._init();
        this._check();
    }

    /**
     * Init.
     */
    _init()
    {
    }

    /**
     * Check.
     */
    _check()
    {
        let txt = this._txt;
        let working;
        if (txt.startsWith(TypeBase.context)) {
            working = txt.replace(TypeBase.context, '');
        } else {
            working = txt;
        }

        if (working.charAt(0) == path.sep) {
            working = working.slice(1);
        }

        if (working.startsWith(this._prefix)) {
            working = working.slice(this._prefix.length);
        }

        if (!this._allowed.includes(working)) {
            syslog.inspect(this._allowed);
            throw new GreenHatSchemaError(`'${txt}' (extracted: '${working}') is an invalid value for type ${this.constructor.name}.`)
        }

        this._val = url.resolve(TypeBase.context, this._prefix + working);
    }

    /**
     * Resolve.
     * 
     * @return  {string}        Resolved type.
     */
    resolve()
    {
        return this._val;
    }
}

module.exports = TypeBase;
