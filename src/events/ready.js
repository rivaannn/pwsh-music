import { Events } from "discord.js";
import { logger } from "../utils/logger.js";

export default {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    logger.success(`Bot aktif sebagai ${client.user.tag}`);
  },
};
