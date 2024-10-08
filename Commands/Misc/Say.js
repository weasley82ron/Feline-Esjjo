const { MessageEmbed } = require('discord.js');

module.exports = new Object({
    name: "say",
    description: "Says something.",
    category: "Misc",
    usage: "say <Text>",
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
        // Join args to form the message content
        const content = args.join(' ');
        
        // Check for role mentions or @everyone/@here
        if (content.includes('@everyone') || content.includes('@here') || /<@&\d+>/.test(content)) {
            return await client.util.msgReply(message, "You can't mention roles or use @everyone/@here.", color);
        }
        
        // Check for links and Discord invite links
        const urlPattern = /(https?:\/\/[^\s]+)|(discord\.gg\/[^\s]+)/i;
        if (urlPattern.test(content)) {
            // Create an embed message
            const embed = client.embed()
                .setColor(color)
                .setDescription("You are not allowed to send links or Discord invite links.");
            return await message.channel.send({ embeds: [embed] });
        }

        // Check if content is empty
        if (!args[0]) return await client.util.msgReply(message, 'You need to specify something to say.', color);

        return await message.channel.send(content);
    }
});
