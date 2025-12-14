import { SlashCommandBuilder } from "discord.js";
import { getVoiceConnection } from "@discordjs/voice";

export default {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Lewati lagu yang sedang diputar"),

  async execute(interaction) {
    // jika user tidak berada di dalam channel
    const connection = getVoiceConnection(interaction.guild.id);

    if (!connection) {
      return interaction.reply({
        content: "Bot tidak sedang berada di dalam channel!",
        ephemeral: true,
      });
    }

    const player = connection.state.subscription?.player;

    // jika user memilih skip
    if (player) {
      player.stop();
      return interaction.reply("Lagu dilewati!");
    } else {
      return interaction.reply("Tidak ada lagu yang sedang diputar.");
    }
  },
};
