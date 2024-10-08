const {
    Client,
    GatewayIntentBits,
    Partials,
    ActivityType,
    Collection,
    EmbedBuilder,
    ButtonBuilder,
    StringSelectMenuBuilder,
    ActionRowBuilder,
} = require("discord.js");
const { connect, connection, set } = require("mongoose");
const Utils = require("../Handler/Utils");
const { Api } = require("@top-gg/sdk");
const { Kazagumo } = require("kazagumo");
const { Connectors } = require("shoukaku");
const PlayerExtends = require("./DispatcherExtend");

const Intents = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
];

class Main extends Client {
    constructor() {
        super({
            shards: "auto",
            allowedMentions: {
                parse: ["users", "roles", "everyone"],
                repliedUser: false,
            },
            intents: Intents,
            partials: [
                Partials.Channel,
                Partials.GuildMember,
                Partials.Message,
                Partials.User,
                Partials.Reaction,
            ],
            presence: {
                activities: [{ name: ".play", type: ActivityType.Listening }],
                status: "idle",
            },
            restTimeOffset: 0,
            restRequestTimeout: 20000,
        });
        this.Commands = new Collection();
        this.premiums = new Collection();
        this.ButtonInt = new Collection();
        this.Cooldown = new Collection();
        this.ButCooldown = new Collection();
        this.ChannelCoolDown = new Collection();
        this.Aliases = new Collection();
        this.config = require("../Config");
        this.prefix = this.config.Prefix;
        this.color = this.config.EmbedColor;
        this.owners = this.config.Owners;
        this.np = [
            "1162754753038667919",
            "1089552985421520926",
            "1249633659703660587",
        ];
        this.dispatcher;
        this.Topgg = new Api(this.config.Api.Topgg);
        this.console = require("../Utility/Console");
        this.emoji = require("../Handler/Emoji");
        this.util = new Utils(this);
        if (!this.token) this.token = this.config.Token;
        this._loadPlayer();
        this._connectMongodb();
        this.connect();

        // Set up activity rotation
        this.activities = [
            { name: "With Metadata", type: ActivityType.Playing },
            { name: "Hanging Music", type: ActivityType.Listening },
            { name: "Hanging out with friends", type: ActivityType.Competing }
        ];
        this.currentActivityIndex = 0;
        this.startActivityRotation();
    }

    /**
     * @param {import('discord.js').APIEmbed} data
     * @returns {EmbedBuilder}
     */
    embed(data) {
        return new EmbedBuilder(data);
    }

    /**
     * @param {import('discord.js').APIButtonComponent} data
     * @returns {ButtonBuilder}
     */
    button(data) {
        return new ButtonBuilder(data);
    }

    /**
     * @param {import('discord.js').APIStringSelectComponent} data
     * @returns {StringSelectMenuBuilder}
     */
    menu(data) {
        return new StringSelectMenuBuilder(data);
    }

    /**
     * @param {import('discord.js').APIActionRowComponent} data
     * @returns {ActionRowBuilder}
     */
    row(data) {
        return new ActionRowBuilder(data);
    }

    async _loadPlayer() {
        this.dispatcher = new Kazagumo(
            {
                defaultSearchEngine: "youtube_music",
                extends: { player: PlayerExtends },
                send: (guildId, payload) => {
                    this.client = this;
                    const guild = this.guilds.cache.get(guildId);
                    if (guild) guild.shard.send(payload);
                },
            },
            new Connectors.DiscordJS(this),
            this.config.Nodes,
        );
        return this.dispatcher;
    }

    async _connectMongodb() {
        set("strictQuery", false);
        const dbOptions = {
            useNewUrlParser: true,
            autoIndex: false,
            connectTimeoutMS: 10000,
            family: 4,
            useUnifiedTopology: true,
        };
        if ([1, 2, 99].includes(connection.readyState)) return;
        connect(this.config.MongoData, dbOptions);
        this.console.log("Successfully connected to MongoDB.", "api");
    }

    async connect() {
        super.login(this.token);
        ["Button", "Message", "Events", "Node", "Dispatcher"].forEach((files) => {
            require(`../Scripts/${files}`)(this);
        });
    }

    startActivityRotation() {
        setInterval(() => {
            this.currentActivityIndex = (this.currentActivityIndex + 1) % this.activities.length;
            const activity = this.activities[this.currentActivityIndex];
            this.user.setPresence({ activities: [activity], status: 'idle' });
        }, 40000); // Rotate every 40 seconds
    }
}

module.exports = { Main };
