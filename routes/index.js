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
var CountrySchema = new Schema({
  _id: Schema.Types.ObjectId
});
var LanguageSchema = new Schema({
  _id: Schema.Types.ObjectId
});
var InstitutionSchema = new Schema({
  _id: Schema.Types.ObjectId
});

// Mongoose Model definition
var Neighborhoods = mongoose.model('Neighborhood', NeighborhoodSchema, 'neighborhoods');
var Countries = mongoose.model('Country', CountrySchema, 'countries');
var Languages = mongoose.model('Language', LanguageSchema, 'languages');
var Institutions = mongoose.model('Institution', InstitutionSchema, 'institutions');

/* ~~~~~~~~~~~~  PAGES ~~~~~~~~~~~~~~ */
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET Map page. */
router.get('/map', function(req,res) {
    Neighborhoods.find({},{}, function(e,docs){
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
  Languages.find({}).lean().exec( function (err, docs) {
      var langs = docs;
      Countries.find({}).lean().exec( function (err, docs) {
          var counts = docs;
          Neighborhoods.find({}).lean().exec( function (err, docs) {
              var neighs = docs;
              Institutions.find({}).lean().exec( function (err, docs) {
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
        Countries.findOne({ "_id": mongoose.Types.ObjectId(req.params.id) }, function (err, docs) {
            res.json(docs);
        });
    }
});
/* GET all countries */
router.get('/countries', function (req, res) {
    Countries.find({}, function (err, docs) {
        res.json(docs);
    });
});
/* GET neighborhood by ID */
router.get('/neighborhoods/:id', function (req, res) {
    if (req.params.id) {
        Neighborhoods.findOne({ "_id": mongoose.Types.ObjectId(req.params.id) }, function (err, docs) {
            res.json(docs);
        });
    }
});
/* GET all neighborhood */
router.get('/neighborhoods', function (req, res) {
    Neighborhoods.find({}, function (err, docs) {
        res.json(docs);
    });
});
/* GET language by ID */
router.get('/languages/:id', function (req, res) {
    if (req.params.id) {
        Languages.findOne({ "_id": mongoose.Types.ObjectId(req.params.id) }, function (err, docs) {
            res.json(docs);
        });
    }
});
/* GET all languages */
router.get('/languages', function (req, res) {
    Languages.find({}, function (err, docs) {
        res.json(docs);
    });
});
/* GET institution by ID */
router.get('/institutions/:id', function (req, res) {
    if (req.params.id) {
        Institutions.findOne({ "_id": mongoose.Types.ObjectId(req.params.id) }, function (err, docs) {
            res.json(docs);
        });
    }
});
/* GET all institutions */
router.get('/institutions', function (req, res) {
    Institutions.find({}, function (err, docs) {
        res.json(docs);
    });
});


module.exports = router;
