const db = require("../../Models/Setup");
const { trackStartHandler } = require("../../Handler/RequestChannelEvent");
const db2 = require("../../Models/Announce");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    name: "playerStart",
    /**
     * @param {import("../../Main")} client
     * @param {import("kazagumo").KazagumoPlayer} dispatcher
     * @param {import("kazagumo").KazagumoTrack} track
     */
    async execute(client, dispatcher, track) {
        try {
            const duration = dispatcher.queue.current.length; // Total track duration in milliseconds
            const parsedDuration = client.util.duration(duration); // Format total duration
            const imageUrl = track.thumbnail; // Use the track thumbnail as the image URL
            const color = client.color || "#f50a83";
            dispatcher.data.set("autoplayfunction", track);

            const guild = client.guilds.cache.get(dispatcher.guildId);
            if (!guild) return console.error("Guild not found");

            let channel = guild.channels.cache.get(dispatcher.textId);
            if (!channel) return console.error("Text channel not found");

            const data = await db.findOne({ _id: guild.id });
            const data2 = await db2.findOne({ _id: guild.id });
            let author = track.author || "Unknown";

            const buttons = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId("pause_but").setStyle(ButtonStyle.Success).setLabel("Pause"),
                new ButtonBuilder().setCustomId("previous_but").setStyle(ButtonStyle.Primary).setLabel("Previous"),
                new ButtonBuilder().setCustomId("skip_but").setStyle(ButtonStyle.Primary).setLabel("Skip"),
                new ButtonBuilder().setCustomId("stop_but").setStyle(ButtonStyle.Danger).setLabel("Stop"),
                new ButtonBuilder().setCustomId("autoplay_but").setStyle(ButtonStyle.Secondary).setLabel("Autoplay")
            );

            const embed = new EmbedBuilder()
                .setAuthor({ name: `|  Now Playing`, iconURL: track.requester.displayAvatarURL() })
                .setDescription(`[${track.title}](${track.uri}) by [${author}](https://discord.gg/mizubee) [ ${parsedDuration} ]`)
                .setColor(color)
                .setThumbnail(imageUrl);

            // Update voice channel status
            const voiceChannelId = dispatcher.options.voiceId;
            if (voiceChannelId) {
                const vcChannel = guild.channels.cache.get(voiceChannelId);
                if (vcChannel) {
                    try {
                        await client.rest.put(`/channels/${voiceChannelId}/voice-status`, {
                            body: { status: `**♬ ${track.title}** - ${author}` }
                        });
                    } catch (statusError) {
                        console.error(`Error updating voice channel status for ${vcChannel.name}:`, statusError);
                    }
                } else {
                    console.error(`Voice channel with ID ${voiceChannelId} not found`);
                }
            } else {
                console.error(`No voice channel ID available in dispatcher`);
            }

            // Send message to the correct channel
            const handleSendMessage = async (channel, embed, buttons, dbModel) => {
                try {
                    const message = await channel.send({ embeds: [embed], components: [buttons] });
                    if (message) {
                        await dispatcher.setNowplayingMessage(message);
                        await dbModel.updateOne({ _id: guild.id }, { $set: { message: message.id } });
                    }
                } catch (error) {
                    console.error(error);
                    await channel.send({ embeds: [embed], components: [buttons] });
                }
            };

            if (data) {
                const textChannel = guild.channels.cache.get(data.channel);
                const id = data.message;

                if (id) {
                    try {
                        const previousMessage = await textChannel.messages.fetch(id);
                        if (previousMessage) await previousMessage.delete();
                    } catch (error) {
                        console.error("Error deleting previous message:", error);
                    }
                }

                if (channel.id === textChannel.id) {
                    if (data2 && data2.mode && data2.channel) {
                        channel = guild.channels.cache.get(data2.channel);
                    }
                    await handleSendMessage(channel, embed, buttons, db);
                    return await trackStartHandler(id, textChannel, dispatcher, track, client, color);
                } else {
                    await trackStartHandler(id, textChannel, dispatcher, track, client, color);
                }
            }

            if (data2 && !data2.mode) return;
            if (data2 && data2.channel) channel = guild.channels.cache.get(data2.channel);
            if (data2 && data2.prunning) {
                await handleSendMessage(channel, embed, buttons, db2);
            } else {
                await handleSendMessage(channel, embed, buttons, db2);
            }
        } catch (error) {
            console.error("An error occurred in playerStart event:", error);
        }
    },
};
