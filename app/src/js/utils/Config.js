/* eslint-env browser */

// Configuration object for values shared by multiple components

const Config = {
    PROJECT_ID: "649ab3887121a935da21",
    DATABASE_ID: "649afbb84bb08d4663e1",
    COLLECTION_ID: "649b037f907ae057e75a",
    BUCKET_ID: "649d550640f146162c94",
    COLOUR_CODES_LIGHT: [
        "#c7e8ffff", //blue
        "#ebfbf7ff", //green
        "#ffe5d9ff", //orange
        "#f8d9edff", //pink
        "#fff8e1ff", //yellow
    ],
    COLOUR_CODES: [
        "#b0deffff", //blue
        "#d5f7eeff", //green
        "#ffd6c4ff", //orange
        "#f4c5e4ff", //pink
        "#fff2c8ff", //yellow
    ],
    COLOUR_CODES_DARK: [
        "#87cfffff",//"#0e9effff", //blue
        "#aaeedbff", //green
        "#ffc5abff", //"#ff8d58ff", //orange
        "#f0add9ff", //"#e259b2ff", //pink
        "#ffe482ff", //yellow
    ],
    COLOUR_CODES_DARKER: [
        "#87cfffff",//"#0e9effff", //blue
        "#aaeedbff", //green
        "#ffc5abff", //"#ff8d58ff", //orange
        "#f0add9ff", //"#e259b2ff", //pink
        "#ffe482ff", //yellow
    ],
    COLOUR_CODES_DARKEST: [
        "#0e9effff",//"#0079ccff", //blue
        "#97ead2ff", //green
        "#ff712fff", //orange
        "#da2f9eff", //pink
        "#ffdd63ff", //yellow
    ],
};

Object.freeze(Config);

export default Config;