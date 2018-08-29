/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import styles from './SummaryVariants.scss';

class SummaryVariants extends React.Component<*> {
  render() {
    const { experimentTransformed } = this.props;
    return (
      <div className={styles.container}>
        {Object.keys(experimentTransformed.evidence).map(drug => {
          const evidence = experimentTransformed.evidence[drug][0];
          return (
            <div key={drug} className={styles.group}>
              <div className={styles.title}>{drug}</div>
              {evidence.map((entry, index) => (
                <div key={`${index}`}>{entry}</div>
              ))}
            </div>
          );
        })}
        <div className={styles.group}>
          <div className={styles.title}>Whole genome analysis</div>
          <div>[Placeholder] Depth of coverage 80&times;</div>
          <div>No evidence of multiple strains (only 2 heterozygous sites)</div>
          <div>
            <a href="#">
              <i className="fa fa-plus-circle" /> more
            </a>
          </div>
        </div>
        <div className={styles.group}>
          <div className={styles.title}>Contamination check</div>
          <div>[Placeholder] Minor contamination (3%) from M. abscessus</div>
        </div>
      </div>
    );
  }
}

SummaryVariants.propTypes = {
  experiment: PropTypes.object.isRequired,
  experimentTransformed: PropTypes.object.isRequired,
  isBusyWithCurrentRoute: PropTypes.bool,
};

export default SummaryVariants;
