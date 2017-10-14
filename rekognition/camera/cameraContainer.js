import React from 'react';
import { Text, View, TouchableOpacity, Button, Image } from 'react-native';
import { Camera, Permissions } from 'expo';
import AWS from 'aws-sdk/dist/aws-sdk-react-native';
// import Base64 from'js-base64';

// const b64 = Base64.Base64
// AWS.config.loadFromPath('../credentials.json');
AWS.config.update({region: 'eu-west-1'});
const rekognition = new AWS.Rekognition();

export default class CameraContainer extends React.Component {
  // state = {
  //   hasCameraPermission: null,
  //   type: Camera.Constants.Type.back,
  //   image: null
  // }

  constructor(){
    super()

    this.state = {
      hasCameraPermission: null,
      type: Camera.Constants.Type.back,
      image: null
    }
  }

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
    console.log('gotem!');
  }

  render() {
    const { hasCameraPermission, image } = this.state;

    console.log('image!', image);
    if (hasCameraPermission === null) {
      console.log('itsNUll');
      return <View />;
    } else if (hasCameraPermission === false) {
      console.log('fale!');
      return <Text>No access to camera</Text>;
    } else {
      console.log('YEAGG');
      return (

        <Camera style={{ flex: 1 }} type={this.state.type} ref={ref => { this.camera = ref; }} >
          <View
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              flexDirection: 'row',
            }}>
            <Button onPress={this.snap} title="Take a photo" />
            {image!=null &&
              <Image
                style={{width: 200, height: 200}}
                source={{uri: image}}
              />
            }
            <TouchableOpacity
              style={{
                flex: 0.1,
                alignSelf: 'flex-end',
                alignItems: 'center',
              }}
              onPress={() => {
                this.props.showCamera()
                // this.setState({
                //   type: this.state.type === Camera.Constants.Type.back
                //     ? Camera.Constants.Type.front
                //     : Camera.Constants.Type.back,
                // });
                console.log('press!');
              }}>
              <Text
                style={{ fontSize: 18, marginBottom: 10, color: 'white', width:100 }}>
                {' '}Close{' '}
              </Text>
            </TouchableOpacity>
          </View>
        </Camera>

      );
    }
  }

  snap = async () => {
    console.log('snap');
    if (this.camera) {
      console.log('has camera');
      let photo = await this.camera.takePictureAsync({base64:true, quality:0.5, width:1080, height:1920});
      // console.log('photo!', photo.base64.slice(0,100));
      // console.log('contains', photo.base64.includes(',') );
      //  const buffer = new Buffer(photo.base64, 'base64');
      let result = await this.checkForLabels(photo.base64);
      //  this.rekognize(photo.base64)
      let labels = result.responses[0].labelAnnotations
      console.log('after',labels);
      console.log('isChicken', this.isChicken(labels));
      if (this.isChicken(labels)) {
        // this.setState()
        // http://api.giphy.com/v1/gifs/random?api_key=LvaT1Nz43UBBW0J31f232ubkXyEVzmBE&tag=chicken

        this.getImage('chicken').then((imageURL) => {


          console.log('imageURL', imageURL);


          this.setState({image: imageURL})
        })
      } else {
        this.getImage('sad').then((imageURL) => {


          console.log('imageURL', imageURL);


          this.setState({image: imageURL})
        })
      }
    }
  };

  isChicken = (labels) => {
    return labels.find((label) => {
      return label.description.includes('chicken');
    })
  }

  getImage = (tag) => {
    return fetch('http://api.giphy.com/v1/gifs/random?api_key=LvaT1Nz43UBBW0J31f232ubkXyEVzmBE&tag=' + tag)
    .then((response) => response.json())
    .then((responseJson) => {
      console.log('response!', responseJson.data.image_original_url);
      // return responseJson.movies;
      return responseJson.data.image_original_url
    })
    .catch((error) => {
      console.error(error);
    });
  }

  // rekognize = (photoData) => {
  //   // console.log('here!!!',photoData.slice(0,100));
  //   // dataURItoBlob(photoData,afb)
  //
  //
  //
  //   var params = {
  //     Image: {
  //       Bytes: Base64.atob(photoData)
  //     },
  //     MaxLabels: 20,
  //     MinConfidence: 70
  //   }
  //   // Window.atob(photoData)
  //   console.log('rekognize!');
  //   rekognition.detectLabels(params, function(err, data) {
  //     if (err) console.log(err, err.stack); // an error occurred
  //     else {
  //       console.log(data);           // successful response
  //       var isItAHotdog = false;
  //       for (var label_index in data.Labels) {
  //         var label = data.Labels[label_index];
  //         if(label['Name'] == "chicken") {
  //          if(label['Confidence'] > 85) {
  //             isItAHotdog = true;
  //             console.log('IT IS CHICKEN');
  //           }
  //         }
  //       }
  //
  //       if(isItAHotdog == false) {
  //         console.log('no chicken...');
  //       }
  //     }
  //   })
  // }

  checkForLabels = async (base64) => {
      return await
          fetch('https://vision.googleapis.com/v1/images:annotate?key=AIzaSyArSrHLH3QvI5TtIX9ZMmOYONOZBDs--Sc', {
              method: 'POST',
              body: JSON.stringify({
                  "requests": [
                      {
                          "image": {
                              "content": base64
                          },
                          "features": [
                              {
                                  "type": "LABEL_DETECTION"
                              }
                          ]
                      }
                  ]
              })
          }).then((response) => {
              return response.json();
          }, (err) => {
              console.error('promise rejected')
              console.error(err)
          });
  }
}
