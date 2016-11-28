var paypal = require('paypal-rest-sdk');

paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'insert api keys',
  'client_secret': 'insert api keys'
});

exports.payoutCauses = function(payoutArray, callback) {
  var sender_batch_id = Math.random().toString(36).substring(9);
  var payoutbatchID;

  var create_payout_json = {
    "sender_batch_header": {
      "sender_batch_id": sender_batch_id,
      "email_subject": "You have new donations from AddUp"
    },
    "items": []
  };

  for ( var i = 0; i < payoutArray.length; i++ ) {
    create_payout_json.items.push({
      "recipient_type": "EMAIL",
      "amount": {
        "value": payoutArray[i].value,
        "currency": "USD"
      },
      "receiver": payoutArray[i].email,
      "note": "Thank you.",
      "sender_item_id": "item_" + i
    });
  }
  console.log('sending', create_payout_json);

  paypal.payout.create(create_payout_json, function (error, payout) {
    if (error) {
      callback(error.response, null);
    } else {
      console.log("Create Payout Response");
      callback(null, payout);
    }
  }); 
}

exports.getPayoutResult = function(payout_batch_id, callback) {
  paypal.payout.get(payout_batch_id, function (error, payout) {
    if (error) {
      callback(error, null);
    } else {
      console.log("Get Payout Response");
      callback(null, payout);
    }
  }); 
};

//EXAMPLE USE
//var testArray = [{email: "helga@gmail.com", value: 0.95}, {email: "adduptestaccount@gmail.com", value: 0.92}];
// exports.payoutCauses(testArray, function(err, result) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(JSON.stringify(result));
//   }
// })
// exports.getPayoutResult('KUETXR24UAHG6', function(err, result) {
//   if (err) { console.log(err); }
//   else {
//     console.log(JSON.stringify(result));
//   }
// })