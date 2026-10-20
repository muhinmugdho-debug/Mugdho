const fs = require("fs-extra");
const request = require("request");
const path = require("path");

module.exports = {
  config: {
    name: "owner",
    version: "1.3.0",
    author: "CHUDI",
    role: 0,
    shortDescription: "Owner information with image",
    category: "Information",
    guide: {
      en: "owner"
    }
  },

  onStart: async function ({ api, event }) {
    const ownerText = 
`╭─ 👑 Oᴡɴᴇʀ Iɴғᴏ 👑 ─╮
│ 👤 Nᴀᴍᴇ       :
 ʕ •́؈•̀ ₎𖤍𝐈𝐭_𝐦𝐞_𝐌𝐔 𝐆𝐃 𝐇𝐎☠︎︎
│🧸 Nɪᴄᴋ       :
  ☕︎𝐌𝐔 𝐆𝐃 𝐇𝐎✌︎ 
│ 🎂 Aɢᴇ        :
 🔞
│ 💘 Rᴇʟᴀᴛɪᴏɴ :
 Sɪɴɢʟᴇ
│ 🎓 Pʀᴏғᴇssɪᴏɴ :
 Sᴛᴜᴅᴇɴᴛ 
│ 🏡 Lᴏᴄᴀᴛɪᴏɴ :
 𝐊𝐔𝐑𝐈𝐆𝐑𝐀𝐌   
├─ 🔗 Cᴏɴᴛᴀᴄᴛ ─╮
│ 📞 WhatsApp  :
 wa.me/+88017487**586     
╰────────────────╯`;

    const cacheDir = path.join(__dirname, "cache");
    const imgPath = path.join(cacheDir, "owner.jpg");

    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    const imgLink = "https://i.imgur.com/DMq0kM9.jpeg";

    const send = () => {
      api.sendMessage(
        {
          body: ownerText,
          attachment: fs.createReadStream(imgPath)
        },
        event.threadID,
        () => fs.unlinkSync(imgPath),
        event.messageID
      );
    };

    request(encodeURI(imgLink))
      .pipe(fs.createWriteStream(imgPath))
      .on("close", send);
  }
};
