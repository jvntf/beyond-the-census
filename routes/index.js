var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var request = require('request');
var storyhelper = require('./helpers/storyhelper');

var mongoDB = process.env.MONGODB_URI || 'mongodb://localhost/ELAdata';

/* ~~~ mongoose connection (access to database) ~~~ */
  mongoose.connect(mongoDB, function (err) {
      if (err) {console.log(err)};
  });

/* ~~~ mongoose setup ~~~ */

  /* ~~~ schemas ~~~ */

  var Schema = mongoose.Schema;

  var NeighborhoodSchema = new Schema({
    _id: Schema.Types.ObjectId,
    properties: {
      languages: [{type: Schema.Types.ObjectId, ref: 'Language'}]
    }
  });

  var CountrySchema = new Schema({
    _id: Schema.Types.ObjectId,
    properties: {
      languages: [{type: Schema.Types.ObjectId, ref: 'Language'}]
    },
    geometry: Schema.Types.Mixed
  });

  var ContinentSchema = new Schema({
    _id: Schema.Types.ObjectId,
    properties: {
      languages: [{type: Schema.Types.ObjectId, ref: 'Language'}]
    }
  });

  var LanguageSchema = new Schema({
    _id: Schema.Types.ObjectId,
    countries: [{type: Schema.Types.ObjectId, ref: 'Country'}],
    continents: [{type: Schema.Types.ObjectId, ref: 'Continent'}],
    neighborhoods: [{type: Schema.Types.ObjectId, ref: 'Neighborhood'}],
    institutions: [{type: Schema.Types.ObjectId, ref: 'Institution'}]
  });

  var InstitutionSchema = new Schema({
    _id: Schema.Types.ObjectId,
    properties: {
      languages: [{type: Schema.Types.ObjectId, ref: 'Language'}]
    }
  });

  var IndividualSchema = new Schema({
    _id: Schema.Types.ObjectId
  });

  /* ~~~ indexes ~~~ */

  LanguageSchema.index({'$**': 'text'}, {background: false});

  /* ~~~ models ~~~ */

  var Neighborhood = mongoose.model('Neighborhood', NeighborhoodSchema);
  var Country = mongoose.model('Country', CountrySchema);
  var Continent = mongoose.model('Continent', ContinentSchema);
  var Language = mongoose.model('Language', LanguageSchema);
  var Institution = mongoose.model('Institution', InstitutionSchema);
  var Individual = mongoose.model('Individual', IndividualSchema);

/* ~~~ GET routes for pages (visible stuff) ~~~ */

  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.render('index', { title: 'Languages of Queens' });
  });

  /* GET individual page. */
  router.get('/story', function(req, res, next) {
        res.render('individual', { title: 'Language Stories'});
  });

  /* GET Map page. */
  router.get('/map', function(req,res) {
      Neighborhood.find({},{}, function(e,docs){
          res.render('map', {
              "jmap" : docs,
              lat : 40.717,
              lng : -73.815
          });
      });
  });

  /* GET languages */
  router.get('/list/languages', function(req,res) {
    Language.find({}).lean().exec( function (err, docs) {
        var langs = docs;
        Country.find({}).lean().exec( function (err, docs) {
            var counts = docs;
            Neighborhood.find({}).lean().exec( function (err, docs) {
                var neighs = docs;
                Institution.find({}).lean().exec( function (err, docs) {
                    var insts = docs;
                      res.render('languageList', {
                        title: 'Languages',
                        languages:langs,
                        countries:counts,
                        neighborhoods:neighs,
                        institutions:insts,
                        lat : 40.723956,
                        lng : -73.833082
                      });
                    });
                  });
                });
              });
            });

/* ~~~ GET routes for data (behind the scenes) ~~~ */

  /* GET random PUMS individual, with ability to filter out US natives, english and spanish speakers */
  router.get('/individual/:nativity/:english/:spanish', function (req, res) {

      var queryNativity = {}
        , queryEnglish = {}
        , querySpanish = {};

      if (req.params.nativity == 'true') { queryNativity = {nativity: {$ne: 1}} }
      if (req.params.english == 'true') { queryEnglish = {lang_home_nonenglish: {$ne: 2}} }
      if (req.params.spanish == 'true') { querySpanish = {lang_spoken_home: {$ne: 625}} }

      Individual.count({$and: [queryNativity, queryEnglish, querySpanish]}).exec(function (err, count) {
        if (err) throw err;
        var random = Math.floor(Math.random() * count);
        console.log(random)
        Individual.findOne({$and: [queryNativity, queryEnglish, querySpanish]}).skip(random).exec( (err, doc) => {
          if (err) throw err;
          storyhelper.tell(doc.toObject(), (err, story) => {
            if (err) throw err;
            res.json(story);
          });
        })
      });
  });

  /* GET country by ID */
  router.get('/countries/:id', function (req, res) {
      if (req.params.id) {
          Country.findOne({ "_id": mongoose.Types.ObjectId(req.params.id) }, function (err, docs) {
              res.json(docs);
          });
      }
  });

  /* GET all countries */
  router.get('/countries', function (req, res) {
      Country.find({}).populate().exec( function (err, docs) { // populate had argument 'properties.languages'
          res.json(docs);
      });
  });

  /* GET all continents */
  router.get('/continents', function (req, res) {
      Continent.find({}, function (err, docs) {
          res.json(docs);
      });
  });

  /* GET neighborhood by ID */
  router.get('/neighborhoods/:id', function (req, res) {
      if (req.params.id) {
          Neighborhood.findOne({ "_id": mongoose.Types.ObjectId(req.params.id) }, function (err, docs) {
              res.json(docs);
          });
      }
  });

  /* GET all neighborhood */
  router.get('/neighborhoods', function (req, res) {
      Neighborhood.find({}, function (err, docs) {
          res.json(docs);
      });
  });

  /* GET language by ID
  router.get('/languages/:id', function (req, res) {
      if (req.params.id) {
          Language.findOne({ "_id": mongoose.Types.ObjectId(req.params.id) }, function (err, docs) {
              res.json(docs);
          });
      }
  });*/

  /* GET all languages */
  router.get('/languages', function (req, res) {
      Language.find({})
      .populate({ path: 'countries'})
      .populate({ path: 'continents', select: 'properties' })
      .populate({ path: 'neighborhoods'})
      .exec( function (err, docs) {
          res.json(docs);
      });
  });

  // GET filtered languages based on language name and endangerment level
  // with populated countries, continents and neighborhoods (with geometry)
  router.get('/languages/BYEND/:endangerment', function (req, res) {
      Language.find({
        //language: req.params.string,
        endangermentNum: { $gt: req.params.endangerment }
      })
      .populate({ path: 'countries', select: 'properties' })
      .populate({ path: 'continents', select: 'properties' })
      .populate({ path: 'neighborhoods'})
      .exec( function (err, docs) {
          res.json(docs);
      });
  })

  // GET filtered languages based on language name and endangerment level
  // with populated countries, continents and neighborhoods (with geometry)
  router.get('/languages/BYID/:id', function (req, res) {
      Language.find({
        _id: req.params.id
      })
      .populate({ path: 'countries', select: 'properties' })
      .populate({ path: 'continents', select: 'properties' })
      .populate({ path: 'neighborhoods'})
      .exec( function (err, docs) {
          res.json(docs);
      });
  })

  /* GET institution by ID */
  router.get('/institutions/:id', function (req, res) {
      if (req.params.id) {
          Institution.findOne({ "_id": mongoose.Types.ObjectId(req.params.id) }, function (err, docs) {
              res.json(docs);
          });
      }
  });

  /* GET all institutions */
  router.get('/institutions', function (req, res) {
      Institution.find({}, function (err, docs) {
          res.json(docs);
      });
  });

  /* GET underlay dataset based on its label */
  router.get('/underlay/:dataset', function (req, res) {
      res.json({data: 'nothing here yet, ' + req.params.dataset})
      /*Institution.find({}, function (err, docs) {
          res.json(docs);
      });*/
  });

  /* GET language list based on endangerment range */
  router.get('/languages/:endMin.:endMax', function (req, res) {
      //res.json({min: req.params.endMin,
      //          max: req.params.endMax,
      //          string: req.params.searchstring})
      var query = {
                    $and: [
                      {endangermentNum: { $lt: parseInt(req.params.endMax) }},
                      {endangermentNum: { $gt: parseInt(req.params.endMin) }}
                      //{$text: { $search: req.params.searchstring }}
                     ]
                  }
      console.log(req.params.endMax)
      console.log(req.params.endMin)
      //if (req.params.searchstring == 'NULL') {query.$and.splice(2,1)};
      Language.find(query)
      .populate({ path: 'countries' })
      .populate({ path: 'continents', select: 'properties' })
      .populate({ path: 'neighborhoods', select: 'properties' })
      .populate({ path: 'institutions'})
      .exec( function (err, docs) {
          if (err) throw err;
          res.json(docs);
      });
  });



/* ~~~ export ~~~ */

module.exports = router;
