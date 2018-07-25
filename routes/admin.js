exports.admin = function(req,res){
  res.render('admin/index');
  console.log('this is the admin controller');
}


exports.newlanguage = function(req, res, countries, institutions, neighborhoods, continents){
  console.log(neighborhoods);
  res.render('admin/newlanguage',{ 
    title: 'Add new language',
    countries:JSON.stringify(countries),
    institutions:JSON.stringify(institutions),
    neighborhoods:JSON.stringify(neighborhoods),
    continents:JSON.stringify(continents)
  });
}

exports.success = function(req, res){
  res.render('admin/success');
}

exports.addlanguage = function(req, res){
  res.redirect('back')
  console.log(req);
  // var obj = new Object({
  //   _id: mongoose.Types.ObjectId(),
  //   hid: req.body.hid,
  //   id: req.body.glottocode,
  //   language: req.body.language,
  //   description: req.body.description,
  //   // region: req.body.region,
  //   endangermentNum: req.body.endangermentNum,
  //   status: req.body.status,
  //   ntacode_1: req.body.ntacode_1,
  //   script: req.body.endonym
  // })
}