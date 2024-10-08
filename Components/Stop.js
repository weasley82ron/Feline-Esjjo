module.exports = {
    name: 'stop',
    id: 'stop_but',
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
        const autoplay = dispatcher.data.get('autoplay');
        if (autoplay) dispatcher.data.set('autoplay', false);
        if (dispatcher.paused) dispatcher.pause(false)
        dispatcher.queue.clear();
        dispatcher.shoukaku.stopTrack();
        await client.util.update(dispatcher, client);
        return await client.util.buttonReply(interaction, 'Player has been stopped/destroyed.', color);
    },
};
