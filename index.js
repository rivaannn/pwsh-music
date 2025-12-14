import { client } from "./client.js";
import "dotenv/config";
import fs from "fs";
import path from "path";
import http from "http"; // Import modul HTTP
import { fileURLToPath, pathToFileURL } from "url";
import { logger } from "./src/utils/logger.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// inisialisasi keep alive server
const port = process.env.PORT || 3000;
http
  .createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.write("Bot is alive!");
    res.end();
  })
  .listen(port, () => {
    logger.info(`Server berjalan di port ${port}`);
  });

// inisialisasi command
const commandsPath = path.join(__dirname, "src", "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

// lakukan looping untuk setiap file command yang ditemukan
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = await import(pathToFileURL(filePath).href);
  // jika command memiliki properti data dan execute
  if ("data" in command.default && "execute" in command.default) {
    client.commands.set(command.default.data.name, command.default);
  } else {
    console.log(
      `[PERINGATAN] Command di ${filePath} tidak memiliki properti "data" atau "execute" yang diperlukan.`
    );
  }
}

// inisialisasi event
const eventsPath = path.join(__dirname, "src", "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

// lakukan loop untuk setiap file event yang ditemukan
for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = await import(pathToFileURL(filePath).href);

  // jika event diset hanya jalan sekali, gunakan client.once
  if (event.default.once) {
    client.once(event.default.name, (...args) =>
      event.default.execute(...args)
    );
  } else {
    client.on(event.default.name, (...args) => event.default.execute(...args));
  }
}

client.login(process.env.DISCORD_TOKEN);
