import { IAxonConfig, IAxonDirectiveDeclaration, IAxonNode } from "./interfaces";
/**
 * Axon Root Node
 *
 * @class
 */
declare const AxonApp: {
    new (cfg: IAxonConfig): {
        $entry: IAxonNode;
        methods: object;
        directives: Map<string, IAxonDirectiveDeclaration>;
        /**
         * Initializes directives
         */
        init(): boolean;
        /**
         * Renders directives
         */
        render(): boolean;
    };
};
export default AxonApp;
