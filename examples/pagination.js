import React, {
	Component,
	PropTypes,
} from 'react';

import {
	View,
  	StyleSheet,
} from 'react-native';

export default class Pagination extends Component {

	static propTypes = {
		activeDot: PropTypes.element,
		dot: PropTypes.element,
		total: PropTypes.number,
		index: PropTypes.number,
		paginationStyle: PropTypes.object,
		direction: PropTypes.string,
	};

	render () {
		return this.renderPagination();
	}

	renderPagination() {

		// By default, dots only show when `total` > 2
		if (this.props.total <= 1) {
			return null
		}

		let dots = []
		let ActiveDot = this.props.activeDot || <View style = {styles.activeDot}/>;
		let Dot = this.props.dot || <View style = {styles.dot}/>;

		for (let i = 0; i < this.props.total; i++) {
			if (i === this.props.index) {
				dots.push(React.cloneElement(ActiveDot, {
					key: i
				}));
			} else {
				dots.push(React.cloneElement(Dot, {
					key: i
				}));
			}
		}

		return ( 
			<View 
				pointerEvents = 'none'
				style = {[styles['pagination_' + this.props.direction], this.props.paginationStyle]} 
			> 
				{dots} 
			</View>
		)
	}
}

let styles = StyleSheet.create({
	pagination_x: {
    	position: 'absolute',
    	bottom: 25,
    	left: 0,
    	right: 0,
    	flexDirection: 'row',
    	flex: 1,
    	justifyContent: 'center',
    	alignItems: 'center',
    	backgroundColor:'transparent',
  	},

  	pagination_y: {
    	position: 'absolute',
    	right: 15,
    	top: 0,
    	bottom: 0,
    	flexDirection: 'column',
    	flex: 1,
    	justifyContent: 'center',
    	alignItems: 'center',
    	backgroundColor:'transparent',
  	},

  	activeDot: {
		backgroundColor: '#007aff',
		width: 8,
		height: 8,
		borderRadius: 4,
		marginLeft: 3,
		marginRight: 3,
		marginTop: 3,
		marginBottom: 3,
  	},

  	dot: {
  		backgroundColor: 'rgba(0,0,0,.2)',
		width: 8,
		height: 8,
		borderRadius: 4,
		marginLeft: 3,
		marginRight: 3,
		marginTop: 3,
		marginBottom: 3,
  	}
});