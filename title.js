import React, {
	Component,
	PropTypes,
} from 'react';

import {
	View,
	StyleSheet,
} from 'react-native';

export default class Title extends Component {

	static propTypes = {
		title: PropTypes.string,
	};

	renderTitle() {
    	let title = this.props.title;

      if (title) {
        return (
          <View style = {styles.title}>{title}</View>
        );
      } else {
        return null;
      }
  	}

	render () {
		return this.renderTitle();
	}
}

let styles = StyleSheet.create({
	title: {
    	height: 30,
    	justifyContent: 'center',
    	position: 'absolute',
    	paddingLeft: 10,
    	bottom: -30,
    	left: 0,
    	flexWrap: 'nowrap',
    	width: 250,
    	backgroundColor: 'transparent',
  	},
});