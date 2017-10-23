var fs = require('fs');
var csv = require('csv');
var _ = require('lodash');
var ids = [];



// var sourcePath = '../source/QueensLanguages.csv';  // path to file with utf8 encoding
var sourcePath = 'languages.csv';  // path to file with utf8 encoding

var newData = 'ids.csv';  // path to file with utf8 encoding

var csvFile = '../../data/glottoQueens_reExport.csv';  // path to file with utf8 encoding


var errorLogPath = '../log.txt';
fs.readFile(csvFile, 'utf8', (err, data) => {
  data = data.split('\n')
  console.log(data[0]);
  // console.log(data[15]);
  fs.readFile(sourcePath, 'utf8', (err, curLangs) => {

    fs.readFile(newData, 'utf8', (err, newLangs)=> {
      newLangs = newLangs.split(',');
      var x = 1;
      newLangs.forEach(function(id,index){

        if (curLangs.indexOf(id.trim())<0){
            // console.log('\n');
            // console.log(id.trim() + ' ' + index);
            console.log(data[index]);
            // fs.writeFile('newEntries.csv', data[index], 'utf8');
            // console.log(data);
            // 
            x = x+1;
        }
      })
    })
})


  });

    

