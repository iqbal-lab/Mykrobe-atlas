/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import styles from './Summary.css';
import Uploading from '../ui/Uploading';
import ResistanceProfile from '../resistance/profile/ResistanceProfile';
import Panel from '../ui/Panel';
import SummaryMetadata from './SummaryMetadata';
import SummaryVariants from './SummaryVariants';

class Summary extends React.Component<*> {
  render() {
    const { analyser } = this.props;
    let content;
    if (analyser.analysing) {
      content = <Uploading sectionName="Summary" />;
    } else {
      content = (
        <div className={styles.content}>
          <div className={styles.summaryContainer}>
            <Panel title="Metadata" columns={8}>
              <SummaryMetadata analyser={analyser} />
            </Panel>
            <Panel title="Resistance Profile" columns={4}>
              <ResistanceProfile analyser={analyser} />
            </Panel>
            <Panel title="Variants Inducing Resistance" columns={4}>
              <SummaryVariants analyser={analyser} />
            </Panel>
          </div>
        </div>
      );
    }
    return <div className={styles.container}>{content}</div>;
  }
}

Summary.propTypes = {
  analyser: PropTypes.object,
};

export default Summary;
