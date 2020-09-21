/**
 * @file        Event status.
 * @module      EventStatusType
 * @author      Gordon Ansell   <contact@gordonansell.com> 
 * @copyright   Gordon Ansell, 2020.
 * @license     MIT
 */

'use strict';

const TypeBase = require("./typeBase");


/**
 * Event status.
 */
class EventStatusType extends TypeBase
{
    /**
     * Init.
     */
    _init()
    {
        this._allowed = ['Cancelled', 'MovedOnline', 'Postponed', 'Rescheduled', 'Scheduled'];
        this._prefix = 'Event';  
    }

}

module.exports = EventStatusType;
