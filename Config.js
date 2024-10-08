const { ButtonStyle } = require("discord.js");
module.exports = {
    Token: "Your_Discord_bot_token",
    Prefix: "",
    Client: {
        ID: "Discord_Bot_User_ID",
        Secret: "Discord_Bot_Secret",
    },
    button: {
        grey: ButtonStyle.Secondary,
        blue: ButtonStyle.Primary,
        link: ButtonStyle.Link,
        red: ButtonStyle.Danger,
        green: ButtonStyle.Success,
    },
    spotify: {
        ID: "Spotify_ID",
        Secret: "Spotify_Secret",
    },
    Api: {
        Topgg: `Top.gg_APi_Key`,
    },
    MongoData: "Mongo_DB_URL",
    EmbedColor: "#faeb27",
    Owners: ["", "", "", ""],
    // Free Lavalink v3 Versions!!
    Nodes:[
        {
            name: "Serenetia",
            url: "lavalinkv3-id.serenetia.com:80",
            auth: "BatuManaBisa",
            secure: false,
        },
        {
            name: "BloodStitch",
            url: "lava-v3.ajieblogs.eu.org:80",
            auth: "https://dsc.gg/ajidevserver",
            secure: false,
        }
    ],
    hooks: {
        guildAdd:
            "Discord_Webhook_URL",
        guildRemove:
            "Discord_Webhook_URL",
        Error: "Discord_Webhook_URL",
    },
    links: {
        invite: "https://discord.com/oauth2/authorize?client_id=1276175949037305919",
        bg: "https://cdn.discordapp.com/attachments/1265335151207120947/1276824081571909632/20230311_212533_0-00-00-00.png?ex=66caee97&is=66c99d17&hm=72f3f7384f1471d0ad3c206bb864946c12a729df3add02d06ea8b29cd218e689&",
        support: "https://discord.gg/jsk",
        vote: "https://top.gg/bot/1276175949037305919/vote",
        banner: "https://cdn.discordapp.com/attachments/1276707204585492501/1284121468422062121/Mizu.png?ex=66e57acf&is=66e4294f&hm=f614caf5760ee98cd678715e1d1460c1263515b8fc082861ea197061cac8de6c&",
        spotify:
            "https://cdn.discordapp.com/attachments/1036701023990984724/1038352707720843345/782104564315717642.png",
        soundcloud:
            "https://cdn.discordapp.com/attachments/1036701023990984724/1038352707418849310/908400578776956978.png",
    },
};
