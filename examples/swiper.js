/**
 * react-native-swiper
 * @author leecade<leecade@163.com>
 */
import React from 'react';
import ReactNative, {
  StyleSheet,
  View,
  Dimensions
} from 'react-native';

// Using bare setTimeout, setInterval, setImmediate
// and requestAnimationFrame calls is very dangerous
// because if you forget to cancel the request before
// the component is unmounted, you risk the callback
// throwing an exception.
import TimerMixin from 'react-timer-mixin';

import Carousel from './carousel.js';
import Pagination from './pagination.js';
import Title from './title.js';
import {
  NextButton,
  PrevButton
} from './button.js';

let {width, height} = Dimensions.get('window');

let styles = StyleSheet.create({
  buttonWrapper: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    left: 0,
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  container: {
    backgroundColor: 'transparent',
    position: 'relative',
  },

  slide: {
    backgroundColor: 'transparent',
  },
});

const DIRECTION = {
  y: 'y',
  x: 'x'
};

module.exports = React.createClass({
  propTypes: {
    horizontal: React.PropTypes.bool,
    showPagination: React.PropTypes.bool,
    showButton: React.PropTypes.bool,
    loop: React.PropTypes.bool,
    autoplay: React.PropTypes.bool,
    autoplayTimeout: React.PropTypes.number,
    autoplayDirection: React.PropTypes.bool,
    index: React.PropTypes.number,

    renderPagination: React.PropTypes.func,
    children: React.PropTypes.node.isRequired,
    style: View.propTypes.style,

    pagingEnabled                    : React.PropTypes.bool,
    showsHorizontalScrollIndicator   : React.PropTypes.bool,
    showsVerticalScrollIndicator     : React.PropTypes.bool,
    bounces                          : React.PropTypes.bool,
    scrollsToTop                     : React.PropTypes.bool,
    removeClippedSubviews            : React.PropTypes.bool,
    automaticallyAdjustContentInsets : React.PropTypes.bool,
  },

  mixins: [TimerMixin],
  autoplayTimer: null,

  getDefaultProps() {
    return {
      horizontal: true,
      showPagination: true,
      showButton: false,
      loop: true,
      autoplay: false,
      autoplayTimeout: 2.5,
      autoplayDirection: true,
      index: 0,

      pagingEnabled                    : true,
      showsHorizontalScrollIndicator   : false,
      showsVerticalScrollIndicator     : false,
      bounces                          : false,
      scrollsToTop                     : false,
      removeClippedSubviews            : true,
      automaticallyAdjustContentInsets : false,
    }
  },

  getInitialState() {
    return this.initState(this.props);
  },

  componentWillReceiveProps(props) {
    let newState = this.initState(props);
    this.setState(newState);
  },

  componentDidMount() {
    this.autoplay();
  },

  getSlideCount(children) {
    return React.Children.count(children);
  },

  updateSlideIndex(currentIndex, oldSlideCount, currentSlideCount) {
    if (oldSlideCount === currentSlideCount) {
      return currentIndex;
    } else if (currentSlideCount > 1) {
      return Math.min(currentIndex, currentSlideCount - 1);
    } else {
      return 0;
    }
  },

  generateSlideStyle(width, height) {
    return [
      {
        width,
        height
      },
      styles.slide
    ];
  },

  generateSlide(children, isLoop, slideStyle) {
    let slideCount = this.getSlideCount(children);

    if (slideCount > 1) {
      let slideIndexArray = Object.keys(children)
      if(isLoop) {
        slideIndexArray.unshift(slideCount - 1)
        slideIndexArray.push(0)
      }

      return slideIndexArray.map((slideIndex, i) =>
        <View style={slideStyle} key={i}>{children[slideIndex]}</View>
      );
    } else {
      return (<View style={slideStyle}>{children}</View>);
    }
  },

  generateViewIndex(realIndex, isLoop) {
    if (isLoop) {
      return realIndex + 1;
    } else {
      return realIndex;
    }
  },

  initState(props) {
    // set the current state
    const state = this.state || {}

    let initState = {
      isScrolling: false,
      autoplayEnd: false,
      index: 0,
      offset: {},
    };

    let oldSlideCount = this.slideCount;
    this.slideCount = this.getSlideCount(props.children);
    this.direction = props.horizontal ? DIRECTION.x : DIRECTION.y;
    this.width = props.width || width;
    this.height = props.height || height;

    let slideStyle = this.generateSlideStyle(this.width, this.height);
    this.slides = this.generateSlide(props.children, props.loop, slideStyle);

    initState.index = this.updateSlideIndex(props.index, oldSlideCount, this.slideCount);
    if (this.slideCount > 1) {
      let viewIndex = this.generateViewIndex(initState.index, props.loop);
      initState.offset[this.direction] = this.direction === DIRECTION.y ? this.height * viewIndex : this.width * viewIndex;
    }

    return initState
  },

    updateIndex(offset, dir) {

      let state = this.state
      let index = state.index
      let diff = offset[dir] - state.offset[dir]
      let step = dir === 'x' ? this.width : this.height


      // Do nothing if offset no change.
      if(!diff) return

      // Note: if touch very very quickly and continuous,
      // the variation of `index` more than 1.
      // parseInt() ensures it's always an integer
      index = parseInt(index + diff / step)

      if(this.props.loop) {
          if(index <= -1) {
            index = this.slideCount - 1
            offset[dir] = step * this.slideCount
          } else if (index >= this.slideCount) {
            index = 0
            offset[dir] = step
          }
      }

      this.setState({
          index,
          offset,
      })
    },

    autoplay() {
      if (!Array.isArray(this.props.children) || !this.props.autoplay || this.state.autoplayEnd) {
          return
      }

      clearTimeout(this.autoplayTimer)

      this.autoplayTimer = this.setTimeout(() => {
          let loop = this.props.loop;
          let reachEnd = (() => {
            if (this.props.autoplayDirection) {
                return this.state.index === this.slideCount - 1;
            } else {
                return this.state.index === 0;
            }
          }) (); 

          if (loop === false && reachEnd === true) {
            return this.setState({ autoplayEnd: true })
          }

          this.scrollBy(this.props.autoplayDirection ? 1 : -1)

      }, this.props.autoplayTimeout * 1000)
    },

    scrollBy(index) {
      let diff = (this.props.loop ? 1 : 0) + index + this.state.index;
      this.refs.carousel.scrollBy(diff);
    },

  onScrollEnd (contentOffset) {
    this.updateIndex(contentOffset, this.direction)
    this.autoplay()
  },

  renderPagination() {
    return (
      <Pagination
        dot = {this.props.dot}
        activeDot = {this.props.activeDot}
        total = {this.slideCount}
        index = {this.state.index}
        direction = {this.direction}
      />
    );
  },

  renderTitle() {
    let child = this.props.children[this.state.index];
    let title = child && child.props.title;

    return (
      <Title title = {title}/>
    );
  },

  renderNextButton() {
    if (this.props.loop || this.state.index != this.slideCount - 1) {
      return (
        <NextButton
          button = {this.props.nextButton}
          press = {() => this.scrollBy.call(this, 1)}
        />
      );
    }
  },

  renderPrevButton() {
    if (this.props.loop || this.state.index != 0) {
      return (
        <PrevButton
          button = {this.props.prevButton}
          press = {() => this.scrollBy.call(this, -1)}
        />
      )
    }
  },

  renderButtons() {
    let {width, height} = this;

    return (
      <View pointerEvents='box-none' style={[styles.buttonWrapper, {width, height}, this.props.buttonWrapperStyle]}>
        {this.renderPrevButton()}
        {this.renderNextButton()}
      </View>
    )
  },

  renderCarousel(pages) {
    let props = {
        offset: this.state.offset,
        index: this.state.index,
        loop: this.props.loop,
        width: this.width,
        height: this.height,
        direction: this.direction,
        ...this.props
    };

    var a =  (
      <Carousel
        ref = "carousel"
        {...props}
        onScrollEnd = {this.onScrollEnd}        
      >
        {this.slides}
      </Carousel>
    );

    return a;
  },

  render() {
    let state = this.state
    let props = this.props
    let children = props.children
    let index = state.index
    let total = this.slideCount
    let loop = props.loop
    let dir = this.direction

    return (
      <View style={[styles.container, {
        width: this.width,
        height: this.height
      }]}>
        {this.renderCarousel(this.slides)}
        {props.showPagination && (props.renderPagination
          ? this.props.renderPagination(state.index, this.slideCount, this)
          : this.renderPagination())}
        {this.renderTitle()}
        {this.props.showButton && this.renderButtons()}
      </View>
    )
  }
})
