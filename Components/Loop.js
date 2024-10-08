module.exports = {
    name: 'loop',
    id: 'loopmodesbut_but',
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
        if (dispatcher.loop == 'none') {
            dispatcher.setLoop('track');
            await client.util.update(dispatcher, client);
            return await client.util.buttonReply(interaction, `${interaction.member} has enabled **track** loop`, color);
        } else if (dispatcher.loop == 'track') {
            dispatcher.setLoop('queue');
            await client.util.update(dispatcher, client);
            return await client.util.buttonReply(interaction, `${interaction.member} has enabled **queue** loop`, color);
        } else {
            dispatcher.setLoop('none');
            await client.util.update(dispatcher, client);
            return await client.util.buttonReply(interaction, `${interaction.member} has **disabled** looping`, color);
        }
    },
};
