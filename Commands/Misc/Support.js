module.exports = new Object({
    name: "support",
    description: "Get a link to our support server.",
    category: "Misc",
    usage: "",
    cooldown: 10,
    usage: '',
    aliases: [],
    examples: [''],
    sub_commands: [],
    args: false,
    permissions: {
        client: [],
        user: [],
        dev: false,
        voteRequired: false
    },
    player: { voice: false, active: false, dj: false, djPerm: null },
    /**
     * 
     * @param {import("../../../Main")} client 
     * @param {import("discord.js").Message} message
     * @param {String[]} args
     * @param {String} prefix
     * @param {String} color
     */
    async execute(client, message, args, prefix, color) {
        return message.reply({
            components: [
                client.row().addComponents(
                    client.button()
                        .setStyle(client.config.button.link)
                        .setLabel('Support Server')
                        .setURL(client.config.links.support),
                ),
            ],
        });
    },
});