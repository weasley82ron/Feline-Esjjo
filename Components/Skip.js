module.exports = {
    name: "skip",
    id: "skip_but",
    permissions: {
        client: [],
        user: [],
        dev: false,
        voteRequired: false,
    },
    player: { voice: true, active: true, dj: false, djPerm: null },
    cooldown: 5,
    /**
     * @param {import("../Main")} client
     * @param {import("discord.js").CommandInteraction} interaction
     * @param {import('kazagumo').KazagumoPlayer} dispatcher
     */
    execute: async (client, interaction, color, dispatcher) => {
        const { title, uri } = dispatcher.queue.current;
        if (dispatcher.data.get("autoplay")) {
            if (dispatcher.paused) dispatcher.pause(false);
            dispatcher.skip();
            await client.util.update(dispatcher, client);
            return await client.util.buttonReply(
                interaction,
                `${interaction.member} has skipped [${title}](${uri})`,
                color,
            );
        } else if (dispatcher.queue.size === 0)
            return await client.util.buttonReply(
                interaction,
                "No more songs left in the queue to skip.",
                color,
            );
        if (dispatcher.paused) dispatcher.pause(false);
        dispatcher.skip();
        await client.util.update(dispatcher, client);
        return await client.util.buttonReply(
            interaction,
            `${interaction.member} has skipped [${title}](${uri})`,
            color,
        );
    },
};
