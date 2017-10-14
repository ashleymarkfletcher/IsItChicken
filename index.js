const request = require('request').defaults({ encoding: null });
const AWS = require('aws-sdk');
AWS.config.loadFromPath('./credentials.json');
AWS.config.update({region: 'eu-west-1'});
const rekognition = new AWS.Rekognition();

var image_url = "https://images-na.ssl-images-amazon.com/images/I/81rmOGQoDkL._SL1500_.jpg"

request.get(image_url, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var params = {
      Image: {
        Bytes: body
      },
      MaxLabels: 20,
      MinConfidence: 70
    }

    rekognition.detectLabels(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else {
        console.log(data);           // successful response
        var isItAHotdog = false;
        for (var label_index in data.Labels) {
          var label = data.Labels[label_index];
          if(label['Name'] == "Skateboard") {
           if(label['Confidence'] > 85) {
              isItAHotdog = true;
              console.log('hot daawwwwwggg');
            }
          }
        }
        if(isItAHotdog == false) {
          console.log('no dawg...');
        }
      }
    })
  }
})
