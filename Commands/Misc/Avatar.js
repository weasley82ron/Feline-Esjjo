module.exports = new Object({
    name: "avatar",
    description: "Shows the avatar of a user.",
    category: "Misc",
    usage: "",
    cooldown: 10,
    usage: '',
    aliases: ['pfp'],
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
        const user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
        const avatar = user.displayAvatarURL({ dynamic: true, size: 2048 });
        const embed = client.embed()
            .setColor(color)
            .setTitle(`${user.tag}'s avatar`)
            .setImage(avatar)
        return message.reply({ embeds: [embed] })
    }
});