const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const Search = require('../models/Searches')

router.get('/', async (req, res) => {
  try {
    const search = await Search.find({})
    res.render('index', { search: search })
  } catch {
    res.redirect('/')
  }
});

router.get('/', async (request, response) => {
  let searchOptions = {}
  if (request.query.title != null && request.query.title !== '') {
    searchOptions.title = new RegExp(request.query.title, 'i')
  }
  try {
    const searches = await Search.find(searchOptions)
    response.render('/', {
      searches: searches,
      searchOptions: request.query
    })
  } catch {
    response.redirect('/')
  }
})

router.post('/', async (req, res) => {

  console.log(req.body)

  try {
    const search = await Search.create({

      title: req.body.title,
      minPrice: req.body.minPrice,
      maxPrice: req.body.maxPrice,
      hood: req.body.hood

    });

    res.status(201).json({
      success: true,
      data: search
    })
  } catch (err) {
    res.status(400).json({ success: false })
  }
})

// Returns results of scrape
function getResults(body) {
  const $ = cheerio.load(body);
  const rows = $('li.result-row');
  const results = [];

  rows.each((index, element) => {
    const result = $(element);
    const title = result.find('.result-title').text();
    const price = $(result.find('.result-price').get(0)).text();
    const imageData = result.find('a.result-image').attr('data-ids');
    let images = [];
    if (imageData) {
      const parts = imageData.split(',');
      images = parts.map((id) => {
        return `https://images.craigslist.org/${id.split(':')[1]}_300x300.jpg`;
      });
    }
    let hood = result.find('.result-hood').text();

    if (hood) {
      // javascript truthy, falsy
      hood = hood.match(/\((.*)\)/)[1];
      //.trim().replace("(", "").replace(")", "");
    }

    // .result-title.hdrlnk
    let url = result.find('.result-title.hdrlnk').attr('href');

    results.push({
      title,
      price,
      images,
      hood,
      url,
    });
  });

  return results;
}

router.get('/:location/:search_term', (request, response) => {
  const search_term = request.params.search_term;
  const location = request.params.location;

  const url = `https://${location}.craigslist.org/search/sss?sort=date&query=${search_term}`;
  fetch(url)
    .then((response) => response.text())
    .then((body) => {
      const results = getResults(body);
      response.json({
        results,
      });
    });
});

module.exports = router;
