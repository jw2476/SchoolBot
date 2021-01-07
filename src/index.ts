import {CategoryChannel, Client} from 'discord.js'
import {config} from 'dotenv'
import {Class} from './model/class'
import {connect} from "mongoose"

config()
connect(`mongodb+srv://bot:${process.env.PASSWORD}@cluster0.kwcuw.mongodb.net/test?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("DB Connected")
})
const client = new Client()

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
                    allow: "VIEW_CHANNEL"
                },
                {
                    id: studentRole,
                    allow: "VIEW_CHANNEL",
                },
                {
                    id: "796709560039243796",
                    deny: "VIEW_CHANNEL"
                }
            ]
        })
        const mainVC = await msg.guild.channels.create("Classroom", {
            type: "voice",
            parent: category,
            permissionOverwrites: [
                {
                    id: studentRole,
                    deny: "SPEAK"
                }
            ]
        })

        await msg.member.roles.add(teacherRole)
        await new Class({
            name: className.toLowerCase(),
            category: category.id,
            teacherRole: teacherRole.id,
            studentRole: studentRole.id,
            host: msg.author.id
        }).save()

        await msg.reply(`Classroom ${className} has been created, now join the classroom voice chat!`)
    } else if (msg.content.split(" ")[0] == "!join") {
        const className = msg.content.split(" ")[1]

        if (!className) {
            await msg.channel.send("Please send your class code like `!join 10x/M1`")
            return
        }

        Class.findOne({name: className.toLowerCase()}, async (err, classroom) => {
            if (err) { console.error(err); return }
            const studentRole = await msg.guild.roles.fetch(classroom.studentRole)
            await msg.member.roles.add(studentRole)
            await msg.reply("Please now join the Classroom Voice Chat")
        })
    } else if (msg.content.split(" ")[0] == "!delete") {
        Class.findOne({host: msg.author.id}, async (err, classroom) => {
            if (err) {console.error(err); return}

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
        await msg.channel.send("You do not have a classroom yet, create one with `!create`")
    }
})
client.login(process.env.TOKEN).then()
