import { SlashCommandBuilder } from "discord.js";
import { getVoiceConnection } from "@discordjs/voice";

export default {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Hentikan musik dan keluar dari channel"),

  async execute(interaction) {
    const connection = getVoiceConnection(interaction.guild.id);

    // jika tidak ada koneksi
    if (!connection) {
      return interaction.reply({
        content: "Bot tidak sedang berada di dalam channel!",
        ephemeral: true,
      });
    }

    connection.destroy();

    return interaction.reply("Musik dihentikan dan bot keluar dari channel.");
  },
};
