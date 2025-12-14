# 🎵 Discord Music Bot

Bot musik Discord sederhana namun canggih, dibuat dengan **Discord.js** dan **Youtube-dl-exec**. Mendukung pemutaran dari YouTube, Spotify (Bridge), dan SoundCloud.

## ✨ Fitur

- **Pemutaran Multi-Source**:
  - **YouTube**: Putar lewat link atau pencarian judul lagu.
  - **Spotify**: Tempel link lagu Spotify, bot otomatis mencarikannya di YouTube.
  - **SoundCloud**: Putar langsung dari SoundCloud.
  - **Opsi Pencarian**: Gunakan `/play query: "judul" source: "Spotify"` untuk memilih sumber pencarian.
- **Kontrol Musik**:
  - `/play`: Memutar lagu.
  - `/stop`: Menghentikan bot dan keluar dari Voice Channel.
  - `/skip`: Melewati lagu yang sedang diputar.
- **Stabil & Ringan**: Menggunakan `youtube-dl-exec` untuk streaming audio yang stabil.
- **Bahasa Indonesia**: Seluruh pesan log dan interaksi dalam Bahasa Indonesia.

## 🚀 Cara Menjalankan (Lokal)

1.  **Clone Repo ini**

    ```bash
    git clone https://github.com/username/repo-anda.git
    cd repo-anda
    ```

2.  **Install Dependencies**
    Pastikan Anda sudah menginstall [Node.js](https://nodejs.org/).

    ```bash
    npm install
    ```

3.  **Konfigurasi Environment (.env)**
    Buat file bernama `.env` di folder utama, lalu isi dengan token bot Anda:

    ```env
    DISCORD_TOKEN=token_bot_anda_disini
    CLIENT_ID=client_id_bot_anda_disini
    ```

4.  **Daftarkan Commands** (Jalankan sekali saja atau jika ada command baru)

    ```bash
    node deploy-commands.js
    ```

5.  **Jalankan Bot**
    ```bash
    npm start
    ```

## 🛠️ Teknologi yang Digunakan

- [discord.js](https://discord.js.org/) - Library utama Discord bot.
- [@discordjs/voice](https://discord.js.org/) - Menangani koneksi suara.
- [youtube-dl-exec](https://github.com/microlinkhq/youtube-dl-exec) - Wrapper yt-dlp untuk streaming audio.
- [play-dl](https://play-dl.github.io/) - Pencarian metadata YouTube/Spotify/SoundCloud.

## 📝 Lisensi

Project ini bersifat open-source. Silakan digunakan dan dimodifikasi!
