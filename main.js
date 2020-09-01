const axios = require('axios');
const cheerio = require('cheerio');
let page = 1;
let count = 0;
let o  = {};
o['tree'] = [];

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

async function getContent(page) {
    return new Promise(async (resolve, reject) => {
        try {
            const { data } = await axios.get(page);
            const $ = cheerio.load(data);
            const description = $('div#vip-ad-description');
            //console.log($(description).text());
            resolve($(description).text());
        } catch (error) {
            reject(error);
        }

    })
}

async function getAds( page) {
    return new Promise(async resolve => {
        const { data } = await axios.get(page);
        const $ = cheerio.load(data);
        const table = $('ul.mp-Listings.mp-Listings--list-view');
        
        table.find('.mp-Listing--list-item').each( async (i, element) => {
            const $element = $(element);
            const vendor = $($element.find('.mp-Listing-seller-name-container')).text();
            const title = $($element.find('.mp-Listing-title')).text();
            const price = $($element.find('.mp-Listing-price.mp-text-price-label')).text().replace(/€\s/g, '');
            const link = $($element.find('.mp-Listing-coverLink')).attr('href');
            const detail_url = `https://www.2ememain.be${link}`;
            const description = await getContent(detail_url);
            const patt = new RegExp('media-monster', 'gi');
            if (!patt.test(vendor)) {
                const brand = new RegExp('t470', 'gim');
                if (brand.test(description)) {
                    //console.log(vendor);
                    //console.log(title,price);
                    //console.log(description);
                    o['tree'].push({
                        title: title,
                        vendor: vendor,
                        price: price,
                        description: description,
                        link: detail_url
                    })
                }
            }
            count++;
        });
        resolve(count);
    })

}

async function run() {
    const nbAds = await getCounters();
    let page = 1;
    

    console.log(nbAds);
    do {
        const page_url = `https://www.2ememain.be/l/informatique-logiciels/portables-et-notebooks/p/${page}/#Language:fr-BE|postcode:6061|limit:100`;
        const r = await getAds(page_url);
        page++;
        
    } while (count <= nbAds)
    console.log(o);
}

run();