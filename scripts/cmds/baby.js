const axios = require('axios');
const baseApiUrl = async () => {
    return "https://noobs-api.top/dipto";
};

module.exports.config = {
    name: "bby",
    aliases: ["baby", "Hlw", "kmon acho", "ki koro"],
    version: "6.9.0",
    author: "dipto",
    countDown: 0,
    role: 0,
    description: "better then all sim simi",
    category: "chat",
    guide: {
        en: "{pn} [anyMessage] OR\nteach [YourMessage] - [Reply1], [Reply2], [Reply3]... OR\nteach [react] [YourMessage] - [react1], [react2], [react3]... OR\nremove [YourMessage] OR\nrm [YourMessage] - [indexNumber] OR\nmsg [YourMessage] OR\nlist OR \nall OR\nedit [YourMessage] - [NeeMessage]"
    }
};

module.exports.onStart = async ({
    api,
    event,
    args,
    usersData
}) => {
    const link = `${await baseApiUrl()}/baby`;
    const dipto = args.join(" ").toLowerCase();
    const uid = event.senderID;
    let command, comd, final;

    try {
        if (!args[0]) {
            const ran = ["Bolo baby", "hum", "type help baby", "type !baby hi"];
            return api.sendMessage(ran[Math.floor(Math.random() * ran.length)], event.threadID, event.messageID);
        }

        if (args[0] === 'remove') {
            const fina = dipto.replace("remove ", "");
            const dat = (await axios.get(`${link}?remove=${fina}&senderID=${uid}`)).data.message;
            return api.sendMessage(dat, event.threadID, event.messageID);
        }

        if (args[0] === 'rm' && dipto.includes('-')) {
            const [fi, f] = dipto.replace("rm ", "").split(/\s*-\s*/);
            const da = (await axios.get(`${link}?remove=${fi}&index=${f}`)).data.message;
            return api.sendMessage(da, event.threadID, event.messageID);
        }

        if (args[0] === 'list') {
            if (args[1] === 'all') {
                const data = (await axios.get(`${link}?list=all`)).data;
                const limit = parseInt(args[2]) || 100;
                const limited = data?.teacher?.teacherList?.slice(0, limit)
                const teachers = await Promise.all(limited.map(async (item) => {
                    const number = Object.keys(item)[0];
                    const value = item[number];
                    const name = await usersData.getName(number).catch(() => number) || "Not found";
                    return {
                        name,
                        value
                    };
                }));
                teachers.sort((a, b) => b.value - a.value);
                const output = teachers.map((t, i) => `${i + 1}/ ${t.name}: ${t.value}`).join('\n');
                return api.sendMessage(`Total Teach = ${data.length}\n👑 | List of Teachers of baby\n${output}`, event.threadID, event.messageID);
            } else {
                const d = (await axios.get(`${link}?list=all`)).data;
                return api.sendMessage(`❇️ | Total Teach = ${d.length || "api off"}\n♻️ | Total Response = ${d.responseLength || "api off"}`, event.threadID, event.messageID);
            }
        }

        if (args[0] === 'msg') {
            const fuk = dipto.replace("msg ", "");
            const d = (await axios.get(`${link}?list=${fuk}`)).data.data;
            return api.sendMessage(`Message ${fuk} = ${d}`, event.threadID, event.messageID);
        }

        if (args[0] === 'edit') {
            const command = dipto.split(/\s*-\s*/)[1];
            if (command.length < 2) return api.sendMessage('❌ | Invalid format! Use edit [YourMessage] - [NewReply]', event.threadID, event.messageID);
            const dA = (await axios.get(`${link}?edit=${args[1]}&replace=${command}&senderID=${uid}`)).data.message;
            return api.sendMessage(`changed ${dA}`, event.threadID, event.messageID);
        }

        if (args[0] === 'teach' && args[1] !== 'amar' && args[1] !== 'react') {
            [comd, command] = dipto.split(/\s*-\s*/);
            final = comd.replace("teach ", "");
            if (command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
            const re = await axios.get(`${link}?teach=${final}&reply=${command}&senderID=${uid}&threadID=${event.threadID}`);
            const tex = re.data.message;
            const teacher = (await usersData.get(re.data.teacher)).name;
            return api.sendMessage(`✅ Replies added ${tex}\nTeacher: ${teacher}\nTeachs: ${re.data.teachs}`, event.threadID, event.messageID);
        }

        if (args[0] === 'teach' && args[1] === 'amar') {
            [comd, command] = dipto.split(/\s*-\s*/);
            final = comd.replace("teach ", "");
            if (command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
            const tex = (await axios.get(`${link}?teach=${final}&senderID=${uid}&reply=${command}&key=intro`)).data.message;
            return api.sendMessage(`✅ Replies added ${tex}`, event.threadID, event.messageID);
        }

        if (args[0] === 'teach' && args[1] === 'react') {
            [comd, command] = dipto.split(/\s*-\s*/);
            final = comd.replace("teach react ", "");
            if (command.length < 2) return api.sendMessage('❌ | Invalid format!', event.threadID, event.messageID);
            const tex = (await axios.get(`${link}?teach=${final}&react=${command}`)).data.message;
            return api.sendMessage(`✅ Replies added ${tex}`, event.threadID, event.messageID);
        }

        if (dipto.includes('amar name ki') || dipto.includes('amr nam ki') || dipto.includes('amar nam ki') || dipto.includes('amr name ki') || dipto.includes('whats my name')) {
            const data = (await axios.get(`${link}?text=amar name ki&senderID=${uid}&key=intro`)).data.reply;
            return api.sendMessage(data, event.threadID, event.messageID);
        }

        const d = (await axios.get(`${link}?text=${dipto}&senderID=${uid}&font=1`)).data.reply;
        api.sendMessage(d, event.threadID, (error, info) => {
            global.GoatBot.onReply.set(info.messageID, {
                commandName: this.config.name,
                type: "reply",
                messageID: info.messageID,
                author: event.senderID,
                d,
                apiUrl: link
            });
        }, event.messageID);

    } catch (e) {
        console.log(e);
        api.sendMessage("Check console for error", event.threadID, event.messageID);
    }
};

module.exports.onReply = async ({
    api,
    event,
    Reply
}) => {
   
    if ([api.getCurrentUserID()].includes(event.senderID)) return;
  
    try {
        if (event.type == "message_reply") {
            const a = (await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(event.body?.toLowerCase())}&senderID=${event.senderID}&font=1`)).data.reply;
            await api.sendMessage(a, event.threadID, (error, info) => {
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: this.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    author: event.senderID,
                    a
                });
            }, event.messageID);
        }
    } catch (err) {
        return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
    }
};

module.exports.onChat = async ({
    api,
    event,
    message
}) => {
    try {
        const body = event.body ? event.body?.toLowerCase() : ""
        if (body.startsWith("baby") || body.startsWith("bby") || body.startsWith("rocky") || body.startsWith("jan") || body.startsWith("babu") || body.startsWith("janu")) {
            const arr = body.replace(/^\S+\s*/, "")
            const randomReplies = ["🌻🌺💚 আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ 💚🌺🌻",
"নদীর বুকে চর সামনে থেকে সর 😒 🦋⃟≛⃝ 🐸",
"আমি এখন বস 𝐈𝐭_𝐦𝐞_𝐌𝐔 𝐆𝐃 𝐇𝐎 এর সাথে বিজি আছি, আমাকে ডাকবেন না 😕😏 ধন্যবাদ 🤝🌻",
"আমাকে না ডেকে আমার বস 𝐈𝐭_𝐦𝐞_𝐌𝐔 𝐆𝐃 𝐇𝐎 কে মেনশন দেও 😽🫶🌺",
"ঝাং থুমালে আইলাপিউ পেপি 💝😽",
"উফফ! বুঝলাম না, এত ডাকছেন কেন? 😤😡😈",
"জান, তোমার নানিরে আমার হাতে তুলে দিবা 🙊🙆‍♂️",
"আজকে আমার মন ভালো নেই, তাই আমারে ডাকবেন না 😪🤧",
"ঝাং 🫵 থুমালে য়ামি রাইতে পালুপাসি উম্মম্মাহ 🌺🤤💦",
"চুনা ও চুনা, আমার বস 𝐈𝐭_𝐦𝐞_𝐌𝐔 𝐆𝐃 𝐇𝐎 এর হবু বউরে কেউ দেখছো? খুঁজে পাচ্ছি না 😪🤧😭",
"স্বপ্ন তোমারে নিয়ে দেখতে চাই, তুমি যদি আমার হয়ে থেকে যাও 💝🌺🌻",
"একটা সত্যি কথা বলি,তুমি দেখতে অনেক cute pakhi 🙊😝🌻",
"উফফ, আমাকে ডাকছো কেন। তুমি কি দেখতে পারছো না umme or jisan দুইজন দুইজনকে অনেক ভালোবাসে 🐥🐤🐣🐼। আর mugdho or jisan lucchami করছে 🫠😽",
"ইসস! এত ডাকো কেন? লজ্জা লাগে তো 🙈🖤🌼",
"আমার এবং এই  group er member কাছ থেকে 🥰😽🫶 সালাম এবং ভালোবাসা  💝💚🌺🌻",
"ভালোবাসা নামক আবলামি করতে মন চাইলে আমার বস 𝐈𝐭_𝐦𝐞_𝐌𝐔 𝐆𝐃 𝐇𝐎 এর ইনবক্সে চলে যাও 🙊🥱👅 🌻 𝐅𝐀𝐂𝐄𝐁𝐎𝐎𝐊 𝐈𝐃 𝐋𝐈𝐍𝐊 🌻: https://www.facebook.com/share/1CWyr1aUTk/",
"জান, তুমি শুধু আমার। আমি তোমারে ৩৬৫ দিন ভালোবাসি 💝🌺😽",
"তোরে বলতাছি,umme re vabi bol  🐣🐤🐥",
"আন্টি 🙆 আপনার মেয়ে 👰‍♀️ রাতে আমারে ভিডিও কল দিতে বলে 🫣🥵🤤💦",
"আমার সাথে কথা বলো 🥺🥹 যা চাইবা তাই দিবো? 🤏🏻🙂",
"আপনার সুন্দরী বান্ধবীকে ফিতরা হিসেবে আমার বস𝐈𝐭_𝐦𝐞_𝐌𝐔 𝐆𝐃 𝐇𝐎 কে দান করেন 🥱🐰🍒",
"ও মিম, ও মিম 😇 তুমি কেন চুরি করলা সাদিয়ার ফর্সা হওয়ার ক্রিম 🌚🤧",
"অনুমতি দিলাম,সবাই আমার বস 𝐈𝐭_𝐦𝐞_𝐌𝐔 𝐆𝐃 𝐇𝐎 এর সাথে কথা বলো এবং তার সুনাম করো সে খুশি হয়ে তুমাদের কে সালামি দিবে 🐸😾🔪",
"𝙂𝙖𝙮𝙚𝙨 🤗 যৌবনের কসম দিয়ে আমারে 𝐁𝐥𝐚𝐜𝐤𝐦𝐚𝐢𝐥 করা হচ্ছে 🥲🤦‍♂️🤧",
"𝗢𝗶𝗶 আন্টি 🙆‍♂️ তোমার মেয়ে চোখ মারে 🥺🥴🐸",
"তাকাই আছো কেন? চুমু দিবা? 🙄🐸😘",
"আজকে প্রপোজ করে দেখো, রাজি হইয়া যামু 😌🤗😇",
"আমার গল্পে তোমার নানি সেরা 🙊🙆‍♂️🤗",
"কী ব্যাপার, আপনি শ্বশুরবাড়িতে যাচ্ছেন না কেন? 🤔🥱🌻",
"দিনশেষে পরের 𝐁𝐎𝐖 সুন্দর ☹️🤧",
"তাবিজ কইরা হইলেও ফ্রেম একখান করমুই, তাতে যা হই হোক 🤧🥱🌻",
"ছোটবেলা ভাবতাম বিয়ে করলে অটোমেটিক বাচ্চা হয় 🥱 ওমা! এখন দেখি কাহিনি অন্যরকম 😦🙂🌻",
"আজ একটা বিন নেই বলে ফেসবুকের নাগিনগুলারে আমার বস 𝐈𝐭_𝐦𝐞_𝐌𝐔 𝐆𝐃 𝐇𝐎 ধরতে পারছে না 🤧🐸🥲",
"চলো সবাই মিলে গান বলি। এবং সুন্দর একটা family তৈরি করি 🥰🐸⚒️",
"যে ছেড়ে গেছে 😔 তাকে ভুলে যাও 🙂 আমার বস 𝐈𝐭_𝐦𝐞_𝐌𝐔 𝐆𝐃 𝐇𝐎 এর সাথে প্রেম করে তাকে দেখিয়ে দাও 🙈🐸🤗",
"হাজারো লুচ্চা-লুচ্চির ভিড়ে 🙊🐣 আমার বস 𝐈𝐭_𝐦𝐞_𝐌𝐔 𝐆𝐃 𝐇𝐎 এক নিষ্পাপ ভালো মানুষ 🥱🤗🙆‍♂️",
"রূপের অহংকার করো না 🙂❤️ চকচকে সূর্যটাও দিনশেষে অন্ধকারে পরিণত হয় 🤗💜",
"সুন্দর মাইয়া মানেই 🥱 আমার বস𝐈𝐭_𝐦𝐞_𝐌𝐔 𝐆𝐃 𝐇𝐎 এর বউ 😽🫶 আর বাকিগুলো আমার বেয়াইন 🙈🐸🤗",
"এত অহংকার করে লাভ নেই 🌸 মৃত্যুটা নিশ্চিত, শুধু সময়টা অনিশ্চিত 🖤🙂",
"দিন দিন কিছু মানুষের কাছে অপ্রিয় হয়ে যাইতেছি 🙂😿🌸",
"হুদাই আমারে শয়তানে লারে 😝😑☹️",
"𝗜 𝗟𝗢𝗩𝗢 𝗬𝗢𝗨 😽 আহারে, ভাবছো তোমারে প্রপোজ করছি? 🥴 থাপ্পড় দিয়া কিডনি লক করে দিব 😒 ভুল পড়া বের করে দিবো 🤭🐸",
"আমি একটা দুধের শিশু 😇 🫵 𝗬𝗢𝗨 🐸💦",
"কতদিন হয়ে গেল বিছনায় মুতি না 😿 মিস ইউ নেংটা কাল 🥺🤧",
"বালিকা 👸 𝐃𝐨 𝐲𝐨𝐮 🫵 বিয়া 𝐦𝐞? 😽 আমি তোমাকে 😻 আম্মু হইতে সাহায্য করব 🙈🥱",
"এই আন্টির মেয়ে 🫢🙈 𝐔𝐦𝐦𝐦𝐦𝐦𝐦𝐦𝐦𝐦𝐦𝐦𝐚𝐡 😽🫶 আসলেই তো স্বাদ 🥵💦 এত স্বাদ কেন? 🤔 সেই স্বাদ 😋",
"ইস! কেউ যদি বলতো 🙂 আমার শুধু তোমাকেই লাগবে 💜🌸",
"ওই ভাবি, কেমন আছো আমার বস 𝐈𝐭_𝐦𝐞_𝐌𝐔 𝐆𝐃 𝐇𝐎 কে একটা সালাম দিয়ে যাও 🙃 সালাম দেওয়া অনেক ভালো? 🙄🤦‍♂️ না হলে আমার বস অনেক মন খারাপ করবে 🥺🤦‍♂️ আমার বস 𝐈𝐭_𝐦𝐞_𝐌𝐔 𝐆𝐃 𝐇𝐎 কে জানে মারার কী দরকার 🙄🤧",
"একদিন সে ঠিকই ফিরে তাকাবে 😇 আর মুচকি হেসে বলবে, ওর মতো আর কেউ ভালোবাসেনি 🙂😅",
"হুদাই গ্রুপে আছি 🥺🐸 কেউ ইনবক্সে নক দিয়ে বলে না, জান তোমারে আমি অনেক ভালোবাসি 🥺🤧",
"কিরে, গ্রুপে দেখি একটাও বেডি নাই 🤦‍♂️🥱💦",
"দেশের সবকিছুই চুরি হচ্ছে 🙄 শুধু আমার বস 𝐈𝐭_𝐦𝐞_𝐌𝐔 𝐆𝐃 𝐇𝐎 এর মনটা ছাড়া 🥴😑😏",
"🫵 তোমারে প্রচুর ভাল্লাগে 😽 সময়মতো প্রপোজ করমু, বুঝছো? 🔨😼 ছিট খালি রাইখো 🥱🐸🥵",
"আজ থেকে আর কাউকে পাত্তা দিমু না 😏 কারণ আমি ফর্সা হওয়ার ক্রিম কিনছি 🙂🐸"];
            if (!arr) {

                await api.sendMessage(randomReplies[Math.floor(Math.random() * randomReplies.length)], event.threadID, (error, info) => {
                    if (!info) message.reply("info obj not found")
                    global.GoatBot.onReply.set(info.messageID, {
                        commandName: this.config.name,
                        type: "reply",
                        messageID: info.messageID,
                        author: event.senderID
                    });
                }, event.messageID)
            }
            const a = (await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(arr)}&senderID=${event.senderID}&font=1`)).data.reply;
            await api.sendMessage(a, event.threadID, (error, info) => {
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: this.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    author: event.senderID,
                    a
                });
            }, event.messageID)
        }
    } catch (err) {
        return api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
    }
};
