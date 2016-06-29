import React, {
	Component,
	PropTypes
} from 'react';

import {
	ScrollView,
	ViewPagerAndroid,
	StyleSheet,
	Dimensions,
	Platform,
} from 'react-native';

import TimerMixin from 'react-timer-mixin';

let styles = StyleSheet.create({
	wrapper: {
		backgroundColor: 'transparent',
		backgroundColor: 'red',
	},
});

export default Carousel = React.createClass({
	propTypes: {
		offset: PropTypes.object,
		loop: PropTypes.bool,
		index: PropTypes.number,
		width: PropTypes.number,
		height: PropTypes.number,
		direction: PropTypes.string,

		onScrollEnd: PropTypes.func,
	},
  	
  	mixins: [TimerMixin],

	getInitialState() {
		return {
			isScrolling: false
		}
  	},

	onScrollBeginDrag(e) {
		this.setState({
			isScrolling: true
		});
	},

	onScrollEndDrag(e) {
		this.setState({
			isScrolling: false
		});
	},

	onScrollEnd(e) {
		this.setState({
			isScrolling: false
		});

		let {width, height, direction} = this.props;

		// making our events coming from android compatible to logic
		if (!e.nativeEvent.contentOffset) {
			if (direction === 'x') {
				e.nativeEvent.contentOffset = {
					x: e.nativeEvent.position * width
				}
			} else {
				e.nativeEvent.contentOffset = {
					y: e.nativeEvent.position * height
				}
			}
		}

		// Note: `this.setState` is async, so I call the `onMomentumScrollEnd`
		// in setTimeout to ensure synchronous update `index`
		((e) => {
			let contentOffset = {...e.nativeEvent.contentOffset};
			this.setTimeout(() => {
				this.props.onScrollEnd && this.props.onScrollEnd(contentOffset)
			});
		})(e);
	},

	getSlideCount () {
		return React.Children.count(this.props.children);
	},

  	scrollBy(step) {
    	if (this.state.isScrolling || this.getSlideCount() < 2) {
    		return;
    	}

    	let {width, height, direction} = this.props;

    	let x = 0, y = 0;
    	if(direction === 'x') {
      		x = step * width
    	}
    	if(direction === 'y') {
      		y = step * height
    	}

    	if (Platform.OS === 'android') {
      		this.refs.scrollView && this.refs.scrollView.setPage(step)
    	} else {
      		this.refs.scrollView && this.refs.scrollView.scrollTo({
        		x: x,
        		y: y
      		});
    	}

    	this.setState({
      		isScrolling: true
    	});

    	// trigger onScrollEnd manually in android
    	if (Platform.OS === 'android') {
      		this.setTimeout(() => {
        		this.onScrollEnd({
          			nativeEvent: {
            			position: step,
          			}
        		});
      		}, 50);
    	}
  	},

	render() {
		let pages = this.props.children;

		if (Platform.OS === 'ios') {
			return ( 
				<ScrollView 
					ref = "scrollView" 
					{...this.props}
					contentContainerStyle = {[styles.wrapper, this.props.style]}
					contentOffset = {this.props.offset}
					onScrollBeginDrag = {this.onScrollBeginDrag}
					onScrollEndDrag = {this.onScrollEndDrag}
					onMomentumScrollEnd = {this.onScrollEnd}
				> 
					{pages} 
				</ScrollView>
			);
		} else {
			return ( 
				<ViewPagerAndroid 
					ref = "scrollView" 
					{...this.props}
					initialPage = {this.props.index}
					onPageSelected = {this.onScrollEnd}
					style = {{flex: 1}}
				> 
					{pages} 
				</ViewPagerAndroid>
			);
		}
	}
});