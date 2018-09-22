import React from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';

class SwipeToDelete extends React.Component {
  node = null;

  state = {
    positionLeft: 0,
    pressedPosition: false,
    animate: false,
    opacity: 1,
    removing: false,
  };

  componentDidMount() {
    this.node = findDOMNode(this);

    document.body.addEventListener('mouseup', this.onMouseUp);
  }

  componentWillUnmount() {
    document.body.removeEventListener('mouseup', this.onMouseUp);
  }

  onMouseMove = event => {
    const {
      pressedPosition,
    } = this.state;

    if (pressedPosition) {
      let newPositionLeft = event.screenX - pressedPosition;

      const newState = {...this.state};
      if (newPositionLeft >= this.node.offsetWidth) {
        newPositionLeft = newPositionLeft + this.node.offsetWidth;
        newState.animate = true;
        newState.removing = true;

        this.remove();
      }
      else {
        newPositionLeft = newPositionLeft < 0 ? 0 : newPositionLeft;
      }

      newState.positionLeft = newPositionLeft;
      newState.opacity = (100 - (newPositionLeft * 100 / (this.node.offsetWidth * 2))) / 100;

      this.setState(newState);
    }
  };

  onMouseDown = event => {
    this.setState({
      pressedPosition: event.screenX,
      animate: false,
    });
  };

  onMouseUp = () => {
    const {
      removing,
    } = this.state;

    if (!removing) {
      this.setState({
        pressedPosition: false,
        positionLeft: 0,
        animate: true,
        opacity: 1,
      });
    }
  };

  remove = () => {
    const {
      onDelete,
    } = this.props;

    setTimeout(() => onDelete(), 300);
  };

  render() {
    const {
      children,
      className,
    } = this.props;

    const {
      positionLeft,
      animate,
      opacity,
    } = this.state;

    const style = {
      transform: `translateX(${positionLeft}px)`,
      opacity,
    };

    if (animate) {
      style.transition = 'transform 0.3s ease, opacity 0.5s ease';
    }

    const child = React.Children.only(children);

    const newChildProps = {
      style,
      className,
      onMouseMove: this.onMouseMove,
      onMouseDown: this.onMouseDown,
    };

    return React.cloneElement(child, newChildProps);
  }
}

SwipeToDelete.propTypes = {
  onDelete: PropTypes.func.isRequired,
};

export default SwipeToDelete;
