import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Button, Image, Dimensions } from 'react-native'
import { Camera, Permissions } from 'expo'
import IsChickenContainer from './isChickenContainer'

export default class CameraContainer extends React.Component {

  constructor(){
    super()

    this.state = {
      hasCameraPermission: null,
      type: Camera.Constants.Type.back,
      image: null,
      isChicken: null,
      loading: false
    }
  }

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA)
    this.setState({ hasCameraPermission: status === 'granted' })
  }

  render() {
    const { hasCameraPermission, image, isChicken, loading } = this.state

    if (hasCameraPermission === null) {
      return <View />
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>
    } else {
      return (
        image==null ?
        <Camera
          style={{
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-end'
          }}
          type={this.state.type}
          ref={ref => { this.camera = ref }}
        >
          {loading &&
            <Image
              style={{flex:0.6, marginBottom:30}}
              source={require('../assets/loading.gif')}
            />
          }
          <TouchableOpacity
            style={{
              borderWidth: 2,
              borderColor: 'rgba(0,0,0,0.2)',
              alignItems: 'center',
              justifyContent: 'center',
              width: 100,
              height: 100,
              backgroundColor: '#FAB124',
              borderRadius: 100,
              marginBottom: 20
            }}
            onPress={this.snap}
          >
            <Image
              style={{width: 70, height: 70}}
              source={require('../assets/leg.png')}
            />
          </TouchableOpacity>
        </Camera>
        :
        <IsChickenContainer image={image} tryAgain={this.tryAgain} isChicken={isChicken} />
      )
    }
  }

  snap = async () => {
    if (this.camera) {
      let photo = await this.camera.takePictureAsync({base64:true, quality:0.5, width:1080, height:1920})

      let result = await this.checkForLabels(photo.base64)

      let labels = result.responses[0].labelAnnotations

      console.log('labels', labels)
      let chicken = this.isChicken(labels)
      console.log('isChicken', chicken)

      if (chicken) {

        this.getImage('chicken').then((imageURL) => {

          console.log('imageURL', imageURL)

          this.setState({ image: imageURL, isChicken:chicken, loading: false })
        })
      } else {
        this.getImage('sad').then((imageURL) => {

          console.log('imageURL', imageURL)

          this.setState({ image: imageURL, isChicken:chicken, loading: false })
        })
      }
    }
  }

  isChicken = (labels) => {
    return labels.find((label) => {
      return label.description.includes('chicken')
    })
  }

  getImage = (tag) => {
    return fetch('http://api.giphy.com/v1/gifs/random?api_key=LvaT1Nz43UBBW0J31f232ubkXyEVzmBE&tag=' + tag)
    .then((response) => response.json())
    .then((responseJson) => {
      console.log('response!', responseJson.data)
      // return responseJson.movies
      return responseJson.data.image_original_url
    })
    .catch((error) => {
      console.error(error)
    })
  }

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
      })
      .then(response => response.json())
      .catch((err) => {
        console.error('promise rejected')
        console.error(err)
      })
  }

  tryAgain = () => {
    this.setState({ image: null })
  }
}
