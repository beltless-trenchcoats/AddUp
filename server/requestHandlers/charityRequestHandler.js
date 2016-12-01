var request = require('request');

var Transactions = require('../db/controllers/transactions');
var Charities = require('../db/controllers/charities');
var helper = require('../helpers');

//edit helper function to set to dev mode or production mode
helper.mode();

//Sample request body (body can take category, searchTerm, category, city, state, zipCode)
// {
//   "category": "A",
//   "city": "Santa Rosa",
//   "state": "CA"
// }
exports.charitySearch = function(req, res) {
  if (req.body.type === 'Custom Cause') {
    var keyWordMap = {
      searchTerm: 'name',
      category: 'category',
      city: 'city',
      state: 'state',
      zipCode: 'zip',
      id_owner: 'id_owner',
      private: 'private'
    };
    var searchBody = {};
    for (var key in keyWordMap) {
      if (req.body[key]) {
        searchBody[keyWordMap[key]] = req.body[key];
      }
    }
    Charities.searchCustomCauses(searchBody, function(err, results) {
      if (err) {
        console.log(err);
        res.send(err);
      } else if (!results) {
        res.send();
      } else {
        results.forEach(function(item) {
          item.charityName = item.name;
          delete item.name;
          item.zipCode = item.zip;
          delete item.zip;
          item.missionStatement = item.mission_statement;
          delete item.mission_statement;
          item.category = helper.convertCategoryToString(item.category);
        });
        res.send(results);
      };
    });
  } else {
    var options = {
      method: 'post',
      body: req.body,
      json: true,
      url: 'http://data.orghunter.com/v1/charitysearch?user_key=' + process.env.ORGHUNTER_KEY
    };
    request(options, function (err, result, body) {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        res.send(JSON.stringify(body.data));
      }
    });
  }
};

//charityId in request is EIN
// exports.getCharityInfo = function (req, res) {
//   if (req.body.type === 'charity') {
//     var options = {
//       method: 'post',
//       body: {charityId: req.body.charityId},
//       json: true,
//       url: 'http://data.orghunter.com/v1/charitypremium?user_key=' + process.env.ORGHUNTER_KEY + '&ein=' + req.body.charityId
//     };
//     request(options, function (err, result, body) {
//       if (err) {
//         console.log(err);
//         res.send(err);
//       } else {
//         Charities.getCharityFields({ein: req.body.charityId}, function(err, result) {
//           if (err) {
//             console.log(err);
//           } else {
//             var toSend = body.data;
//             toSend.total_donated = result[0] ? result[0].total_donated : 0;
//             res.send(JSON.stringify(toSend));
//           }
//         });
//       }
//     });
//   } else {
//     Charities.getCharityFields({id: req.body.charityId}, function(err, result) {
//       if (err) {
//         console.log(err);
//       } else {
//         var toSend = result[0];
//         toSend.category = helper.convertCategoryToString(toSend.category);
//         res.send(toSend);
//       }
//     });
//   }
// };

exports.getCharityInfo = function (req, res) {
  if (req.body.type === 'charity') {
    var options = {
      method: 'post',
      body: {charityId: req.body.charityId},
      json: true,
      url: 'http://data.orghunter.com/v1/charitypremium?user_key=' + process.env.ORGHUNTER_KEY + '&ein=' + req.body.charityId
    };
    request(options, function (err, result, body) {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        Charities.getCharityFields({ein: req.body.charityId}, function(err, result) {
          if (err) {
            console.log(err);
          } else {
            var toSend = body.data;
            toSend.total_donated = result[0] ? result[0].total_donated : 0;
            res.send(JSON.stringify(toSend));
          }
        });
      }
    });   
  } else {
    if (req.body.charityId) { var filterFields = {id: req.body.charityId}; }
    else { var filterFields = null; }
    Charities.getCharityFields(filterFields, function(err, result) {
      if (err) {
        console.log(err);
      } else {
        if (!(req.body.charityId)) {
          res.send(result);
        } else {
          var toSend = result[0];
          toSend.category = helper.convertCategoryToString(toSend.category);
          res.send(toSend);
        }
      }
    });
  }
};

//app.post('/api/charity/savedInfo', 

exports.getCharityInfoFromDB = function (req, res) {
  Charities.getCharityFields({ein: req.body.ein}, function (err, data) {
    if (err) {
      res.send(err)
    } else {
      res.send(data[0])
    }
  })
}




//===================CUSTOM CAUSES=====================
// app.post('/api/customCause/add', 
exports.addCustomCause = function(req, res) {
  Charities.createCharity(req.body, function(err, result) {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.send(result);
    }
  })
};

// app.post('/api/customCause/search', 
exports.searchCustomCause = function(req, res) {
  Charities.searchCustomCauses(req.body, function(err, result) {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.send(result);
    }
  })
};

// app.post('/api/customCause/transactions', 
exports.getCustomCauseTransactions = function(req, res) {
  Transactions.getTransactionsForCharity(req.body.charityID, function(err, response) {
    if (err) {
      res.send(err);
    } else {
      res.send(response);
    }
  });
};

// app.post('/api/charity/update', 
exports.updateCustomCause = function(req, res) {
  Charities.updateCharity(req.body.charityID, req.body.updateFields, function(result) {
    res.send(result);
  });
};

exports.gmaps = function(req, res) {
  res.send(process.env.GMAPS_KEY);
};