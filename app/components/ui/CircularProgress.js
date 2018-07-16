import * as React from 'react';
import PropTypes from 'prop-types';

import styles from './CircularProgress.scss';

class CircularProgress extends React.Component<*> {
  render() {
    const percentage = parseInt(this.props.percentage);
    const radius = this.props.radius - this.props.strokeWidth / 2;
    const width = this.props.radius * 2;
    const height = this.props.radius * 2;
    const viewBox = `0 0 ${width} ${height}`;
    const dashArray = radius * Math.PI * 2;
    const dashOffset = dashArray - (dashArray * percentage) / 100;
    return (
      <svg
        className={styles.container}
        width={this.props.radius * 2}
        height={this.props.radius * 2}
        viewBox={viewBox}
      >
        <circle
          className={styles.background}
          cx={this.props.radius}
          cy={this.props.radius}
          r={radius}
          strokeWidth={`${this.props.strokeWidth}px`}
        />
        <circle
          className={styles.foreground}
          cx={this.props.radius}
          cy={this.props.radius}
          r={radius}
          strokeWidth={`${this.props.strokeWidth}px`}
          style={{
            strokeDasharray: dashArray,
            strokeDashoffset: dashOffset,
          }}
        />
      </svg>
    );
  }
}

CircularProgress.defaultProps = {
  radius: 240,
  percentage: 50,
  strokeWidth: 36,
};

CircularProgress.propTypes = {
  radius: PropTypes.number,
  percentage: PropTypes.number,
  strokeWidth: PropTypes.number,
};

export default CircularProgress;
