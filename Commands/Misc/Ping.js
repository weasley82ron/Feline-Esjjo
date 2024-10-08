module.exports = new Object({
    name: "ping",
    description: "Shows the latency of the bot.",
    category: "Misc",
    usage: "",
    cooldown: 10,
    usage: "",
    aliases: ["pong"],
    examples: [""],
    sub_commands: [],
    args: false,
    permissions: {
        isPremium: false,
    },
    player: { voice: false, active: false, dj: false, djPerm: null },

    async execute(client, message) {
        const color = client.color;
        const dbPing = async () => {
            const currentNano = process.hrtime();
            await (require('mongoose')).connection.db.command({ ping: 1 });
            const time = process.hrtime(currentNano);
            return Math.round((time[0] * 1e9 + time[1]) * 1e-6);
        };
        const embed = client.embed()
            .setColor(color)  // Set your preferred color
            .setDescription(`**Bot Latency**: \`${Math.round(client.ws.ping)} ms\`\n**DataBase Latency**:  \`${await dbPing()} ms\``);

        return message.reply({ embeds: [embed] });
    },
});
