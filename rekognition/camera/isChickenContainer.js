import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Button, Image, Dimensions } from 'react-native'
import { Camera, Permissions } from 'expo'

export default class IsChickenContainer extends React.Component {

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor:'#FAB124',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-around'
        }}>
        <Text style={{fontWeight: 'bold', fontSize: 40, color:'#FFF', marginTop: 20}}>
          { this.props.isChicken ? 'WINNER WINNER CHICKEN DINNER' : 'not chicken...' }
        </Text>
        <Image
          style={{ resizeMode: "cover", width: Dimensions.get('window').width, height: 300}}
          source={{uri: this.props.image}}
        />
        <TouchableOpacity
          style={{
            borderWidth: 2,
            borderColor: 'rgba(0,0,0,0.2)',
            alignItems: 'center',
            justifyContent: 'center',
            width: 150,
            height: 65,
            backgroundColor: '#D32F2F',
            borderRadius: 5,
            // marginBottom: 20
          }}
          onPress={this.props.tryAgain}
        >
        <Text style={{fontWeight: 'bold', fontSize: 20, color:'#FFF'}}>
          TRY AGAIN?
        </Text>
        </TouchableOpacity>
      </View>
    )
  }


}
