const axios = require('axios');
const cheerio = require('cheerio');

const page_url = 'https://www.2ememain.be/l/informatique-logiciels/portables-et-notebooks/p/1/#Language:fr-BE|postcode:6061';

async function getNotebooks() {
    const {data} = await axios.get(page_url);
    const $=cheerio.load(data);
    //#content > div.mp-Page-element.mp-Page-element--main
    const table = $('ul.mp-Listings.mp-Listings--list-view');
    table.find('li').each((i, element) => {
        
        const $element = $(element);
         //element.children[0].nodeValue()
        console.log($element.text());
        
        console.log('##########################################################################################################');
    });
    

}

getNotebooks();