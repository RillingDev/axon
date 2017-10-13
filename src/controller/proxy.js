import {
    isObjectLike,
    forEachEntry,
} from "lightdash";

const bindDeepDataProxy = function (obj, node) {
    const proxySetter = {
        set: (target, key, val) => {
            if (val !== target[key]) {
                target[key] = val;

                node.render();
            }

            return true;
        }
    };
    const mapProxy = (obj) => {
        const result = obj;

        forEachEntry(result, (val, key) => {
            if (isObjectLike(val)) {
                result[key] = mapProxy(val);
            }
        });

        return new Proxy(obj, proxySetter);
    };

    return mapProxy(obj);
};

export {
    bindDeepDataProxy
};
