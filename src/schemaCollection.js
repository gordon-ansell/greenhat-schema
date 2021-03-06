/**
 * @file        Schema collection.
 * @module      SchemaCollection
 * @author      Gordon Ansell   <contact@gordonansell.com> 
 * @copyright   Gordon Ansell, 2020.
 * @license     MIT
 */

'use strict';

class SchemaCollection
{
    // Items.
    items = {}

    // Context.
    context = "https://schema.org";

    /**
     * Constructor.
     *
     * @param   {string}    context            Context.
     */
    constructor(context = "https://schema.org")
    {
        this.context = context;
    }

    /**
     * Add an item.
     * 
     * @param   {string}    name                Name of item to add.
     * @param   {object}    item                Schema item to add.
     * @param   {boolean}   allowOverwrite      Allow overwrite?
     * @return  {object}                        Ourself.
     */
    add(name, item, allowOverwrite = false)
    {
        if (this.items[name] && !allowOverwrite) {
            throw new Error(`Schema collection already has an item called '${name}'.`)
        }
        this.items[name] = item;
        return this;
    }

    /**
     * Resolve the graph.
     * 
     * @param   {boolean}   stringify   Stringify it?
     * @param   {string}    spacer      Spacer.
     * @return  {object}                Full schema.
     */
    resolve(stringify = true, spacer = null)
    {
        let ret = {
            '@context': this.context,
            '@graph': []
        }

        for (let key in this.items) {
            ret['@graph'].push(this.items[key].resolveProps());
        }

        if (stringify) {
            return JSON.stringify(ret, null, spacer);
        } else {
            return ret;
        }
    }



}

module.exports = SchemaCollection;
