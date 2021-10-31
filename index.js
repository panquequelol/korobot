// usar nodemon -e js

// ? importar fetch por que node no lo soporta
// ? importar require para que funcione en modulos, package.json tiene type: module
import fetch from 'node-fetch';
import { createRequire } from 'module';
import { resolve } from 'path';
const require = createRequire(import.meta.url);
const { MessageEmbed } = require('discord.js');

console.clear();
const Discord = require('discord.js');
const config = require('./Data/config.json');
const intents = new Discord.Intents(32767);
const client = new Discord.Client({ intents });
client.commands = new Discord.Collection();

client.on('ready', () => {
	console.log('bot prendido');
	client.user.setActivity('+help');
});

client.on('messageCreate', (message) => {
	if (!message.content.startsWith(config.prefix)) return;

	const argumentos = message.content
		.substring(config.prefix.length)
		.split(/ +/);

	switch (argumentos[0]) {
		case 'help':
			message.reply(`**Comandos:** 
			> **+online**, *muestra que vtubers estan streameando*
			> **+upcoming**, *muestra streams de vtubers mas proximos*
			> **+taiwan**, *-10000 social credits*
			> **+china**, *+10000 social credits*
			> **+4k @user**, *caught in 4k*`);
			break;

		case 'taiwan':
			message.reply({
				files: ['https://i.ytimg.com/vi/LFSDvqvZxF8/hqdefault.jpg'],
			});
			break;

		case 'china':
			message.reply({
				files: [
					'https://i.kym-cdn.com/photos/images/newsfeed/002/121/094/076.jpg',
				],
			});
			break;

		case '4k':
			message.channel.send(
				`${message.author.username} atrapo en 4k a ${argumentos[1]}`
			);
			message.channel.send({
				files: ['https://c.tenor.com/bE4ROSkkHRcAAAAd/korone-hololive.gif'],
			});
			break;

		case 'online':
			const quienOnline = async () => {
				try {
					const respuesta = await fetch('https://api.holotools.app/v1/live');
					const data = await respuesta.json();

					const envivo = data.live.map((vtuber) => ({
						nombre: `${vtuber.channel.name.split(' ')[0]} ${
							vtuber.channel.name.split(' ')[1]
						}`,
						link: `https://www.youtube.com/watch?v=${vtuber.yt_video_key}`,
						titulo: vtuber.title,
					}));

					message.reply(` > ** Están en stream... **`);
					envivo.forEach((vtuber) => {
						let embedTitulo = new MessageEmbed()
							.setTitle(vtuber.titulo)
							.setURL(vtuber.link);

						// message.channel.send(
						// 	`**${vtuber.nombre}** streameando ${vtuber.titulo} en: *<${vtuber.link}>*`
						// );

						message.channel.send(
							`**${vtuber.nombre}** streameando ${{ embeds: [embedTitulo] }}>*`
						);
						channel.send({ embeds: [embedTitulo] });
						console.log({ embeds: [embedTitulo] });
					});

					// message.channel.send(`${envivo}`)
				} catch (error) {
					console.log(`hubo este error: ${error}`);
				}
			};
			quienOnline();
			break;

		case 'upcoming':
			const isUpcoming = async () => {
				try {
					const respuesta = await fetch('https://api.holotools.app/v1/live');
					const data = await respuesta.json();

					const estaUpcoming = data.upcoming.map((vtuber) => ({
						nombre: `${vtuber.channel.name.split(' ')[0]} ${
							vtuber.channel.name.split(' ')[1]
						}`,
						link: `https://www.youtube.com/watch?v=${vtuber.yt_video_key}`,
						titulo: vtuber.title,
						fecha: vtuber.live_schedule,
					}));

					// data.upcoming.live_schedule
					// 2022-09-15T10:00:00.000Z

					const d = new Date();
					let mesActual = d.getMonth() + 1,
						anhoActual = d.getFullYear() * 1,
						diaActual = d.getDate() * 1;

					message.reply(` > ** Comenzaran sus streams aproximamente...  **`);
					estaUpcoming.forEach((vtuber) => {
						let mesStream = vtuber.fecha.substring(5, 7) * 1,
							anhoStream = vtuber.fecha.substring(0, 4) * 1,
							diaStream = vtuber.fecha.substring(8, 10) * 1;

						if (mesActual === mesStream && anhoStream === anhoActual) {
							if (diaActual === diaStream || diaActual === diaStream + 1) {
								let embedTitulo = new MessageEmbed()
									.setTitle(vtuber.titulo)
									.setURL(vtuber.link);

								message.channel.send(
									`**${vtuber.nombre}** el ${diaActual}/${mesStream}`,
									{ embeds: [embedTitulo] }
								);

								// message.channel.send(
								// 	`**${vtuber.nombre}** el ${diaActual}/${mesStream} en: *<${vtuber.link}>*`
								// );
								// message.channel.send({ embeds: [embedTitulo] });
							}
						}
					});
				} catch (error) {
					console.log(`hubo este error: ${error}`);
				}
			};
			isUpcoming();
			break;
	}

	console.log(argumentos[0]);
});

client.login(process.env.token);
