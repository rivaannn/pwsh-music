import { SlashCommandBuilder } from "discord.js";
import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
} from "@discordjs/voice";
import play from "play-dl";
import youtubedl from "youtube-dl-exec";
import { logger } from "../utils/logger.js";

const players = new Map();

export default {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Putar musik dari YouTube")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("Judul lagu atau URL")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("source")
        .setDescription("Pilih sumber pencarian (Default: YouTube)")
        .setRequired(false)
        .addChoices(
          { name: "YouTube", value: "youtube" },
          { name: "Spotify", value: "spotify" },
          { name: "SoundCloud", value: "soundcloud" }
        )
    ),
  async execute(interaction) {
    const query = interaction.options.getString("query");
    const source = interaction.options.getString("source") || "youtube";
    const channel = interaction.member.voice.channel;

    if (!channel)
      return interaction.reply({
        content: "Masuk ke voice channel terlebih dahulu.",
        ephemeral: true,
      });

    await interaction.deferReply();

    try {
      let url = query;

      // jika link spotify
      if (play.sp_validate(url) === "track") {
        logger.info(`Processing Spotify Link: ${url}`);
        const spData = await play.spotify(url);
        const searchTerm = `${spData.name} - ${spData.artists[0].name}`;

        const searchResult = await play.search(searchTerm, {
          limit: 1,
          source: { youtube: "video" },
        });

        if (searchResult.length === 0)
          return interaction.editReply(
            "Lagu Spotify tidak ditemukan di YouTube."
          );

        url = searchResult[0].url;
        await interaction.editReply(`Memainkan (Spotify): **${spData.name}**`);
      } else if (!url.startsWith("http")) {
        logger.info(`Searching (${source}): ${query}`);

        // jika source spotify
        if (source === "spotify") {
          const spRes = await play.search(query, {
            limit: 1,
            source: { spotify: "track" },
          });
          if (spRes.length === 0)
            return interaction.editReply("Spotify: Lagu tidak ditemukan.");

          const bridgeTerm = `${spRes[0].name} - ${spRes[0].artists[0].name}`;
          const ytRes = await play.search(bridgeTerm, {
            limit: 1,
            source: { youtube: "video" },
          });
          if (ytRes.length === 0)
            return interaction.editReply("Gagal bridging ke YouTube.");

          url = ytRes[0].url;
          await interaction.editReply(
            `Memainkan (Spotify): **${spRes[0].name}**`
          );

          // jika source soundcloud
        } else if (source === "soundcloud") {
          const scRes = await play.search(query, {
            limit: 1,
            source: { soundcloud: "tracks" },
          });
          if (scRes.length === 0)
            return interaction.editReply("SoundCloud: Lagu tidak ditemukan.");

          url = scRes[0].url;
          await interaction.editReply(
            `Memainkan (SoundCloud): **${scRes[0].name}**`
          );

          // jika source default
        } else {
          const ytRes = await play.search(query, {
            limit: 1,
            source: { youtube: "video" },
          });
          if (ytRes.length === 0)
            return interaction.editReply("YouTube: Lagu tidak ditemukan.");

          url = ytRes[0].url;
        }
      }

      logger.info(`Streaming URL: ${url}`);

      const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator,
      });

      const process = youtubedl.exec(
        url,
        {
          output: "-",
          format: "bestaudio",
          limitRate: "1M",
          rmCacheDir: true,
          noWarnings: true,
          noProgress: true,
        },
        { stdio: ["ignore", "pipe", "inherit"] }
      );

      const stream = process.stdout;
      if (!stream) throw new Error("Gagal membuat stream");

      const resource = createAudioResource(stream);
      const player = createAudioPlayer();

      player.play(resource);
      connection.subscribe(player);
      players.set(interaction.guild.id, player);

      // jika belum reply
      if (!interaction.replied)
        await interaction.editReply(`Memutar: **${url}**`);
    } catch (error) {
      logger.error(`Play Error: ${error}`);
      await interaction.editReply("Terjadi kesalahan saat memutar lagu.");
    }
  },
};
