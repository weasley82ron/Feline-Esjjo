module.exports = {
    name: 'rewind',
    id: 'rewindbut_but',
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
        if (!dispatcher.queue.current.isSeekable) return await client.util.buttonReply(interaction, 'Unable to rewind this track.', color);
        if (dispatcher.paused) return await client.util.buttonReply(interaction, 'Unable to rewind this track as player is paused.', color);
        const seektime = dispatcher.shoukaku.position - 10 * 1000;
        if (seektime >= dispatcher.queue.current.length || seektime < 0) return await client.util.buttonReply(interaction, 'Cannot rewind any futher more.', color);
        dispatcher.shoukaku.seekTo(seektime);
        await client.util.buttonReply(interaction, `${interaction.member} has rewinded the current track by \`10 seconds\`.`, color);
    },
};
