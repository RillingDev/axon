import {
    arrClone
} from "lightdash";

/**
 * Querys by selector
 *
 * @param {String} selector
 * @param {Node} [context=document]
 * @param {Boolean} [context=false]
 * @returns {Node|Array}
 */
const query = function (selector, context = document, all = false) {
    return all ? arrClone(context.querySelectorAll(selector)) : context.querySelector(selector);
};

export default query;
