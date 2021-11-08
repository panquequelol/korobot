// usar nodemon -e js

// ? importar fetch por que node no lo soporta
// ? importar require para que funcione en modulos, package.json tiene type: module
import fetch from 'node-fetch';
import { createRequire } from 'module';
import { resolve } from 'path';
import { url } from 'inspector';
const require = createRequire(import.meta.url);
const { MessageEmbed } = require('discord.js');

console.clear();
const Discord = require('discord.js');
const config = require('./Data/config.json');
const intents = new Discord.Intents(32767);
const client = new Discord.Client({ intents });
client.commands = new Discord.Collection();

// funcion de discord js, obtener mencion
function getUserFromMention(mention) {
	if (!mention) return;

	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);

		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}

		return client.users.cache.get(mention);
	}
}

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
			> **+china**, *+10000 social credits*`);
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
						ytID: vtuber.yt_video_key,
						titulo: vtuber.title,
						imagen: vtuber.channel.photo,
						viewers: vtuber.live_viewers,
					}));

					message.reply(` > ** ★ Están en stream... **`);
					envivo.forEach((vtuber) => {
						let embedTitulo = new MessageEmbed()
							.setTitle(`🔗${vtuber.titulo}`)
							.setURL(vtuber.link)
							.setAuthor(
								`${vtuber.nombre} con ${vtuber.viewers} viewers`,
								vtuber.imagen
							)
							.setThumbnail(
								`https://i.ytimg.com/vi/${vtuber.ytID}/default.jpg`
							);

						message.channel.send({ embeds: [embedTitulo] });
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
						nombre:
							vtuber.channel.name.split(' ').length >= 2
								? `${vtuber.channel.name.split(' ')[0]} ${
										vtuber.channel.name.split(' ')[1]
								  }`
								: vtuber.channel.name.split(' ')[0],
						link: `https://www.youtube.com/watch?v=${vtuber.yt_video_key}`,
						fecha: vtuber.live_schedule,
						ytID: vtuber.yt_video_key,
						titulo: vtuber.title,
						imagen: vtuber.channel.photo,
					}));

					// data.upcoming.live_schedule
					// 2022-09-15T10:00:00.000Z

					const d = new Date();
					let monthNow = d.getMonth() + 1,
						yearNow = d.getFullYear() * 1,
						dayNow = d.getDate() * 1,
						meses = {
							1: 'enero',
							2: 'febrero',
							3: 'marzo',
							4: 'abril',
							5: 'mayo',
							6: 'junio',
							7: 'julio',
							8: 'agosto',
							9: 'septiembre',
							10: 'octubre',
							11: 'noviembre',
							12: 'diciembre',
						};
					const monthStreamWords = meses[monthNow];

					message.reply(` > ** ★ Comenzaran sus streams aproximamente...  **`);
					estaUpcoming.forEach((vtuber) => {
						let monthStream = vtuber.fecha.substring(5, 7) * 1,
							yearStream = vtuber.fecha.substring(0, 4) * 1,
							dayStream = vtuber.fecha.substring(8, 10) * 1;

						if (monthNow === monthStream && yearNow === yearStream) {
							if (dayNow === dayStream || dayNow === dayStream + 1) {
								let embedTitulo = new MessageEmbed()
									.setTitle(`🔗${vtuber.titulo}`)
									.setURL(vtuber.link)
									.setAuthor(
										`${vtuber.nombre} empieza el ${dayStream} de ${monthStreamWords}`,
										vtuber.imagen
									)
									.setThumbnail(
										`https://i.ytimg.com/vi/${vtuber.ytID}/default.jpg`
									);

								message.channel.send({ embeds: [embedTitulo] });
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
