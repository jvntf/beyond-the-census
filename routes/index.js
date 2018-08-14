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
var mongoDB = 'mongodb://c4sr:lang2018@ds151530.mlab.com:51530/heroku_n7xsssc4'
//backup and test db
// var mongoDB = 'mongodb://c4sr:lang2018@ds151530.mlab.com:51530/heroku_8kgpwpjz'


var geocoderOptions = {
  provider: 'google',
  httpAdapter: 'https', 
  apiKey: 'AIzaSyBNPZeOy6YfgRd2TGCIdkJqgRUDE16nDf4', 
  formatter: null 
};
var geocoder = nodeGeocoder(geocoderOptions);

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
      languages: [{type: Schema.Types.ObjectId, ref: 'Language'}],
      ADMIN: String
    },
    geometry: Schema.Types.Mixed
  });

  var ContinentSchema = new Schema({
    _id: Schema.Types.ObjectId,
    properties: {
      languages: [{type: Schema.Types.ObjectId, ref: 'Language'}],
      ADMIN: String
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
    videoURL: String,
    wiki: String
  });

  


  var InstitutionSchema = new Schema({
    _id: Schema.Types.ObjectId,
    type: {type: String},
    properties: {
      languages: [{type: Schema.Types.ObjectId, ref: 'Language'}],
      institution: String,
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
  router.get('/admin',function(req,res){
    var langs,insts;
    Language.find({}, 'language').exec().then( (languages) => {
      langs = languages;
      return Institution.find({},'properties.institution').exec()
    }).then( (insts)=> {admin.admin(req,res,langs,insts)});
  })

  router.get('/newinstitution', admin.newinstitution);

  router.get('/newlanguage', function(req, res){
    pullData().then( (colls) => {admin.newlanguage(req,res,colls.cntry, colls.inst, colls.nhoods,colls.cont)});
  })

  router.get('/editlanguage', async function(req, res){
    let language = req.query.language
    var lang = await Language.findById(language).exec();
    pullData().then( (colls) => {admin.editlanguage(req,res,colls.cntry, colls.inst, colls.nhoods,colls.cont, lang)});
  })

  router.get('/editinstitution', function(req, res){
    var institution = req.query.institution;
    Institution.findById(institution).exec()
      .then((inst)=>admin.editinstitution(req,res,inst))
  })


 
  
  router.post('/addlanguage', function(req, res){
    var newLang = new Language({
      _id: mongoose.Types.ObjectId(),
      hid: req.body.hid,
      id: req.body.id,
      language: req.body.language,
      description: req.body.description,
      endangermentNum: req.body.endangermentNum,
      script: req.body.endonym,
      countries: req.body.countries,
      continents: req.body.continents,
      videoURL: req.body.videoURL,
      wiki: req.body.link,
      properties : {
        institutions : req.body.institutions
      },
      neighborhoods : req.body.neighborhoods
    });

    Country.findById(newLang.countries[0],'properties.ADMIN').exec()
    .then( (country) => geocoder.geocode(country.properties.ADMIN))
    .then( (data) => {
      data = data[0]
      newLang.longitude = data.longitude;
      newLang.latitude = data.latitude;
      return newLang.save();
    })
    .then(linkCountries)
    .then(linkInstitutions)
    .then(() => getVideo(newLang))
    .then( () => {admin.success(req,res)} )
    .catch( (err) => {die(res, new Error(err), newLang._id);} )
  });

  router.post('/editlanguage',function(req,res){
    var lang = req.body;
    delete Object.assign(lang, {["properties.institutions"]: lang["institutions"] })["institutions"];
    var oldV;
    Language.findById(lang._id)
    .then( (obj) => { 
      oldV = obj.toObject();
      obj._id= lang._id;
      obj.hid= lang.hid;
      obj.id= lang.id;
      obj.language= lang.language;
      obj.description= lang.description;
      obj.latitude= lang.latitude;
      obj.longitude= lang.longitude;
      obj.endangermentNum= lang.endangermentNum;
      obj.script= lang.script;
      obj.wiki = lang.link;
      obj.continents= lang.continents;
      obj.neighborhoods= lang.neighborhoods;
      return obj.save();

    })
      .then(()=> getVideo(lang))
      .then(obj => updateEntries(obj,lang,"countries"))
      .then(obj => updateEntries(obj,lang,"properties.institutions"))
      .then(()=> {admin.success(req,res)})
      .catch( (err) => {restoreLang(oldV); admin.error(req,res,err)});
  })
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
  
      geocoder.geocode(obj.properties.address)
        .then( (data) => {
          data = data[0]
          obj.properties.address = data.formattedAddress;
          obj.geometry.coordinates = [data.longitude, data.latitude]
          return obj.save();
        }).then( () => {admin.success(req,res)})
        .catch( (error) => {
          dieInst(res,new Error("Address is required"), obj._id)
        });
    
  });
  router.post('/editinstitution',function(req,res){
    var inst = req.body;
    var oldV={};
    var geoData;
    oldV._id = inst._id
    geocoder.geocode(inst.address)
    .then( (data) =>{
      geoData = data[0];
      return Institution.findById(inst._id);
    })
    .then( (foundInst) => {
      foundInst.properties.institution = inst.institution;
      foundInst.properties.address = geoData.formattedAddress;
      foundInst.geometry.coordinates = [geoData.longitude, geoData.latitude];
      return foundInst.save();
    })
    .then( ()=> admin.success(req,res))
    .catch( (err)=> {restoreInst(oldV); admin.error(req,res,new Error("Address is required"))})
  })
function pullData(){
  return new Promise(function(resolve,reject){
    var countries, institutions, neighborhoods,continents;
    var p1 = Country.find({}, 'properties.ADMIN').exec()
      .then(function(docs){
        countries = docs;
        return Institution.find({}, 'properties.institution').exec();
      })
      .then(function(docs){
        institutions = docs;
        return Neighborhood.find({}, 'properties.NTACode properties.NTAName').exec();
      })
      .then(function(docs){
        neighborhoods = docs;
        return Continent.find({}, 'properties.CONTINENT').exec();
      })
      .then( (continents) => {resolve({cntry:countries, inst:institutions, nhoods:neighborhoods, cont:continents});
      })
  })
}
function restoreLang(old){
  Language.findById(old._id).then( (obj) => {
    obj._id= old._id;
    obj.hid= old.hid;
    obj.id= old.id;
    obj.language= old.language;
    obj.description= old.description;
    obj.latitude= old.latitude;
    obj.longitude= old.longitude;
    obj.endangermentNum= old.endangermentNum;
    obj.script= old.script;
    obj.continents= old.continents;
    obj.neighborhoods= old.neighborhoods;
    obj.countries= old.countries;
    obj.properties.institutions= old.properties.institutions;
    obj.videoURL= old.videoURL;
    obj.link = old.link;
    obj.save();
  })
}
function restoreInst(old){
  Institution.findById(old._id).then( (obj)=>{
    obj.properties.institution = old.properties.institution;
    obj.properties.address = old.properties.address;
    obj.geometry.coordinates = old.geometry.coordinates
  })
}
function getVideo(lang){
  return new Promise(function(resolve,reject){
    var vidID,embed;
      if(lang.videoURL===""){
        embed = ""
        Language.findByIdAndUpdate(lang._id, {$set:{videoURL: embed}}).exec()
        .then( (result)=> resolve(result))
      } else{
        vidID = getVideoId(lang.videoURL).id;
        if (vidID === undefined){
          reject("error: Video URL Invalid")
        }
        embed = 'https://youtube.com/embed/' + vidID;
        Language.findByIdAndUpdate(lang._id, {$set:{videoURL: embed}}).exec()
        .then( (result)=> {resolve(result)})
      }
      

  })
}
function updateEntries(obj,lang,type){
  return new Promise(function(resolve,reject){
    var old_entries = [];
    var new_entries = [];
    lang[type] = typeof lang[type] === "string" ? [lang[type]] : lang[type];

    lang[type].forEach(function(item,index){
      new_entries[index] = String(item);
    })
      
    if (type==="countries"){
      obj[type].forEach(function(item,index){
        old_entries[index] = String(item);
      })
    } else{
      obj.properties.institutions.forEach(function(item,index){
        old_entries[index] = String(item);
      })
    }
    var combined = [...new Set([...old_entries ,...new_entries])];
    var leave =[];
    var remove = [];
    var add = [];
    for (let entry of combined){
      entry = String(entry)
      if (old_entries.includes(entry) && new_entries.includes(entry)){
        leave.push(entry);
      } else if (old_entries.includes(entry) && !new_entries.includes(entry)){
        remove.push(entry);
      } else if(!old_entries.includes(entry) && new_entries.includes(entry)){
        add.push(entry);
      }
    }

    remove.forEach(function(entry,index){
      var p1 = type==="countries"? Country.findById(entry).exec() : Institution.findById(entry).exec();
      p1.then(obj => {
        var ind = obj.properties.languages.indexOf(entry);
        obj.properties.languages.splice(ind,1);
        return obj.save();
      })
    })

    add.forEach(function(entry,index){
     entry = mongoose.Types.ObjectId(entry);
      var p1;
      if (type === "countries"){
        Country.findByIdAndUpdate(entry, {$addToSet:{"properties.languages":lang._id}}).exec();
      }
      else{
        Institution.findByIdAndUpdate(entry, {$addToSet:{"properties.languages":lang._id}}).exec();
      }
    })

    if (type === "countries"){
      Language.findByIdAndUpdate(lang._id,{$set:{countries:new_entries}}).exec().then(resolve);
    }
    else{
      Language.findByIdAndUpdate(lang._id,{$set:{"properties.institutions":new_entries}}).exec().then(resolve);
    }
  })
}
function linkCountries(language){
  return new Promise(function(resolve, reject){
    let countries = language.countries
      for(let country of countries){
        Country.findByIdAndUpdate(country, { $push: {"properties.languages": language._id}}, {upsert:true},function(err, obj){
          if (err) {
            reject(err);
            return false;
          }
          else if (country === countries[countries.length-1]){
            resolve(language);
          }
        })
      }
  })
}
function linkInstitutions(language){
  return new Promise(function(resolve, reject){
    let institutions = language.properties.institutions;
      for(let institution of institutions){
        Institution.findByIdAndUpdate(institution, { $push: {"properties.languages": language._id}},{safe : true, upsert: true, new : true},function(err, obj){
          if (err) {
            reject(err);
            return false;
          }
          else if (institution === institutions[institutions.length-1]){
            resolve();
          }
        })
      }
  })
}


  

function die(res, err, id){
Language.remove({_id : id}, function(error) {
  if(error) {
    res.send(error);
  }
  else{
  res.send(err.message);
  }
})
}


function dieInst(res, err, id){
  Institution.remove({_id : id}, function(error) {
    if(error) {
      res.send(error);
    }
    else{
    res.send(err.message);
    }
  })
}


/* ~~~ export ~~~ */

module.exports = router;



