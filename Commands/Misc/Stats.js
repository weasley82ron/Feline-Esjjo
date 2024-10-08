module.exports = new Object({
    name: "stats",
    description: "Shows a deep status of the bot.",
    category: "Misc",
    usage: "",
    cooldown: 10,
    usage: '',
    aliases: ['info'],
    examples: ['info', 'stats', 'botinfo'],
    sub_commands: [],
    args: false,
    permissions: {
        client: [],
        user: [],
        dev: false,
        voteRequired: false
    },
    player: { voice: false, active: false, dj: false, djPerm: null },

    async execute(client, message, args, prefix, color) {
        const dbPing = async () => {
            const currentNano = process.hrtime();
            await (require('mongoose')).connection.db.command({ ping: 1 });
            const time = process.hrtime(currentNano);
            return Math.round((time[0] * 1e9 + time[1]) * 1e-6);
        };

        return message.reply({
            embeds: [
                client.embed()
                    .setColor(color)
                    .setDescription('<:dotpurple:1279760074591440999>  **[Below Are the statistics of Mizu Music.](https://discord.gg/mizubee)**')
                    .setTimestamp()
                    .setThumbnail(client.user.displayAvatarURL({ forceStatic: true }))
                    .setFooter({ text: `${message.guild.shardId}/${client.shard.count} shards`, iconURL: client.user.displayAvatarURL() })
                    .addFields([
                        {
                            name: '<:status:1277553246470279179> Status',
                            value: `> <:latency:1284169217834356736> Bot Latency : \`${Math.round(client.ws.ping)} ms\`\n> <:latency2:1284169209017798788> DataBase Latency :  \`${await dbPing()} ms\`\n> <:uptime:1284169201266724895> Uptime : <t:${(Date.now() / 1000 - client.uptime / 1000).toFixed()}:R>\n> <:commands:1284169149534441495> Commands : \`${client.Commands.map(x => x.name).length}\``,
                            inline: false,
                        },
                        {
                            name: '<:EsjjoStats:1284169137622351944> Stats',
                            value: `> <:Servers:1284169128478769235> Servers : \`${client.guilds.cache.size}\`\n> <:user:1284169118164975626> Users :  \`${client.guilds.cache.reduce((x, y) => x + y.memberCount, 0)}\`\n> <:channels:1284169107406590044> Channels : \`${client.channels.cache.size}\``,
                            inline: false,
                        },
                        {
                            name: '<a:Platform:1279760020204163145> Host',
                            value: `> <:dotpurple:1279760074591440999> Platform : \`${require('os').type}\`\n> <:dotpurple:1279760074591440999> Total Memory : \`${client.util.formatBytes(require('os').totalmem)}\`\n> <:dotpurple:1279760074591440999> Free Memory : \`${client.util.formatBytes(require('os').freemem)}\``,
                            inline: false,
                        },
                        {
                            name: '<:Library:1284169094450380851> Library',
                            value: `> <:Djs:1284169083687800923> Discord.js : \`v${require('discord.js').version}\`\n> <:Nodejs:1284169073529458708> Node : \`${process.version}\``,
                            inline: false,
                        },
                    ]),
            ],
        });
    },
});
