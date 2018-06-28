var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var request = require('request');
var cheerio = require('cheerio');
var storyhelper = require('./helpers/storyhelper');
var https = require('https');
var getVideoId = require('get-video-id');

// var mongoDB = process.env.MONGODB_URI || 'mongodb://localhost/ELAdata';

//live db
var mongoDB = 'mongodb://c4sr:lang2018@ds151530.mlab.com:51530/heroku_n7xsssc4'
//test db
// var mongoDB = 'mongodb://c4sr:lang2018@ds151530.mlab.com:51530/heroku_8kgpwpjz'

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
    institutions: [{type: Schema.Types.ObjectId, ref: 'Institution'}],
    hid: String,
    id: String,
    language: String,
    description: String,
    region: String,
    endangermentNum: Number,
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
    script: String,
    videoURL: String
  });

  


  var InstitutionSchema = new Schema({
    _id: Schema.Types.ObjectId,
    properties: {
      languages: [{type: Schema.Types.ObjectId, ref: 'Language'}],
      lang_1 : String,
      lang_2 : String,
      lang_3 : String,
      lang_4 : String,
      lang_5 : String,
      lang_6 : String,
      lang_7 : String,
      lang_8 : String,
      lang_9 : String,

      description : String,
      institution : String,
      address : String,
    },
    geometry : {}
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


  




  router.get('/newlanguage', function(req, res) {
      res.render('admin/newlanguage', { title: 'Add new language' });
  });

  router.get('/newinstitution', function(req, res) {
      res.render('admin/newinstitution', { title: 'Add new Institution' });
  });




router.get('/editlang', function(req, res){


  Language.findOne({[req.query.query]: req.query.value}, function(err, obj){
    if (err){
      res.send(err);
    }
    if(obj){
      obj = obj.toObject();

  
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
                              continents: obj.continents[0],
                              script: obj.script,
                              videoURL:obj.videoURL
                              });
    } else {
      res.send("This entry is not in the database. Check query or contact admin.");
    }
    
  });
})


router.get('/editinst', function(req, res){
  console.log(req.query.query);
  console.log(req.query.value);
  Institution.findOne({[req.query.query]: req.query.value}, function(err, obj){
    if (err){
      res.send(err);
    }
    if(obj){
      obj = obj.toObject();
    

    //   console.log("endangermentNum "+ obj.endangermentNum);
   res.render('admin/editinst', {title: "Edit Institution",
                                   _id: obj._id,
                                   lang_1: obj.properties.lang_1,
                                   lang_2: obj.properties.lang_2,
                                   lang_3: obj.properties.lang_3,
                                   lang_4: obj.properties.lang_4,
                                   lang_5: obj.properties.lang_5,
                                   lang_6: obj.properties.lang_6,
                                   lang_7: obj.properties.lang_7,
                                   lang_8: obj.properties.lang_8,
                                   lang_9: obj.properties.lang_9,
                                   description: obj.properties.description,
                                   address: obj.properties.address});
    } else {
      res.send("This entry is not in the database. Check query or contact admin.");
    }
    

    
  });
})

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

  /* POST to Add User Service */
  router.post('/addlanguage', function(req, res) {

    var u = new Language({
    // var u = new Test({
      _id: mongoose.Types.ObjectId(),
      hid: req.body.hid,
      id: req.body.id,
      language: req.body.language,
      description: req.body.description,
      // region: req.body.region,
      endangermentNum: req.body.endangermentNum,
      status: req.body.status,
      ntacode_1: req.body.ntacode_1,
      script: req.body.script
    });


    try{
    u.save(function(err){
      if(err){
        console.log(err);
        res.send("There was a problem adding the information to the databse")
      }
      else{ 


        var lat, lon;
        var countries = [];
        var continents = [];
        var institution = req.body.institution

        if(u.id === "") {res.send("glottolog id is necessary");}
        else {
          Neighborhood.findOne({"properties.NTACode": req.body.ntacode_1}, function(err,objN){
            if(err) {
            }
            if (!objN) {
      

              die(res, "NTA Code is invalid. Go back and re-submit.", u._id);

            }
            else {
              console.log("institution |" + institution+"|");

              if (1){
                Institution.findOne({"properties.institution":institution}, function(err, objInst){
                  if (!objInst && institution!==""){
        
                    die(res,"institution not found", u._id)
                  }
                  else{



                    Language.findByIdAndUpdate(
                      u._id,
                      {$push: {"neighborhoods": objN._id}},
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
                              if ($.html().includes(u.id)===false){die(res, "code not found on glottolog", u._id);}
                              else if($.html().includes(u.id)){
                                $('.markdown-body ul li').filter(function(){
                                  var data = $(this);
                              
                                  var somelink = data.children().first().text();
                                  if (somelink.indexOf(u.id)>=0){
                                    
                                    var langFileURL = "https://github.com"+ data.children().first().attr('href');
                                  
                                    request(langFileURL, function(err, response, html){
                                      if(!err){
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
                                            else if(item.indexOf("macroareas")>=0){
                                              var i = index +1;
                                          
                                              while(textarray[i].indexOf("countries")<0){
                                                if(textarray[i].length==1 || textarray[i].length == 0){
                                                  i+=1;
                                                  continue;
                                                }
                                                if (textarray[i].trim()=='Eurasia'){
                                                  continents.push('Europe');
                                                  continents.push('Asia');
                                                }
                                                else{
                                                  continents.push(textarray[i].trim());
                                                }
                                                i+=1;
                                              }
                                            }
                                            else if (item.indexOf("countries")>=0){
                                              console.log("|"+textarray+"|");
                                              var i = index+1;
                                              while(textarray[i].indexOf("[")<0){
                                    
                                                if (textarray[i].length==1 || textarray[i].length==0){
                                                  i+=1;
                                                  continue;
                                                }
                                                countries.push(textarray[i].split('(')[0].trim());
                                                i+=1; 
                                              }
                                            }
                                            
                                          })
                                          
                                         

                                          var i = 0;
                                          console.log("countries "+countries)
                                          countries.forEach(function(country){
                                            Country.findOne({"properties.ADMIN": country}, function(err,objCount){
                                              if(err) {res.send(err);}
                                              if(!objCount) {res.send(country + " was not found in the Countries database. contact administrator");}
                                              else{ Language.findByIdAndUpdate(
                                              // Test.findByIdAndUpdate(
                                                u._id,
                                                {$push: {"countries": objCount._id}, $set: {"latitude": lat, "longitude": lon}},
                                                {safe : true, upsert: true, new : true},
                                                function(err, model){
                                                  i+=1;
                                                  if (err) res.send(err);
                                                  if (i == countries.length) {
                                                    var j = 0;
                                                    continents.forEach(function(continent){
                                                      Continent.findOne({"properties.CONTINENT": continent}, function(err,objConti){
                                                        if(err) {res.send(err);}
                                                        if(!objConti) {res.send(continent + " was not found in the continent database.")}
                                                          else{Language.findByIdAndUpdate(
                                                            u._id,
                                                            {$push: {"continents": objConti._id}},
                                                            {safe : true, upsert: true, new : true},
                                                            function(err, model){
                                                              j+=1;
                                                              if (err) res.send(err);
                                                              if (j == continents.length) {

                                                                if (institution !==""){
                                                                  Institution.findOneAndUpdate({"properties.institution":institution},
                                                                    {$push:{"properties.languages":u._id}},function(err,modelInst){
                                                                      Language.findByIdAndUpdate(
                                                                        u._id,
                                                                        {$push:{"institutions":modelInst._id}},
                                                                        function(err, modelInst){
                                                                          if (err) res.send(err);
                                                                          else{
                                                                            res.redirect("success")
                                                                          }
                                                                        }
                                                                      )}
                                                                  );
                                                                } else{
                                                                  res.redirect("success")
                                                                }
                                                               
                                                              }
                                                            }
                                                          )}
                                                      })
                                                    })
                                                  }
                                                  // console.log(test);
                                                }
                                              );
                                              }
                                            });
                                          })
                                        })
                                      }
                                    })
                                  }
                                })
                              }
                              else {
                                  die(res, "Error in contacting glottolog. Check queries or contact admin", u._id)

                              }

                            }
                          })
                        }
                      }
                    );
                  }
                })
              }
            }
          });

        }
      }
    });
    }

    catch(error){
      die(res, "Some error occured. Check entries or contact admin.", u._id);
    }     
  });


  router.post('/updateInstEntry', function(req,res){
    try{
    if(req.body.query.includes("lang")){
      console.log("REQ.BODY.QUERY "+ req.body.query);
      var target = "properties."+req.body.query;
      Institution.findByIdAndUpdate(req.body._id, 

      // Institutiontest.findByIdAndUpdate(req.body._id, 
        { 
          $set: { [target]: req.body.value, "properties.languages":[]}
        }, {safe : true, upsert: true, new : true},function(err,result){
          console.log(result);
        if(err) {res.send(err);}
        else{
           var lang_i = ["lang_1","lang_2","lang_3",
                           "lang_4","lang_5","lang_6",
                           "lang_7","lang_8","lang_9"];
          var i = 0;

          lang_i.forEach(function(language){
            // console.log(typeof result.properties.lang_1)
            var properties = result.properties;//.toObject();
            console.log(properties);
            if(properties[language]!== null){
              var current = properties[language];
              console.log(current + " 620");
              Language.findOne({"id":current}, function(err, obj){
                if (err) {res.send(err);}
                if(obj) {
                  Institution.findByIdAndUpdate(

                  // Institutiontest.findByIdAndUpdate(
                    req.body._id,
                    {$push: {"properties.languages": obj._id}},
                    {safe : true, upsert: true, new : true},
                    function(err, model){
                      console.log(obj._id +  "627");
                      // i+=1;
                      console.log(i);
                      if(err) {res.send(err)}
                      else if(i === lang_i.length-1){
                        res.redirect("back");
                      } else if(properties[lang_i[i+1]]==null){
                        res.redirect("back");
                      }else{
                        i+=1;
                      }
                      
                    });
                }
              });
            } 
        });
      }});

    }
    else if(req.body.query == "address"){
      // console.log("ELSESELSELSE");
      var options =  {
        host: 'maps.googleapis.com',
        path: '/maps/api/geocode/json?address='+req.body.value.replace(/ /g,'+')+',+New+York,+NY&key=AIzaSyBNPZeOy6YfgRd2TGCIdkJqgRUDE16nDf4'
      } 
      https.request(options, function(response,err) {
        // console.log(options.path);
        var result = '';

        response.on('data', function(chunk){
          result += chunk;
        });

        response.on('end',function(){

          if (result.includes("\"status\" : \"OK\"")!==true) {
            res.send("institution has no record on google maps. contact admin")
          }
          else{

            result = result.split("\n");
            var arr = [];
            // console.log("DIDIDIDIDID "+ req.body._id);
            for (var i = 0; i<result.length; i++) {
              if (result[i].includes("\"location\" : {")) {
                arr[0] = Number(result[i+2].split(":")[1].replace(/ /g,'').replace(',',''));
                arr[1] = Number(result[i+1].split(":")[1].replace(/ /g,'').replace(',',''));
                console.log(arr);
                Institution.findByIdAndUpdate(
                // Institutiontest.findByIdAndUpdate(
                  req.body._id,
                  { 
                    $set: {"geometry.coordinates": arr},
   
                  },{safe : true, upsert: true},
                  function(err, model) {
   
                    if(err){res.send(err);}
                    else{
                      Institution.findByIdAndUpdate(

                        req.body._id,
                        {$set: {"properties.address": req.body.value}},
                        {safe:true,upsert:true},function(error,obj){
                          if(!err){
                            res.redirect("back");
                          }
                        });

                    }
                  });
                break;
              }
            }
          }
        });
      }).end();

    }
    else{
      var target = "properties."+req.body.query;
      Institution.findByIdAndUpdate(

      // Institutiontest.findByIdAndUpdate(
        req.body._id,
        {$set: {[target]: req.body.value}},
        {safe:true,upsert:true},function(err,model){
          if(!err){
            res.redirect("back");
          }
        });

    }
    }
    catch(error){
      res.send("Some error occured. Please go back and check entries or contact admin.");
    }

  });
  router.post('/updateEntry', function(req, res) {
   console.log("update entry " + req.body.query + ' ' + req.body.value);

   try{

    if (req.body.query == "ntacode_1"){
      Neighborhood.findOne({"properties.NTACode": req.body.value}, function(err,obj){
        if(err) {
          // res.send(err);
        }
        if (!obj) {
          res.send("NTA Code is invalid. Go back and re-submit.");
        }
        else {
          Language.findByIdAndUpdate(req.body._id, { $set: { [req.body.query]: req.body.value}}, {upsert:true}, function(err,result){

          // Test.findByIdAndUpdate(req.body._id, { $set: { [req.body.query]: req.body.value}}, {upsert:true}, function(err,result){
            if (err)
              throw err
            else
              res.redirect('back');
          })
        }
      });
    } else if (req.body.query === "id"){

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
                          Language.findByIdAndUpdate(
                          // Test.findByIdAndUpdate(
                            req.body._id,
                            {$push: {"countries": obj._id}, $set: {"latitude": lat, "longitude": lon}},
                            {safe : true, upsert: true, new : true},
                            function(err, model){
                              i+=1;
                              if (err) res.send(err);
                              // console.log(i);
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

    } else if(req.body.query ==='videoURL'){
      var vidID = getVideoId(req.body.value).id;
      var embed ='';
      if (vidID){
        embed = 'https://youtube.com/embed/' + vidID;
      }
      
      Language.findByIdAndUpdate(req.body._id, { $set: { [req.body.query]: embed}}, {upsert:true}, function(err, result){
        if (err)
          throw err
        else
          res.redirect('back');
      })

    } else {

      var val = req.body.query == "endangermentNum" ? Number(req.body.value) : req.body.value
      console.log("val " + val + ' ' + typeof val);
      Language.findByIdAndUpdate(req.body._id, { $set: { [req.body.query]: val}}, {upsert:true}, function(err,result){
        if (err)
          throw err
        else
          res.redirect('back');
      })
    }
  }

  catch(error){
    res.send("Some error ocurred. Please go back and check entries or go back and conact admin")
  }

  });


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


  router.post('/addinstitution', function(req, res) {
    

      var u = new Institution({
    // var u = new Institutiontest({
      _id: mongoose.Types.ObjectId(),
      type : "Feature",
      properties:{        
        institution: req.body.institution,
        description: req.body.desc,
        address: req.body.addr,
        type: req.body.type,
        // languages : []
      },
      geometry : {
        type : "Point",
        coordinates : []
      }
    });

  

    langArray = req.body.languages.split(';')
    var lang_i = ["lang_1","lang_2","lang_3",
                  "lang_4","lang_5","lang_6",
                  "lang_7","lang_8","lang_9"];

    for (var i = 0; i<lang_i.length; i++){
      if (typeof langArray[i] !== 'undefined' && langArray[i]!=="") {
        u.properties[lang_i[i]] = langArray[i].trim();
        langArray[i] = langArray[i].trim()
      } else
          u.properties[lang_i[i]] = null
    }

    var j = 0;
    try{
    u.save(function(err){
      if(err){
        console.log(err);
        res.send(err);
      }else 
        var langIDs = [];
        langArray.forEach(function(language){
          Language.findOne({"id":language}, function(err, obj){
            if (err) {res.send(err);}
            if(!obj){dieInst(res, language + " was not found in the database. Add this language first or contact admin.", u._id)}
            else if(obj) {
              Institution.findByIdAndUpdate(
                u._id,
                {$push: {"properties.languages": obj._id}},
                {safe : true, upsert: true, new : true},
                function(err, model){
                  if (err) res.send(err);
                  j+=1;
                  if(j==langArray.length) {
                    var options =  {
                      host: 'maps.googleapis.com',
                      path: '/maps/api/geocode/json?address='+u.properties.address.replace(/ /g,'+')+',+New+York,+NY&key=AIzaSyBNPZeOy6YfgRd2TGCIdkJqgRUDE16nDf4'
                    } 
                    https.request(options, function(response,err) {
                      console.log(options.path);
                      console.log(response.status);
                      var result = '';

                      response.on('data', function(chunk){
                        result += chunk;
                      });
                      response.on('end',function(){
                        if (result.includes("\"status\" : \"OK\"")!==true) {
                          dieInst(res, "institution has no record on google maps. contact admin", u._id);
                        }
                        else{

                          result = result.split("\n");
                          var arr = [];
                          for (var i = 0; i<result.length; i++) {
                            if (result[i].includes("\"location\" : {")) {
                              arr[0] = Number(result[i+2].split(":")[1].replace(/ /g,'').replace(',',''));
                              arr[1] = Number(result[i+1].split(":")[1].replace(/ /g,'').replace(',',''));
                              Institution.findByIdAndUpdate(
                              
                              // Institutiontest.findByIdAndUpdate(
                                u._id,
                                {$set: {"geometry.coordinates": arr}},
                                function(err, model) {
                                  if(err){res.send(err);}
                                  else{
                                    res.redirect("success");
                                  }
                                });
                              break;
                            }
                          }
                        }
                      });
                    }).end();
                  }
                }
              );

            }
            else{
              dieInst(res, language + " was not found in the database. Please go back and correct to add.", u._id)
            }
          })
        })
        
    });
    }
    catch(error){
      dieInst(res, "Some error occured. Please check entries or contact admin.", u._id);
    }
    
  })

  router.get('/admin', function(req,res){
    res.render('admin/index', {title: 'Add to or Edit database'});
  });

  router.post('/removeLang', function(req,res){
    // console.log(req.body._id);
    console.log("REMOVE LANG")

    Language.findOne({_id: req.body._id},function(err, lang){
      lang = lang.toObject()
      console.log("lang id " + lang._id);
      var instID;
      if (lang.properties === undefined){
        instID = lang.institutions[0]
      }
      else {
        instID = lang.properties.institutions[0]
      }

      if (instID !== undefined){
        console.log('inst id '+instID);
        Institution.findById(instID, function(err, institution){
          if (err){res.send(err)}
          var arr = institution.properties.languages;
          arr.forEach(function(language, i){
            console.log("language 1099 "+typeof language + ' '+ typeof lang._id)
            if (language.toString()===lang._id.toString()){
              console.log("lang to remove: "+arr[i])

              arr.splice(i,1);
              console.log(arr);
              Institution.findByIdAndUpdate(instID, {$set: {"properties.languages": institution.properties.languages}}, function(err, obj){
                Language.remove({_id : req.body._id}, function(err) {

                  if(err) {
                    res.send(err);
                  }
                  else{
                    res.redirect("success");
                  }
                })
              })
            }
          })
        })
      } else {
        Language.remove({_id : req.body._id}, function(err) {

          if(err) {
            res.send(err);
          }
          else{
            res.redirect("success");
          }
        })

      }
    })
  });

  router.post('/removeInst', function(req,res){
    Institution.remove({_id : req.body._id}, function(err) {

    // Institutiontest.remove({_id : req.body._id}, function(err) {
      if(err) {
        res.send(err);
      }
      else{
        res.redirect("success");
      }
    })
  });

  router.get('/success', function(req,res){
    // console.log(req);
    res.render('admin/success', {title: 'Database operation was successful'});
  });

/* ~~~ export ~~~ */

module.exports = router;



