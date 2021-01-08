import {
    CategoryChannel,
    Client,
    DMChannel,
    GuildMember,
    Message,
    MessageCollector,
    MessageEmbed,
    TextChannel,
    User,
    VoiceChannel
} from 'discord.js'
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

function input(channel: TextChannel | DMChannel, user: User, seconds): Promise<Message> {
    return new Promise(resolve => {
        const collector = new MessageCollector(channel, m => m.author.id === user.id, {time: seconds * 1000})
        collector.on("collect", msg => {
            resolve(msg)
        })
    })
}

client.on("ready", async () => {
    console.log("Ready!")
})

client.on("message", async msg => {
    if (msg.author.bot) return
    if (!msg.content.startsWith("!")) return

    const command = msg.content.split(" ")[0]

    if (command == "!create") {
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

        await sleep(5000)

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

        const text = await msg.guild.channels.create("Chat", {
            type: "text",
            parent: category
        })

        await msg.member.roles.add(teacherRole)
        await new Class({
            name: className.toLowerCase(),
            category: category.id,
            teacherRole: teacherRole.id,
            studentRole: studentRole.id,
            host: msg.author.id,
            mainVC: mainVC.id,
            text: text.id,
            raisedHands: []
        }).save()

        await msg.reply(`Classroom ${className} has been created, now join the classroom voice chat!`)
    } else if (command == "!join") {
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
    } else if (command == "!delete") {
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

    } else if (command == "!createTables") {
        const splitMessage = msg.content.split(" ")

        let tableCount
        let automate = false

        if (splitMessage.length == 1) {
            await msg.reply("Please supply the amount of tables you would like to use, eg !createTables 6")
            return
        }
        if (splitMessage.length > 1) {
            try {
                tableCount = parseInt(splitMessage[1])
            } catch (e) {
                await msg.reply("Please send the amount of tables as a number, eg !tables 6")
                return
            }
        }
        if (splitMessage.length > 2) {
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
    } else if (command == "!deleteTables") {
        Class.findOne({host: msg.author.id}, async (err, classroom) => {
            if (err) {
                console.error(err);
                return
            }
            const category = msg.guild.channels.resolve(classroom.category) as CategoryChannel
            category.children.forEach(channel => {
                if (channel.name.startsWith("Table")) {
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
    } else if (command === "!raiseHand") {
        if (msg.member.roles.highest.name.endsWith("(Student)")) {
            Class.findOne({studentRole: msg.member.roles.highest.id}, async (err, classroom) => {
                if (err) {
                    console.error(err);
                    return
                }
                const host = await msg.guild.members.fetch(classroom.host)
                const hostDM = await host.createDM(true)
                await hostDM.send(`${msg.member.displayName} has raised their hand, unmute them for a minute with !accept`)
                classroom.raisedHands.push(msg.author.id)
                await classroom.save()
            })
        } else {
            await msg.reply("You do not have a class yet, join one with !join")
        }
    } else if (command === "!accept") {
        let minutes = 1

        if (msg.content.split(" ")[1]) {
            try {
                minutes = parseInt(msg.content.split(" ")[1])
            } catch {
                await msg.reply("Please enter the minutes you want to unmute the student for as a number, for example `!accept 5`")
            }
        }

        Class.findOne({host: msg.author.id}, async (err, classroom) => {
            if (err) {
                console.error(err);
                return
            }
            if (classroom) {
                if (classroom.raisedHands.length === 0) {
                    await msg.reply("There are no raised hand at the moment!")
                } else {
                    const student = await msg.guild.members.fetch(classroom.raisedHands.pop())
                    await classroom.save()

                    await msg.reply(`${student.displayName} has been unmuted for ${minutes} minutes, there are ${classroom.raisedHands.length} raised hands left.`)

                    await student.voice.setMute(false)
                    await sleep(60 * 1000 * minutes)
                    await student.voice.setMute(true)
                }
            } else {
                await msg.reply("You do not have a classroom yet, create one with !create")
            }
        })
    } else if (command === "!unmute") {
        Class.findOne({host: msg.author.id}, async (err, classroom) => {
            if (err) {
                console.error(err);
                return
            }
            if (classroom) {
                const mainVC = msg.guild.channels.resolve(classroom.mainVC) as VoiceChannel

                let user: GuildMember | undefined

                if (msg.content.split(" ")[1]) {
                    mainVC.members.forEach(member => {
                        if (member.displayName.toLowerCase() === msg.content.slice(8).toLowerCase()) {
                            user = member
                        }
                    })
                    if (!user) {
                        await msg.reply("No user could be found with that name")
                        return
                    }
                }

                if (user) {
                    await user.voice.setMute(false)
                    await msg.reply(`${user.displayName} has been unmuted`)
                } else {
                    mainVC.members.forEach(member => {
                        member.voice.setMute(false)
                    })
                    await msg.reply("All students have been unmuted, mute them again with !mute")
                }

            } else {
                await msg.reply("You do not have a classroom yet, create one with !create")
            }
        })
    } else if (command === "!mute") {
        Class.findOne({host: msg.author.id}, async (err, classroom) => {
            if (err) {
                console.error(err);
                return
            }
            if (classroom) {
                const mainVC = msg.guild.channels.resolve(classroom.mainVC) as VoiceChannel
                mainVC.members.forEach(member => {
                    if (member.roles.highest.name.endsWith("(Student)")) {
                        member.voice.setMute(true)
                    }
                })
                await msg.reply("All students have been muted, unmute them with !unmute")
            } else {
                await msg.reply("You do not have a classroom yet, create one with !create")
            }
        })
    } else if (command === "!question") {
        Class.findOne({host: msg.author.id}, async (err, classroom) => {
            if (err) {
                console.error(err);
                return
            }
            if (classroom) {
                const question = msg.content.slice(10) // "!question " = 10
                const text = msg.guild.channels.resolve(classroom.text) as TextChannel
                const studentRole = await msg.guild.roles.fetch(classroom.studentRole)
                await text.send(`<@&${studentRole.id}> Your teacher asked: ${question}`)
                await text.send("Answer it by sending !answer")
            } else {
                await msg.reply("You do not have a classroom yet, create one with !create")
            }
        })
    } else if (command === "!answer") {
        Class.findOne({studentRole: msg.member.roles.highest.id}, async (err, classroom) => {
            if (err) {
                console.error(err);
                return
            }
            if (classroom) {
                const host = await msg.guild.members.fetch(classroom.host)
                const hostDM = await host.createDM(true)

                await hostDM.send(`${msg.member.displayName} has asked to answer the question, unmute them with !unmute ${msg.member.displayName} and re-mute them with !mute`)
            } else {
                await msg.reply("You haven't joined a classroom yet, join one with !join")
            }
        })
    } else if (command === "!ask") {
        let question

        if (msg.content.split(" ")[1]) {
            question = msg.content.slice(5)
        }

        Class.findOne({host: msg.author.id}, async (err, classroom) => {
            if (err) {
                console.error(err);
                return
            }
            if (classroom) {
                const mainVC = msg.guild.channels.resolve(classroom.mainVC)

                const teacherDM = await msg.member.createDM(true)

                mainVC.members.forEach(async member => {
                    if (member.roles.highest.name.endsWith("(Student)")) {
                        const studentDM = await member.createDM(true)

                        const status = await teacherDM.send(`${member.displayName}: Sending...`)

                        await studentDM.send(`Your teacher has asked: ${question}, type the answer below!`)

                        status.edit(`${member.displayName}: Waiting for answer...`)

                        const answer = await input(studentDM, member.user, 300)

                        status.edit(`${member.displayName}: Answered - "${answer}"`)
                    }
                })
            } else {
                await msg.reply("You haven't joined a classroom yet, join one with !join")
            }
        })
    } else if (command === "!help") {
        let embed

        if (msg.member.roles.highest.name == "Teacher") {
            embed = new MessageEmbed()
                .setTitle("School Bot Help Message (Teacher)")
                .addFields([
                    {
                        name: "!create",
                        value: "Creates a classroom, needs to have a class code, for example `!create 10x/m1`"
                    },
                    {
                        name: "!delete", value: "Deletes a classroom"
                    },
                    {
                        name: "!createTables",
                        value: "Splits the classroom into tables (smaller voice channels where students are unmuted), needs to have the amount of tables you would like, and whether you want to automate the movement of students, for example `!createTables 6 yes`"
                    },
                    {
                        name: "!deleteTables", value: "Deletes all tables"
                    },
                    {
                        name: "!mute", value: "Mutes all students in a classroom"
                    },
                    {
                        name: "!unmute", value: "Unmutes all students in a classroom, or just one person if you specify, for example `!unmute` would unmute everyone or `!unmute Tom Smith` would unmute just Tom Smith"
                    },
                    {
                        name: "!accept", value: "Temporarily unmutes a student who had raised their hand so they can ask their question, you can also specify the amount of minutes you would like to unmute them for, for example `!accept` would unmute someone for 1 minute and `!accept 5` would unmute someone for 5 minutes"
                    },
                    {
                        name: "!ask", value: "Asks all students a question and keeps the teacher updated on all students progress answering the question, you need to specify the question, for example `!ask What is 12*12?`"
                    },
                    {
                        name: "!question", value: "Asks all students a question to which a student can choose to answer, you will need to manually unmute them however, for example `!question What is the formula for kinetic energy?`"
                    }
                ])
        } else {
            embed = new MessageEmbed()
                .setTitle("School Bot Help Message")
                .addFields([
                    {
                        name: "!join",
                        value: "Join a classroom, needs your class' class code, for example `!join 10x/m1`"
                    },
                    {
                        name: "!raiseHand",
                        value: "Raises your hand showing that you would like to be unmuted to ask a question"
                    },
                    {
                        name: "!answer",
                        value: "When your teacher has asked you a question and you would like to answer it, run !answer"
                    }
                ])
        }
        await msg.channel.send(embed)
    }
})

client.on("voiceStateUpdate", async (oldVoice, newVoice) => {
    if (oldVoice.channel.id !== newVoice.channel.id && newVoice.channel.name !== "Classroom") {
        await newVoice.setMute(false)
    }
})

client.login(process.env.TOKEN).then()
