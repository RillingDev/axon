"use strict";

import queryDirective from "../dom/query/directives/query";

import bindDirectives from "../dom/bind/directives";
import bindExpressions from "../dom/bind/expressions";

import digest from "../dom/digest/digest";
/**
 * Creates typeList entry for Controller
 *
 * @private
 * @param {Object} service The service
 * @param {Object} bundle The service deps
 * @return {Function} service
 */
export default function(service, bundle) {
    //Construct Controller
    //
    //First value gets ignored by calling new like this, so we need to fill it
    bundle.unshift(null);
    //Apply into new constructor by accessing bind proto. from: http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
    const ctrl = service.fn = new(Function.prototype.bind.apply(service.fn, bundle));


    //Bind Context
    ctrl.$context = queryDirective("controller", service.name)[0];
    ctrl.$expressions = bindExpressions(ctrl);
    ctrl.$directives = bindDirectives(ctrl);
    //run first digest
    digest(ctrl);

    console.log(service);

    return service;
}
