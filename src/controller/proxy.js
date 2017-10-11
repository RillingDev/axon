import {
    getNodeRoot,
} from "./nodes";

const dataProxyFactory = function (node) {
    return {
        set: (target, key, val) => {
            if (val !== target[key]) {
                target[key] = val;
                console.log({
                    node,
                    target
                });
                node.render();
            }

            return true;
        }
    };
};

export {
    dataProxyFactory
};
