var Users = require('../db/controllers/users');
var Transactions = require('../db/controllers/transactions');
var UserCharities = require('../db/controllers/usersCharities');
var Charities = require('../db/controllers/charities');

var aws = require('aws-sdk');
var S3_BUCKET = process.env.S3_BUCKET || 'addupp-profile-photos';
var helpers = require('../helpers');

//edit helper function to set to dev mode or production mode
helpers.mode();

exports.updateUserCharities = function(req, res) {
  var userEmail = req.body.email;
  var promises = [];
  req.body.charities.forEach(function (charity) {
    // Remove any charities that the user has marked to remove
    if (charity.remove) {
      UserCharities.remove(userEmail, charity.id, function (err, charityRemoved) {
        err ? console.log(err) : null;
      });
    } else { // Check if the current charity has already been saved to the database
      if (charity.type === 'custom') {
        var searchField = {id: charity.id};
      } else {
        var searchField = {ein: charity.ein};
      }
      Charities.getCharityFields(searchField, function (err, results) {
        // If it is not in db, add and also add entry to userscharities to link user to charity
        if (results.length === 0) {
          Charities.createCharity(charity, function (err, charityAdded) {
            if (err) {
              console.log(err);
            } else {
              promises.push(UserCharities.insert(userEmail, charityAdded.id, charity.percentage));
            }
          })
        } else { // If the charity is already in the db, check if the user is already linked to it
          var charityId = results[0].id;
          UserCharities.getUserCharityFields(userEmail, charityId, function (err, results) {
            if (results === null) {
              // If the user is not linked to the charity, add entry to db
              promises.push(UserCharities.insert(userEmail, charityId, charity.percentage));
            } else { //If they are already linked, just update the percentage
              promises.push(UserCharities.updatePercentage(userEmail, charityId, charity.percentage));
            }
          });
        }
      });
    }
  });
  Promise.all(promises).then(() => res.sendStatus(200));
}

exports.getUserInfo = function(req, res) {
  Users.getUserFields(req.body.idOrEmail, function(err, data) {
    if (err) {
      res.send(err);
    } else {
      res.send(data[0]);
    }
  });
}

exports.getUserTransactions = function(req, res) {
  if (req.body.email) {
    Transactions.getTransactions(req.body.email, function(err, data) {
      if (err) {
        res.send(err);
      } else {
        res.send(data);
      }
    });
  } else {
    res.send([]);
  }
}

exports.getUserCharityDonations = function(req, res) {
  UserCharities.getUsersCharityDonationsInfo(req.body.email, function(err, data) {
    if (err) {
      res.send(err);
    } else {
      res.send(data);
    }
  })
}

exports.updateUserInfo = function(req, res) {
  var email = req.body.email;
  var newEmail = req.body.newEmail;
  var newPassword = req.body.newPassword;
  var newPhotoUrl = req.body.photoUrl;
  var newLimit = req.body.limit;
  if(newEmail) {
    Users.updateUser(email, {email: newEmail}, function(result) {
      res.send(result);
    })
  } else if (newPassword) {
    Users.updateUser(email, {password: newPassword}, function(result) {
      res.send(result);
    })
  } else if (newPhotoUrl) {
    Users.updateUser(email, {photo_url: newPhotoUrl}, function(result) {
      res.send(result);
    })
  } else {
    Users.updateUser(email, {monthly_limit: newLimit}, function(result) {
      res.send(result);
    });
  }
}

exports.getS3Url = (req, res) => {
  console.log('this is running access key id', process.env.AWS_ACCESS_KEY_ID, 'secret', process.env.AWS_SECRET_ACCESS_KEY);
  var s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY});
  var fileName = req.query['file-name']
  var fileType = req.query['file-type']
  var s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
      console.log(err);
      return res.end();
    }
    var returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };
    res.write(JSON.stringify(returnData));
    res.end();
  });
};
