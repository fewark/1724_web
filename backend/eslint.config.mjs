import CommonConfig from "eslint-config-yscope/CommonConfig.mjs";
import StylisticConfigArray from "eslint-config-yscope/StylisticConfigArray.mjs";
import Globals from "globals";


const EslintConfig = [
    CommonConfig,
    ...StylisticConfigArray,
    {
        languageOptions: {
            globals: {
                ...Globals.node,
            },
        },
        rules: {
            "new-cap": [
                "error",
                {
                    capIsNewExceptions: [
                        "Router",
                    ],
                },
            ],
        },
    },
];


export default EslintConfig;
