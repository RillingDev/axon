"use strict";

import getDomByData from "../dom/getDomByData.js";

/**
 * Creates typeList entry for module
 *
 * @private
 * @param {Object} _this The context
 * @return void
 */
export default function (_this) {
    _this.extend("module", function (service, bundle) {
        //Construct factory
        //First value gets ignored by calling new like this, so we need to fill it
        bundle.unshift(null);
        //Apply into new constructor by accessing bind proto. from: http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
        service.fn = new(Function.prototype.bind.apply(service.fn, bundle));



        service.fn.context = getDomByData("app", service.name)[0];

        return service;
    });
}
