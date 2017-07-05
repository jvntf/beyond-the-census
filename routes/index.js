var express = require('express');
var router = express.Router();

// Mongoose import
var mongoose = require('mongoose');

// Mongoose connection to MongoDB
mongoose.connect('mongodb://localhost/ELAdata', function (error) { // was leaflet_test
    if (error) {
        console.log(error);
    }
});

// routes/index.js
// Mongoose Schema definition
var Schema = mongoose.Schema;

var NeighborhoodSchema = new Schema({
  _id: Schema.Types.ObjectId
});

var CountrySchema = new Schema({  //properties.languages
  _id: Schema.Types.ObjectId,
  properties: {
    languages: [{type: Schema.Types.ObjectId, ref: 'Language'}]
  }
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
  continents: [{type: Schema.Types.ObjectId, ref: 'Continent'}]
});

var InstitutionSchema = new Schema({
  _id: Schema.Types.ObjectId
});

// Mongoose Model definition
var Neighborhood = mongoose.model('Neighborhood', NeighborhoodSchema);
var Country = mongoose.model('Country', CountrySchema);
var Continent = mongoose.model('Continent', ContinentSchema);
var Language = mongoose.model('Language', LanguageSchema);
var Institution = mongoose.model('Institution', InstitutionSchema);

/* ~~~~~~~~~~~~  PAGES ~~~~~~~~~~~~~~ */
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
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

/* GET Sandbox page. */
router.get('/sandbox', function(req,res) {
  res.render('sandbox', { title: 'Sandbox' });
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

/* ~~~~~~~~~~~~ DATA ~~~~~~~~~~~~~~ */

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
    Country.find({}).populate('properties.languages').exec( function (err, docs) {
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
/* GET language by ID */
router.get('/languages/:id', function (req, res) {
    if (req.params.id) {
        Language.findOne({ "_id": mongoose.Types.ObjectId(req.params.id) }, function (err, docs) {
            res.json(docs);
        });
    }
});
/* GET all languages */
router.get('/languages', function (req, res) {
    Language.find({}).populate({ path: 'countries', select: 'properties' }).populate({ path: 'continents', select: 'properties' }).exec( function (err, docs) {
        res.json(docs);
    });
});
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


module.exports = router;
