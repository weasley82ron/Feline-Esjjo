module.exports = {
    name: 'pause',
    id: 'pause_but',
    permissions: {
        client: [],
        user: [],
        dev: false,
        voteRequired: false
    },
    player: { voice: true, active: true, dj: false, djPerm: null },
    cooldown: 5,
    /**
     * @param {import("../Main")} client
     * @param {import("discord.js").CommandInteraction} interaction
     * @param {import('kazagumo').KazagumoPlayer} dispatcher
     */
     execute: async (client, interaction, color, dispatcher) => {
        if (dispatcher.paused) {
            dispatcher.pause(false);
            await client.util.update(dispatcher, client);
            return await client.util.buttonReply(interaction, `${interaction.member} has resumed the music.`, color);
        } else {
            dispatcher.pause(true);
            await client.util.update(dispatcher, client);
            return await client.util.buttonReply(interaction, `${interaction.member} has paused the music.`, color);
        }
    },
};
