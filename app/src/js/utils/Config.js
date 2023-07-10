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
        "#ffe5d9ff",
        "#f8d9edff",
        "#fff8e1ff",
    ],
    COLOUR_CODES: [
        "#b0deffff", //blue
        "#d5f7eeff", //green
        "#ffd6c4ff", 
        "#f4c5e4ff",
        "#fff2c8ff", //yellow
    ],
    // COLOUR_CODES_DARK: [
    //     "#87cfffff",
    //     "#d4f7edff",
    //     "#fff1bfff",
    //     "#ffc5abff",
    //     "#f0add9ff",
    // ],
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

/* 
--celestial-blue: #0e9effff;
--tiffany-blue: #aaeedbff;
--jasmine: #ffe482ff;
--atomic-tangerine: #ff8d58ff;
--brilliant-rose: #e259b2ff;

--light-sky-blue: #87cfffff;
--mint-green: #d4f7edff;
--vanilla: #fff1bfff;
--apricot: #ffc5abff;
--lavender-pink: #f0add9ff;

--columbia-blue: #c7e8ffff;
--azure-web: #ebfbf7ff;
--cornsilk: #fff8e1ff;
--champagne-pink: #ffe5d9ff;
--mimi-pink: #f8d9edff; */

Object.freeze(Config);

export default Config;