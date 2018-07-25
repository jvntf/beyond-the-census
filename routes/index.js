var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var request = require('request');
var cheerio = require('cheerio');
var storyhelper = require('./helpers/storyhelper');
var https = require('https');
var getVideoId = require('get-video-id');
var nodeGeocoder = require('node-geocoder');
var admin = require('./admin');


// var mongoDB = process.env.MONGODB_URI || 'mongodb://localhost/ELAdata';

//live db
// var mongoDB = 'mongodb://c4sr:lang2018@ds151530.mlab.com:51530/heroku_n7xsssc4'
//test db
var mongoDB = 'mongodb://c4sr:lang2018@ds151530.mlab.com:51530/heroku_8kgpwpjz'

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
    properties: {
      institutions: [{type: Schema.Types.ObjectId, ref: 'Institution'}]
    },
    hid: String,
    id: String,
    language: String,
    description: String,
    endangermentNum: Number,
    latitude: String,
    longitude: String,
    script: String,
    videoURL: String
  });

  


  var InstitutionSchema = new Schema({
    _id: Schema.Types.ObjectId,
    type: {type: String},
    properties: {
      languages: [{type: Schema.Types.ObjectId, ref: 'Language'}],
      institution : String,
      address : String,
      type: {type: String}
    },
    geometry : {
      type: {type: String},
      coordinates: []
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


  

// GET admin pages
  router.get('/admin', admin.admin);
  router.get('/newinstitution', admin.newinstitution);

  // router.get('/newlanguage', (req, res) => { Country.find( (countries,req, res) => admin.newlanguage)});
  router.get('/newlanguage', function(req,res){
    var countries, institutions;

    var p1 = Country.find({}, 'properties.ADMIN').exec()
      .then( (docs) => {countries = docs})
      .then(function(){
        return Institution.find({}, 'properties.institution').exec();
      })
      .then( (docs) => {institutions = docs} )
      .then(function(){
        return Neighborhood.find({}, 'properties.NTACode properties.NTAName').exec();
      })
      .then( (docs) => {neighborhoods = docs} )
      .then(function(){
        return Continent.find({}, 'properties.CONTINENT').exec();
      })
      .then( (docs) => {continents = docs} )
      .then( () => {admin.newlanguage(req,res, countries, institutions,neighborhoods, continents)});

  });
  // 
  // router.get('/success', );
  

  // router.post('/addlanguage', admin.addlanguage);
  router.post('/addlanguage', function(req, res){
    var newLang = new Language({
      _id: mongoose.Types.ObjectId(),
      hid: req.body.hid,
      id: req.body.glottocode,
      language: req.body.language,
      description: req.body.description,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      endangermentNum: req.body.endangermentNum,
      script: req.body.endonym,
      countries: req.body.countries,
      continents: req.body.continents,
      properties : {
        institutions : req.body.institutions
      },
      neighborhoods : req.body.neighborhoods
    });

    newLang.save()
      .then( () => {linkCountries(newLang)} )
      .then(() => {linkInstitutions(newLang)})
      .then( () => {admin.success(req,res)} )
      .catch( (err) => {die(res, err, newLang._id)} )
      // .catch( (err) => {console.error(err)})
  });

  function linkCountries(language){
    console.log(language._id);
      var countries = language.countries;
      countries.forEach(function(country,i){
        Country.findByIdAndUpdate(country, { $push: { "properties.languages":language._id}}, {upsert: true},function(err,obj){
          if (!err) return;
        })
      })
  }

  function linkInstitutions(language){
    var institutions = language.properties.institutions;
    institutions.forEach(function(institution){
      Institution.findByIdAndUpdate(institution, { $push: { "properties.languages":language._id}}, {safe : true, upsert: true, new : true},function(err,obj){
        if (!err) return;
      })
    })
  }


  router.post('/addinstitution', function(req, res){
    var obj = new Institution({
      _id: mongoose.Types.ObjectId(),
      type : "Feature",
      properties:{        
        institution: req.body.institution,
        address: req.body.address,
        type:"zone",
        languages:[]
      },
      geometry : {
        type : "Point",
        coordinates : []
      }
    });
      var options = {
        provider: 'google',
       
        // Optional depending on the providers
        httpAdapter: 'https', // Default
        apiKey: 'AIzaSyBNPZeOy6YfgRd2TGCIdkJqgRUDE16nDf4', // for Mapquest, OpenCage, Google Premier
        formatter: null         // 'gpx', 'string', ...
      };
      var geocoder = nodeGeocoder(options);
      geocoder.geocode(obj.properties.address)
        .then( (data) => {
          data = data[0]
          obj.properties.address = data.formattedAddress;
          obj.geometry.coordinates = [data.longitude, data.latitude]
        }).then( () => {obj.save()}).then( () => {admin.success(req,res)})
        .catch( (error) => {dieInst(res,error, obj._id)});
  });


  

  function die(res, message, id){

    Language.remove({_id : id}, function(err) {

      if(err) {
        res.send(err);
      }
      else{
      res.send(message);
      }
    })
  }


function dieInst(res, message, id){

  Institution.remove({_id : id}, function(err) {

  // Test.remove({_id : req.body._id}, function(err) {
    if(err) {
      res.send(err);
    }
    else{
    res.send(message);
    }
  })
}




/* ~~~ export ~~~ */

module.exports = router;



