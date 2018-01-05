import { IAxonNode, IAxonConfig } from "./interfaces";
/**
 * Axon Root Node
 *
 * @class
 */
declare const AxonApp: {
    new (cfg: IAxonConfig): {
        $entry: IAxonNode;
        methods: object;
        computed: object;
        init(): boolean;
        render(): boolean;
    };
};
export default AxonApp;
