"use strict";

/**
 * Creates typeList entry for module
 *
 * @private
 * @param {Object} _this The context
 * @return void
 */
export default function(service, bundle) {
    //Construct factory
    //First value gets ignored by calling new like this, so we need to fill it
    bundle.unshift(null);
    //Apply into new constructor by accessing bind proto. from: http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
    service.fn = new(Function.prototype.bind.apply(service.fn, bundle));

    return service;
}
