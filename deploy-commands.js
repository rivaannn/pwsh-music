import { REST, Routes } from "discord.js";
import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { logger } from "./src/utils/logger.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const commandsPath = path.join(__dirname, "src", "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

const commands = [];

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = await import(pathToFileURL(filePath).href);
  if ("data" in command.default && "execute" in command.default) {
    commands.push(command.default.data.toJSON());
  } else {
    logger.warn(
      `Command di ${filePath} tidak memiliki properti "data" atau "execute".`
    );
  }
}

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    logger.info(
      `Memulai pendaftaran ulang ${commands.length} application (/) commands.`
    );

    const data = await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );

    logger.success(
      `Berhasil memuat ulang ${data.length} application (/) commands.`
    );
  } catch (error) {
    logger.error(error);
  }
})();
