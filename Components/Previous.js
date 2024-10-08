module.exports = {
    name: 'previous',
    id: 'previous_but',
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
        if (!dispatcher.queue.previous) return await client.util.buttonReply(interaction, 'There is no previous track to play.', color);
        dispatcher.queue.unshift(dispatcher.queue.previous);
        dispatcher.shoukaku.stopTrack();
        await client.util.update(dispatcher, client);
        return await client.util.buttonReply(interaction, `${interaction.member} has added - \`${dispatcher.queue.previous.title}\` to the queue.`, color);
    },
};
