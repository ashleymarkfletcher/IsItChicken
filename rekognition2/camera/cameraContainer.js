import React from 'react';
import { Text, View, TouchableOpacity, Button } from 'react-native';
import { Camera, Permissions } from 'expo';
// const AWS = require('aws-sdk/dist/aws-sdk-react-native');

export default class CameraContainer extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
    console.log('gotem!');
  }

  render() {
    const { hasCameraPermission } = this.state;

    console.log('here!', hasCameraPermission);
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
    if (this.camera) {
      let photo = await this.camera.takePictureAsync({base64:true});
      console.log('photo!', photo);
    }
  };
}
