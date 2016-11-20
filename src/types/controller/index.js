"use strict";

import queryDirective from "../../dom/query/queryDirective";
import bindDirectives from "../../dom/bind/bindDirectives";
import render from "../../render/index";

/**
 * Constructor function for the controller type
 * @private
 * @param {Object} _module The module object
 * @param {Array} dependencies Array of dependency contents
 * @returns {Mixed} Initialized module
 */
const typeController = function(_module, dependencies) {
    const _this = this;
    let ctrl;

    //First value gets ignored by calling 'new' like this, so we need to fill it with something
    dependencies.unshift(0);

    //Apply into new constructor by binding applying the bind method.
    //@see: {@link http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible }
    ctrl = new(Function.prototype.bind.apply(_module.fn, dependencies));


    //Bind Context
    ctrl.$context = queryDirective(_this.$context, "controller", _module.name, false);
    //ctrl.$expressions = bindExpressions(_module.fn);
    ctrl.$directives = bindDirectives(ctrl);
    //run first digest
    ctrl.$render = function() {
        render(ctrl);
    };
    //ctrl.$render();


    _module.fn = ctrl;

    return _module;
};

export default typeController;
