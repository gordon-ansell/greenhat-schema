/**
 * @file        Schema 'MusicGroup'.
 * @module      Schema/MusicGroup
 * @author      Gordon Ansell   <contact@gordonansell.com> 
 * @copyright   Gordon Ansell, 2020.
 * @license     MIT
 */

'use strict';

const Organization = require("./organization");

/**
 * Schema 'MusicGroup'.
 */
class MusicGroup extends Organization
{
    album(val) {return this.setProp('album', val);}
    genre(val) {return this.setProp('genre', val);}
    track(val) {return this.setProp('track', val);}
}

module.exports = MusicGroup