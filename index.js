'use strict';
const alfy = require('alfy');
const axios = require('axios');

(async () => {
    if (alfy.input.replace(' ', '').length < 3) {
        alfy.output([{
            title: 'Type more characters to narrow down search',
            subtitle: 'Must type 3 or more characters',
			icon: {
				path: 'icon.png' // Hide icon
			}
        }]);
        return;
    }
	let data = await alfy.fetch('https://www.futbin.com/search', {
		query: {
            year: 21,
            extra: 1,
            v: 1,
			term: alfy.input
        },
        json: false
    });

    
    if (JSON.parse(data.replace('\n', ''))['error']) {
        alfy.output([{
            title: 'Player not found',
            subtitle: 'Error: ' + JSON.parse(data.replace('\n', ''))['error'],
			icon: {
				path: 'icon.png' // Hide icon
			}
        }]);
        return;
    }

    let output = [];
	for (const player of JSON.parse(data.replace('\n', ''))) {
        const player_id = player.image.match(/\d*\.png/)[0].split('.')[0];
        let prices = await axios.get('https://www.futbin.com/21/playerPrices?player=' + player_id);
        prices = prices['data'][player_id]['prices'];

        // let title = Buffer.from((await axios.get(player.club_image, {
        //     responseType: 'arraybuffer'
        // })).data, 'binary').toString('base64');

        // title += ' ' + Buffer.from((await axios.get(player.nation_image, {
        //     responseType: 'arraybuffer'
        // })).data, 'binary').toString('base64');
        
        // title += ' ' + Buffer.from((await axios.get(player.image, {
        //     responseType: 'arraybuffer'
        // })).data, 'binary').toString('base64');

        let title = player.full_name + ` (${player.position}) - ${player.rating}`;

        // let subtitle = `XBOX: ${prices['xbox']['LCPrice']} (Updated: ${prices['xbox']['updated']}), `
        // subtitle += `PS: ${prices['ps']['LCPrice']} (Updated: ${prices['ps']['updated']}), `
        // subtitle += `PC: ${prices['pc']['LCPrice']} (Updated: ${prices['pc']['updated']})`

        let subtitle = `XBOX: ${prices['xbox']['LCPrice']} | `
        subtitle += `PS: ${prices['ps']['LCPrice']} | `
        subtitle += `PC: ${prices['pc']['LCPrice']}`

		output.push({
            title: title,
            subtitle: subtitle,
			arg: 'https://www.futbin.com/21/player/542/' + player_id,
			icon: {
				path: 'icon.png' // Hide icon
			}
		});
    };
    
	alfy.output(output);
})();
