import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import CameraContainer from './camera/cameraContainer';

export default class App extends React.Component {
  constructor() {
    super()

    this.state = {
      showCamera: false
    }
  }

  showCamera = () => {
    this.setState({showCamera: !this.state.showCamera})
  }

  renderCamera = () => {
    return <CameraContainer showCamera={this.showCamera}/>
  }

  renderStart = () => {
    return (
      <View style={styles.container}>
        <Button
          onPress={this.showCamera}
          title="Chicken?"
          color="#FAB124"
          accessibilityLabel="Show camera for chicken recognition"
        />
      </View>
    )
  }

  render() {
    // console.log('state!', this.state);

    return (
      <View style={{flex: 1}}>
        {!this.state.showCamera ? this.renderStart() : this.renderCamera()}
      </View>
    )


  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
