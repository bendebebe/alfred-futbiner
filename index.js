'use strict';
const alfy = require('alfy');
const axios = require('axios');

(async () => {
	const data = await alfy.fetch('https://www.futbin.com/search', {
		query: {
            year: 21,
            extra: 1,
            v: 1,
			term: alfy.input
        },
        json: true,
        cache: false
	});


	const items = data.results.map(async player => {
        const player_id = player.image.match(/\d*\.png/)[0].split('.')[0];
        const prices = await axios.get('https://www.futbin.com/21/playerPrices?player=' + player_id)[player_id][prices];

        const title = Buffer.from((await axios.get(player.club_image, {
            responseType: 'arraybuffer'
        })).data, 'binary').toString('base64');

        title += ' ' + Buffer.from((await axios.get(player.nation_image, {
            responseType: 'arraybuffer'
        })).data, 'binary').toString('base64');
        
        title += ' ' + Buffer.from((await axios.get(player.image, {
            responseType: 'arraybuffer'
        })).data, 'binary').toString('base64');

        title += ' ' + player.full_name + `(${player.position}) - ${player.rating}`;

        const subtitle = `XBOX: ${prices['xbox']['LCPrice']} (Updated: ${prices['xbox']['updated']}), `
        subtitle += `PS: ${prices['ps']['LCPrice']} (Updated: ${prices['ps']['updated']}), `
        subtitle += `PC: ${prices['pc']['LCPrice']} (Updated: ${prices['pc']['updated']})`


		return {
            title: title,
            subtitle: subtitle,
			arg: player_id,
			icon: {
				path: 'icon.png' // Hide icon
			}
		};
	});

	alfy.output(items);
})();
