const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong!"),

    async execute(interaction, client) {
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

        return interaction.reply({ embeds: [embed] });
    },
};
