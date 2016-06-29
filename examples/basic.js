var React = require('react')
var ReactNative = require('react-native')
var Swiper = require('./swiper.js')
var {
  StyleSheet,
  Text,
  View,
} = ReactNative

var styles = StyleSheet.create({
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  }
})

var swiper = React.createClass({
  render: function() {
    return (
      <Swiper
      onMomentumScrollEnd={this._onMomentumScrollEnd}
      showButton={true}
      autoplay = {true}
      autoplayTimeout = {2}
      height = {100}
      >
        <View style={styles.slide1}>
          <Text style={styles.text}>Hello Swiper</Text>
        </View>
        <View style={styles.slide2}>
          <Text style={styles.text}>Beautiful</Text>
        </View>
        <View style={styles.slide3}>
          <Text style={styles.text}>And simple</Text>
        </View>
        <View style={styles.slide1}>
          <Text style={styles.text}>And Pretty</Text>
        </View>
      </Swiper>
    )
  }
})

module.exports = swiper

