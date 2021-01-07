import {CategoryChannel, Client, VoiceChannel} from 'discord.js'
import {config} from 'dotenv'
import {Class} from './model/class'
import {connect} from "mongoose"

config()
connect(`mongodb+srv://bot:${process.env.PASSWORD}@cluster0.kwcuw.mongodb.net/test?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("DB Connected")
})
const client = new Client()

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

client.on("ready", async () => {
    console.log("Ready!")
})

client.on("message", async msg => {
    if (msg.author.bot) return
    if (!msg.content.startsWith("!")) return


    if (msg.content.split(" ")[0] == "!create") {
        const className = msg.content.split(" ")[1]

        if (!msg.member.hasPermission("MANAGE_MESSAGES")) {
            await msg.channel.send("You are not a teacher!")
            return
        }

        if (!className) {
            await msg.reply("Please supply a class code, like 10x/M1.")
            return
        }


        const teacherRole = await msg.guild.roles.create({
            data: {
                name: className + " (Teacher)",
                color: "GREEN"
            }
        })
        const studentRole = await msg.guild.roles.create({
            data: {
                name: className + " (Student)",
                color: "BLUE"
            }
        })
        const category = await msg.guild.channels.create(className, {
            type: "category",
            permissionOverwrites: [
                {
                    id: teacherRole,
                    allow: ["VIEW_CHANNEL", "CONNECT"]
                },
                {
                    id: studentRole,
                    allow: ["VIEW_CHANNEL", "CONNECT"]
                },
                {
                    id: "796709560039243796",
                    deny: ["VIEW_CHANNEL", "CONNECT"]
                }
            ]
        })
        const mainVC = await msg.guild.channels.create("Classroom", {
            type: "voice",
            parent: category,
            permissionOverwrites: [
                {
                    id: teacherRole,
                    allow: ["VIEW_CHANNEL", "CONNECT"]
                },
                {
                    id: studentRole,
                    allow: ["VIEW_CHANNEL", "CONNECT"],
                    deny: "SPEAK"
                },
                {
                    id: "796709560039243796",
                    deny: ["VIEW_CHANNEL", "CONNECT"]
                }
            ]
        })

        await msg.member.roles.add(teacherRole)
        await new Class({
            name: className.toLowerCase(),
            category: category.id,
            teacherRole: teacherRole.id,
            studentRole: studentRole.id,
            host: msg.author.id,
            mainVC: mainVC.id
        }).save()

        await msg.reply(`Classroom ${className} has been created, now join the classroom voice chat!`)
    } else if (msg.content.split(" ")[0] == "!join") {
        const className = msg.content.split(" ")[1]

        if (!className) {
            await msg.channel.send("Please send your class code like `!join 10x/M1`")
            return
        }

        Class.findOne({name: className.toLowerCase()}, async (err, classroom) => {
            if (err) {
                console.error(err);
                return
            }
            const studentRole = await msg.guild.roles.fetch(classroom.studentRole)
            await msg.member.roles.add(studentRole)
            await msg.reply("Please now join the Classroom Voice Chat")
        })
    } else if (msg.content.split(" ")[0] == "!delete") {
        Class.findOne({host: msg.author.id}, async (err, classroom) => {
            if (err) {
                console.error(err);
                return
            }

            const category = msg.guild.channels.resolve(classroom.category) as CategoryChannel
            if (category.type == "category") {
                category.children.forEach(channel => channel.delete())
            }
            await category.delete()

            const teacherRole = await msg.guild.roles.fetch(classroom.teacherRole)
            const studentRole = await msg.guild.roles.fetch(classroom.studentRole)

            await teacherRole.delete()
            await studentRole.delete()

            await classroom.deleteOne()
            await msg.channel.send("Classroom deleted")
            return
        })

    } else if (msg.content.split(" ")[0] == "!createTables") {
        const splitMessage = msg.content.split(" ")

        let tableCount
        let automate = false

        if (splitMessage.length == 1) {
            await msg.reply("Please supply the amount of tables you would like to use, eg !createTables 6")
            return
        } if (splitMessage.length > 1) {
            try {
                tableCount = parseInt(splitMessage[1])
            } catch (e) {
                await msg.reply("Please send the amount of tables as a number, eg !tables 6")
                return
            }
        } if (splitMessage.length > 2) {
            if (splitMessage[2].toLowerCase() === "yes") automate = true
            else if (splitMessage[2].toLowerCase() === "no") automate = false
            else {
                await msg.reply("Please send whether you to automate the movement of students to tables as yes or no, eg !createTables 6 yes")
                return
            }
        }


        Class.findOne({host: msg.author.id}, async (err, classroom) => {
            if (err) {
                console.error(err);
                return
            }
            const mainVC = msg.guild.channels.resolve(classroom.mainVC) as VoiceChannel
            const tables: Array<VoiceChannel> = []

            for (let i = 0; i < tableCount; i++) {
                const table = await msg.guild.channels.create(`Table ${i + 1}`, {
                    parent: classroom.category,
                    type: "voice"
                })
                tables.push(table)
            }

            console.log(automate)
            if (automate) {
                let i = 0
                mainVC.members.forEach(member => {
                    i++
                    member.voice.setChannel(tables[i % tables.length])
                })
            }

            await msg.reply(`${tableCount} tables have been created`)
            return
        })
    } else if (msg.content.split(" ")[0] == "!deleteTables") {
        Class.findOne({host: msg.author.id}, async (err, classroom) => {
            if (err) {
                console.error(err);
                return
            }
            const category = msg.guild.channels.resolve(classroom.category) as CategoryChannel
            category.children.forEach(channel => {
                if (channel.name.startsWith("Table")) {
                    console.log("Found table")
                    const moves = channel.members.map(member => new Promise(async res => {
                        await sleep(500)
                        await member.voice.setChannel(classroom.mainVC)
                        res(null)
                    }))
                    Promise.all(moves).then(async () => {
                        await sleep(5000)
                        await channel.delete()
                    })
                }
            })

            await msg.reply("Tables have been deleted")
            return
        })
    }
})

client.login(process.env.TOKEN).then()
