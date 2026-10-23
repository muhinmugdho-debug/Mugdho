module.exports.config = {
  name: "info",
  version: "3.0",
  author: "Mugdho",
  countDown: 0,
  role: 0,
  shortDescription: "Bot info + auto reply",
  category: "info",
  guide: "info or baby",
  hasPrefix: false
};

module.exports.onStart = async function({}) {}

// No Prefix e auto reply er jonno
module.exports.handleEvent = async function({ api, event, message }) {
    const body = event.body ? event.body.toLowerCase().trim() : "";
    if(event.senderID == api.getCurrentUserID()) return;
    
    if(body == "info" || body == "baby" || body == "bot"){
      const imgUrl = "https://i.imgur.com/yAInnf2.jpeg"; // <-- TOR PIC ER LINK
      const msg = `👶 𝗕𝗢𝗧 𝗜𝗡𝗙𝗢 𝗩3.0 👶\n\n` +
                  `**Name:** Mugdho BOT\n` +
                  `**Version:** 3.0\n` +
                  `**Author:** Mugdho\n` +
                  `**Status:** Online 🟢\n\n` +
                  `Ki korba sona? 🥰`;
      
      try {
        const img = await global.utils.getStreamFromURL(imgUrl);
        return message.reply({ body: msg, attachment: img });
      } catch {
        return message.reply(msg);
      }
    }
}

module.exports.run = async function({}) {}
