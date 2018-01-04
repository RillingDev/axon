import { IAxonNode, IAxonNodeRoot } from "../interfaces";

/**
 * Gets the topmost node
 *
 * @private
 * @param {AxonNode} node
 * @returns {AxonNode}
 */
const getNodeRoot = (node: IAxonNode | IAxonNodeRoot): IAxonNodeRoot => {
    let result = node;

    while (result.$parent !== null) {
        result = result.$parent;
    }
    // @ts-ignore
    return result;
};

export {
    getNodeRoot
};
