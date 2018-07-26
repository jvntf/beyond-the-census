var mongoose = require('mongoose');

exports.admin = function(req,res, languages){
  res.render('admin/index', {
    title: 'Admin page',
    languages: JSON.stringify(languages)
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
  // console.log(JSON.stringify(institutions));
  console.log(lang)
  res.render('admin/editlanguage',{ 
    title: 'Edit a language',
    countries:countries,
    institutions:institutions,
    neighborhoods:neighborhoods,
    continents:continents,
    lang: lang
  });
}


exports.success = function(req, res){
  res.render('admin/success');
  // res.redirect('back');
}
exports.error = function(req,res){
  res.send("error ocurred");
}
