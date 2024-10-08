const db = require("../../Models/Setup");

module.exports = new Object({
    name: "playerEnd",
    /**
     * @param {import("../../Main")} client
     * @param {import("kazagumo").KazagumoPlayer} dispatcher
     */
    async execute(client, dispatcher) {
        const guild = client.guilds.cache.get(dispatcher.guildId);
        if (!guild) return;

        const data = await db.findOne({ Guild: guild.id });
        if (!data) return;

        const channel = guild.channels.cache.get(data.channel);
        if (!channel) return;

        let message;
        try {
            message = await channel.messages.fetch(data.message, {
                cache: true,
            });
        } catch (e) {}

        if (!message) return;

        // New code to update the voice channel status
        const voiceChannelId = dispatcher.options.voiceId;
        if (voiceChannelId) {
            const vcChannel = guild.channels.cache.get(voiceChannelId);
            if (vcChannel) {
                try {
                    const apiUrl = `/channels/${voiceChannelId}/voice-status`;
                    const payload = {
                        body: {
                            status: `**use /play to get started**`
                        }
                    };

                    // Use client.rest to send the request
                    await client.rest.put(apiUrl, payload);
                } catch (statusError) {
                    console.error(`Error updating voice channel status for ${vcChannel.name}:`, statusError);
                }
            } else {
                console.error(`Voice channel with ID ${voiceChannelId} not found`);
            }
        } else {
            console.error(`No voice channel ID available in dispatcher`);
        }

        // Creating buttons
        const pausebut = client
            .button()
            .setCustomId("pause_but")
            .setEmoji("<:supremepause:960583476812341268>")
            .setStyle(client.config.button.grey)
            .setDisabled(false);
        const lowvolumebut = client
            .button()
            .setCustomId("lowvolume_but")
            .setEmoji("<:stolen_emoji:1099216134319919126>")
            .setStyle(client.config.button.grey)
            .setDisabled(false);
        const highvolumebut = client
            .button()
            .setCustomId("highvolume_but")
            .setEmoji("<:stolen_emoji:1099216455758774364>")
            .setStyle(client.config.button.grey)
            .setDisabled(false);
        const previousbut = client
            .button()
            .setCustomId("previous_but")
            .setEmoji("<:supremeback:960586658179346512>")
            .setStyle(client.config.button.grey)
            .setDisabled(false);
        const skipbut = client
            .button()
            .setCustomId("skipbut_but")
            .setEmoji("<:stolen_emoji:1099217061814751352>")
            .setStyle(client.config.button.grey)
            .setDisabled(false);
        const rewindbut = client
            .button()
            .setCustomId("rewindbut_but")
            .setEmoji("<:supremereplay:960594429914275931>")
            .setStyle(client.config.button.grey)
            .setDisabled(false);
        const forwardbut = client
            .button()
            .setCustomId("forward_but")
            .setEmoji("<:supremenext:960586821614583842>")
            .setStyle(client.config.button.grey)
            .setDisabled(false);
        const autoplaybut = client
            .button()
            .setCustomId("autoplay_but")
            .setEmoji("<:stolen_emoji:1099208341647015947>")
            .setStyle(client.config.button.grey)
            .setDisabled(false);
        const loopmodesbut = client
            .button()
            .setCustomId("loopmodesbut_but")
            .setEmoji("<:supremeloop:960606169968295946>")
            .setStyle(client.config.button.grey)
            .setDisabled(false);
        const stopbut = client
            .button()
            .setCustomId("stop_but")
            .setEmoji("<:stolen_emoji:1099215378195943425>")
            .setStyle(client.config.button.grey)
            .setDisabled(false);
        const row1 = client
            .row()
            .addComponents([
                lowvolumebut,
                previousbut,
                pausebut,
                skipbut,
                highvolumebut,
            ]);
        const row2 = client
            .row()
            .addComponents([
                rewindbut,
                autoplaybut,
                stopbut,
                loopmodesbut,
                forwardbut,
            ]);

        await message
            .edit({
                content:
                    "__**Join a voice channel and queue songs by name/url**__\n\n",
                components: [row1, row2],
            })
            .catch(() => {});
    },
});
