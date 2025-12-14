import { Events } from "discord.js";

export default {
  name: Events.InteractionCreate,
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
      console.error(
        `Tidak ada command yang cocok dengan ${interaction.commandName} ditemukan.`
      );
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "Terjadi kesalahan saat mengeksekusi command ini!",
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: "Terjadi kesalahan saat mengeksekusi command ini!",
          ephemeral: true,
        });
      }
    }
  },
};
