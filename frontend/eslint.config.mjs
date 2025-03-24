import CommonConfig from "eslint-config-yscope/CommonConfig.mjs";
import ReactConfigArray from "eslint-config-yscope/ReactConfigArray.mjs";
import StylisticConfigArray from "eslint-config-yscope/StylisticConfigArray.mjs";


const EslintConfig = [
    CommonConfig,
    ...StylisticConfigArray,
    ...ReactConfigArray,
];


export default EslintConfig;
