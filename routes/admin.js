var mongoose = require('mongoose');

exports.admin = function(req,res, langs,insts){
  console.log(typeof langs, typeof insts)
  res.render('admin/index', {
    title: 'Admin page',
    languages: JSON.stringify(langs),
    institutions: JSON.stringify(insts)
  });
}


exports.newlanguage = function(req, res, countries, institutions, neighborhoods, continents){
  // console.log(JSON.stringify(institutions));
  res.render('admin/newlanguage',{ 
    title: 'Add new language',
    countries:JSON.stringify(countries),
    institutions:JSON.stringify(institutions),
    neighborhoods:JSON.stringify(neighborhoods),
    continents:JSON.stringify(continents)
  });
}
exports.newinstitution = function(req, res){
  // console.log(neighborhoods);
  res.render('admin/newinstitution')
}

exports.editlanguage = function(req, res, countries, institutions, neighborhoods, continents, lang){
  res.render('admin/editlanguage',{ 
    title: 'Edit a language',
    countries:JSON.stringify(countries),
    institutions:JSON.stringify(institutions),
    neighborhoods:JSON.stringify(neighborhoods),
    continents:JSON.stringify(continents),
    lang: JSON.stringify(lang)
  });
}
exports.editinstitution = function(req, res, inst){
  // console.log(neighborhoods);
  res.render('admin/editinstitution',{
    institution:JSON.stringify(inst)
  })
}


exports.success = function(req, res){
  res.render('admin/success');
}
exports.error = function(req,res,err){
  res.send(err.message);
}
