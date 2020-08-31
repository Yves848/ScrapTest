const axios = require('axios');
const cheerio = require('cheerio');
let page = 1;
let i = 0;



async function getCounters() {
    return new Promise(async resolve => {
        const page_url = `https://www.2ememain.be/l/informatique-logiciels/portables-et-notebooks/p/1/#Language:fr-BE|postcode:6061|limit:100`;
        const { data } = await axios.get(page_url);
        const $ = cheerio.load(data);
        const pagination = $('.mp-PaginationControls');
        //console.log(pagination);
        //#content > div.mp-Page-element.mp-Page-element--main
        const spans = $('.mp-Filter-counter');
        const $spans = $($(spans).contents()[2]);
        const counter = $spans.text();
        resolve(counter);
    });
}

async function getNotebooks(nb,page) {
    return new Promise(async resolve => {
        const { data } = await axios.get(page);
        const $ = cheerio.load(data);
        const table = $('ul.mp-Listings.mp-Listings--list-view');


        table.find('.mp-Listing--list-item').each((i, element) => {

            const $element = $(element);
            const vendor = $($element.find('.mp-Listing-seller-name-container')).text();

            const patt = new RegExp('media-monster', 'gi');
            if (!patt.test(vendor)) {
                console.log(vendor);

            }

            nb++;
        });
        resolve(nb);
    })

}

async function getAds() {
    const nbAds = await getCounters();
    let page = 1;
    let i = 0;
    
    console.log(nbAds);
    do {
         const page_url = `https://www.2ememain.be/l/informatique-logiciels/portables-et-notebooks/p/${page}/#Language:fr-BE|postcode:6061|limit:100`;
        const r = await getNotebooks(i,page_url);
        page++;
        i = r;
    } while (i <= nbAds)
}

getAds();