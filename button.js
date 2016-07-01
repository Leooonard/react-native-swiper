import React, {
	Component,
	PropTypes
} from 'react';

import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity
} from 'react-native';

let styles = StyleSheet.create({
  

  buttonText: {
    fontSize: 50,
    color: '#007aff',
    fontFamily: 'Arial',
  },
});

class Button extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		let button = undefined;

		if (React.isValidElement(this.props.button)) {
			button = this.props.button;
		} else if (typeof this.props.button === 'string') {
			button = <Text style = {styles.buttonText}>{this.props.button}</Text>
		} else {
			button = null;
		}

		return (
      		<TouchableOpacity onPress={() => this.props.press()}>
        		<View>{button}</View>
      		</TouchableOpacity>
    	);
	}
}

class NextButton extends Component {
	constructor(props) {
		super(props);
	}

	render() {
      	let button = this.props.button || '›';

    	return (
    		<Button 
    			press = {() => this.props.press()} 
    			button = {button} 
    		/>
    	);
	}
}

class PrevButton extends Component {
	constructor(props) {
		super(props);
	}

	render() {
    	let button = this.props.button || '‹';

    	return (
      		<Button 
      			press = {() => this.props.press()} 
    			button = {button} 
    		/>
    	);
	}
}

export {
	NextButton,
	PrevButton
};