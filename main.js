const axios = require('axios');
const cheerio = require('cheerio');

const page_url = 'https://www.2ememain.be/l/informatique-logiciels/portables-et-notebooks/p/1/#Language:fr-BE|postcode:6061|limit:100';

async function getNotebooks() {
    const {data} = await axios.get(page_url);
    const $=cheerio.load(data);
    const pagination = $('.mp-PaginationControls');
    //console.log(pagination);
    //#content > div.mp-Page-element.mp-Page-element--main
    const spans = $('.mp-Filter-counter');
    const $spans = $($(spans).contents()[2]);
    
    console.log($spans.text());
    const table = $('ul.mp-Listings.mp-Listings--list-view');
    //const table = $('.mp-Listing--list-item');
    table.find('.mp-Listing--list-item').each((i, element) => {
        
        const $element = $(element);
         //element.children[0].nodeValue()
        console.log($element.find('.mp-Listing-title').text());
        console.log($element.find('.mp-text-price-label').text());
        
        //console.log('##########################################################################################################');
    });
    

}

getNotebooks();