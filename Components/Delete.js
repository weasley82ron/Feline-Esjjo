module.exports = {
    name: 'delete',
    id: 'delete',
    permissions: {
        client: [],
        user: [],
        dev: true,
        voteRequired: false
    },
    player: { voice: false, active: false, dj: false, djPerm: null },
    cooldown: 5,
    /**
     * @param {import("../Main")} client
     * @param {import("discord.js").ButtonInteraction} interaction
     */
    execute: async (client, interaction, color, dispatcher) => {
        interaction.message.delete();
    },
};
