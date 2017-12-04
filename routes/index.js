var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var request = require('request');
var cheerio = require('cheerio');
var storyhelper = require('./helpers/storyhelper');

// var mongoDB = process.env.MONGODB_URI || 'mongodb://localhost/ELAdata';
var mongoDB = 'mongodb://c4sr:languages@ds227555.mlab.com:27555/heroku_wpb27xt2'

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


  var InstitutiontestSchema = new Schema({
    _id: Schema.Types.ObjectId,
    type : String,
    properties: {
      // lang_1 : String,
      // lang_2 : String,
      // lang_3 : String,
      // lang_4 : String,
      // lang_5 : String,
      // lang_6 : String,
      // lang_7 : String,
      // lang_8 : String,
      // lang_9 : String,
      // comment : String,
      // description : String,
      // institution : String,
      // address : String,
      // type : String
      // // languages: [{type: Schema.Types.ObjectId, ref: 'Language'}],
    },
    geometry : {}
    //   type : "Point",
    //   coordinates : [
    //     -73.92828615071284,
    //     40.75610717922607
    //   ]
    // }
  });


  var TestSchema = new Schema({
    _id: Schema.Types.ObjectId,
    hid: String,
    id: String,
    language: String,
    description: String,
    region: String,
    endangermentNum: String,
    status: String,
    latitude: String,
    longitude: String,
    ntacode_1: String,
    iso_country1: String,
    iso_country2: String,
    iso_country3: String,
    iso_country4: String,
    iso_country5: String,
    iso_country6: String,
    countries: [{type: Schema.Types.ObjectId, ref: 'Country'}],
    continents: [{type: Schema.Types.ObjectId, ref: 'Continent'}],
    neighborhoods: [{type: Schema.Types.ObjectId, ref: 'Neighborhood'}],
    institutions: [{type: Schema.Types.ObjectId, ref: 'Institution'}]
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
  var Test = mongoose.model('Test', TestSchema);
  var Institutiontest = mongoose.model('Institutiontest', InstitutiontestSchema);


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


  




  router.get('/newlanguage', function(req, res) {
      res.render('admin/newlanguage', { title: 'Add new language' });
  });

  router.get('/newinstitution', function(req, res) {
      res.render('admin/newinstitution', { title: 'Add new Institution' });
  });




router.get('/editlang', function(req, res){
  console.log(req.query.query);
  // Language.findOne({[req.query.query]: req.query.value}, function(err, obj){
  Test.findOne({[req.query.query]: req.query.value}, function(err, obj){
    if (err){
      res.send(err);
    }
    if(obj){
      obj = obj.toObject();

      console.log("endangermentNum "+ obj.endangermentNum);
      res.render('admin/editlang', {title: "Language",
                              _id: obj._id,
                              hid: obj.hid,
                              id: obj.id,
                              language: obj.language,
                              description: obj.description,
                              region: obj.region,
                              endangermentNum: obj.endangermentNum,
                              status: obj.status,
                              latitude: obj.latitude,
                              longitude: obj.longitude,
                              ntacode_1: obj.ntacode_1,
                              iso_country1: obj.iso_country1,
                              iso_country2: obj.iso_country2,
                              iso_country3: obj.iso_country3,
                              iso_country4: obj.iso_country4,
                              iso_country5: obj.iso_country5,
                              iso_country6: obj.iso_country6,
                              neighborhoods: obj.neighborhoods[0],
                              institutions: obj.institutions[0],
                              continents: obj.continents[0]
                              });
    } else {
      res.send("This entry is not in the database. Check query or contact admin.");
    }
    
    

  });
})


  /* POST to Add User Service */
  router.post('/addlanguage', function(req, res) {
    // countryArray = req.body.countries.split(';');
    // neighborhoodArray = req.body.neighborhoods.split(';');
    // institutionArray = req.body.institutions.split(';');
    // continentArray = req.body.continents.split(';');
    // console.log(continentArray);

    var u = new Test({
      _id: mongoose.Types.ObjectId(),
      hid: req.body.hid,
      id: req.body.id,
      language: req.body.language,
      description: req.body.description,
      // region: req.body.region,
      endangermentNum: req.body.endangermentNum,
      status: req.body.status,
      ntacode_1: req.body.ntacode_1,
    });

    var test = "hello";


    u.save(function(err){
      if(err){
        console.log(err);
        res.send("There was a problem adding the information to the databse")
      }
      else{ 


        

        var lat, lon;
        var countries = [];

        if(u.id === "") {res.send("glottolog id is necessary");}
        else {
          Neighborhood.findOne({"properties.NTACode": req.body.ntacode_1}, function(err,obj){
            if(err) {
              // res.send(err);
            }
            if (!obj) {
              res.send("NTA Code is invalid. Go back and re-submit.");
            }
            else {
              Test.findByIdAndUpdate(
                u._id,
                {$push: {"neighborhoods": obj._id}},
                {safe : true, upsert: true, new : true},
                function(err, model){
                  if (err) {
                    res.send(err);
                  } else {
                    var url = "https://github.com/clld/glottolog/blob/master/languoids/languages_" + u.id[0]+'.md';
                    request(url, function(error, response, html){
                      if(!error){
                        var $ = cheerio.load(html);
                        var langUrl;
                        var found;
                        console.log(url);
                        if($.html().includes(u.id)){
                          $('.markdown-body ul li').filter(function(){
                            var data = $(this);
                        
                            // console.log(data.length)
                            var somelink = data.children().first().text();
                            // console.log(somelink);
                            if (somelink.indexOf(u.id)>=0){
                              
                              var langFileURL = "https://github.com"+ data.children().first().attr('href');
                            
                              request(langFileURL, function(err, response, html){
                                if(!error){
                                  var $ = cheerio.load(html);
                                  $('tbody').filter(function(){
                                    var data = $(this);
                                    var textarray = data.children().next().text().replace(/ +(?= )/g,'').split("\n");
                                    textarray.forEach(function(item, index){
                                      item = item.trim();
                                      if (item.indexOf("latitude")>=0){
                                        lat = item.split(" = ")[1];
                                      }
                                      else if (item.indexOf("longitude")>=0){
                                        lon = item.split(" = ")[1];
                                      }
                                      else if (item.indexOf("countries")>=0){
                                        var i = index+1;
                                        while(textarray[i].indexOf("sources")<0){
                              
                                          if (textarray[i].length==1 || textarray[i].length==0){
                                            i+=1;
                                            continue;
                                          }
                                          countries.push(textarray[i].trim().split(' ')[0]);
                                          i+=1; 
                                        }
                                      }
                                    })
                                    var i = 0;
                                    countries.forEach(function(country){
                                      Country.findOne({"properties.ADMIN": country}, function(err,obj){
                                        if(err) {res.send(err);}
                                        if(!obj) {res.send(country + " was not found in the Countries database. contact administrator");}
                                        Test.findByIdAndUpdate(
                                          u._id,
                                          {$push: {"countries": obj._id}, $set: {"latitude": lat, "longitude": lon}},
                                          {safe : true, upsert: true, new : true},
                                          function(err, model){
                                            i+=1;
                                            if (err) res.send(err);
                                            if (i == countries.length) {
                                              res.redirect("success");
                                            }
                                            console.log(test);
                                          }
                                        );
                                      });
                                    })
                                  })
                                }
                              })
                            }
                          })
                        }
                        else {
                          res.send("code not found on glottolog. please contact admin.");
                        }

                      }
                    })




                  }
                }
              );
            }
          });

        }
        
        
      }
    });





     
  });

  router.post('/updateEntry', function(req, res) {
    if (req.body.query == "ntacode_1"){
      Neighborhood.findOne({"properties.NTACode": req.body.value}, function(err,obj){
        if(err) {
          // res.send(err);
        }
        if (!obj) {
          res.send("NTA Code is invalid. Go back and re-submit.");
        }
        else {
          Test.findByIdAndUpdate(req.body._id, { $set: { [req.body.query]: req.body.value}}, {upsert:true}, function(err,result){
            if (err)
              throw err
            else
              res.redirect('back');
          })
        }
      });
    } else if (req.body.query == "id"){

      var lat, lon;
      var countries = [];
      
      var url = "https://github.com/clld/glottolog/blob/master/languoids/languages_" + req.body.value[0]+'.md';
      console.log(url);
      request(url, function(error, response, html){
        if(!error){
          var $ = cheerio.load(html);
          var langUrl;
          var found;

          if($.html().includes(req.body.value)){

            $('.markdown-body ul li').filter(function(){
              var data = $(this);
          
              // console.log(data.length)
              var somelink = data.children().first().text();
              // console.log(somelink);
              // 
              if (somelink.indexOf(req.body.value)>=0){
                
                var langFileURL = "https://github.com"+ data.children().first().attr('href');
              
                request(langFileURL, function(err, response, html){
                  if(!error){
                    var $ = cheerio.load(html);
                    $('tbody').filter(function(){
                      console.log("hello");
                      var data = $(this);
                      var textarray = data.children().next().text().replace(/ +(?= )/g,'').split("\n");
                      textarray.forEach(function(item, index){
                        item = item.trim();
                        if (item.indexOf("latitude")>=0){
                          lat = item.split(" = ")[1];
                        }
                        else if (item.indexOf("longitude")>=0){
                          lon = item.split(" = ")[1];
                        }
                        else if (item.indexOf("countries")>=0){
                          var i = index+1;
                          while(textarray[i].indexOf("sources")<0){
                
                            if (textarray[i].length==1 || textarray[i].length==0){
                              i+=1;
                              continue;
                            }
                            countries.push(textarray[i].trim().split(' ')[0]);
                            i+=1; 
                          }
                        }
                      })
                      var i = 0;
                      countries.forEach(function(country){
                        Country.findOne({"properties.ADMIN": country}, function(err,obj){
                          if(err) {res.send(err);}
                          if(!obj) {res.send(country + " was not found in the Countries database. contact administrator");}
                          Test.findByIdAndUpdate(
                            req.body._id,
                            {$push: {"countries": obj._id}, $set: {"latitude": lat, "longitude": lon}},
                            {safe : true, upsert: true, new : true},
                            function(err, model){
                              i+=1;
                              if (err) res.send(err);
                              console.log(i);
                              if (i == countries.length) {
                                res.redirect("back");
                              }

                            }
                          );
                        });
                      })
                    })
                  }
                })
              }
            })
          }
          else {
            res.send("code not found on glottolog. please contact admin.");
          }

        }
      })

    } else {
      Test.findByIdAndUpdate(req.body._id, { $set: { [req.body.query]: req.body.value}}, {upsert:true}, function(err,result){
        if (err)
          throw err
        else
          res.redirect('back');
      })
    }

  });

  router.post('/addinstitution', function(req, res) {

    langArray = req.body.languages.split(';')
    var lang_i = ["lang_1","lang_2","lang_3",
                  "lang_4","lang_5","lang_6",
                  "lang_7","lang_8","lang_9"];

    var u = new Institutiontest({
      _id: mongoose.Types.ObjectId(),
      type : "Feature",
      properties:{        
        institution: req.body.institution,
        description: req.body.desc,
        address: req.body.addr,
        type: req.body.type,
        languages : []
      },
      geometry : {
        type : "Point",
        coordinates : [-73.84837760790123,40.73037105049767]
      }
    });

    for (var i = 0; i<lang_i.length; i++){
      if (typeof langArray[i] !== 'undefined' && langArray[i]!=="") {
        u.properties[lang_i[i]] = langArray[i];
      } else
          u.properties[lang_i[i]] = null
    }

    var j = 0;
    u.save(function(err){
      if(err){
        console.log(err);
        res.send(err);
      }else 
        var langIDs = [];
        langArray.forEach(function(language){
          Language.findOne({"id":language}, function(err, obj){
            if (err) {res.send(err);}
            if(obj) {
              Institutiontest.findByIdAndUpdate(
                u._id,
                {$push: {"properties.languages": obj._id}},
                {safe : true, upsert: true, new : true},
                function(err, model){
                  if (err) res.send(err);
                  j+=1;
                  if(j==langArray.length) {
                    res.redirect("back");
                  }
                }
              );

            }
            else{res.send(language + " was not found in the databse. Please go back and correct to add.")}

          })
        })
        
    });

    
  })

  router.get('/admin', function(req,res){
    res.render('admin/index', {title: 'Add to or Edit database'});
  });

  router.get('/success', function(req,res){
    console.log(req);
    res.render('admin/success', {title: 'Database operation was successful'});
  });

/* ~~~ export ~~~ */

module.exports = router;
