module.exports = {
    name: 'volumelow',
    id: 'lowvolume_but',
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
        const amount = Number(dispatcher.shoukaku.filters.volume * 100 - 10);
        if (amount <= 9) return await client.util.buttonReply(interaction, 'Cannot lower the player volume further more.', color);
        if (dispatcher.paused) dispatcher.pause(false)
        dispatcher.setVolume(amount);
        await client.util.update(dispatcher, client);
        await client.util.buttonReply(interaction, ` ${interaction.member} has set volume to : \`[ ${dispatcher.volume * 100}% ]\``, color);
    },
};
