import React, { Component, PropTypes } from 'react';
import { Route, IndexRoute } from 'react-router';
import { connect } from 'react-redux';
import styles from './ResistanceEvidence.css';
import Panel from  'components/ui/Panel';

import * as AnalyserActions from 'actions/AnalyserActions';

// TODO: push route on state change

class ResistanceEvidence extends Component {
  render() {
    const {analyser} = this.props;
    const {evidence} = analyser.transformed;
    let panels = [];
    for ( let title in evidence ) {
      const values = evidence[title][0];
      panels.push(
        <Panel title={title} columns={4}>
          <div className={styles.evidence}>
            {values.map((value, index) =>
              <div key={`ELEMENT_${index}`}>{value}</div>
            )}
          </div>
        </Panel>
      )
    }
    return (
      <div className={styles.container}>
        {panels}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    analyser: state.analyser
  };
}

ResistanceEvidence.propTypes = {
  dispatch: PropTypes.func.isRequired,
  analyser: PropTypes.object.isRequired,
  children: PropTypes.object
};

export default connect(mapStateToProps)(ResistanceEvidence);
