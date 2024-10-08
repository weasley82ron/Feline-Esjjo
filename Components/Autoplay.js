module.exports = {
    name: 'autoplay',
    id: 'autoplay_but',
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
     */
    execute: async (client, interaction, color, dispatcher) => {
        if (dispatcher.paused) return await client.util.buttonReply(interaction, 'Unable to toggle autoplay as player is paused.', color);
        dispatcher.data.set('autoplay', !dispatcher.data.get('autoplay'));
        await client.util.update(dispatcher, client);
        return await client.util.buttonReply(interaction, `${interaction.member} has ${dispatcher.data.get('autoplay') ? '*`enabled`*' : '*`disabled`*'} autoplay.`, color);
    },
};
