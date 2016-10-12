import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './ResistanceAll.css';
import ResistanceProfile from 'components/resistance/ResistanceProfile';
import Panel from 'components/ui/Panel';
import Phylogeny from 'components/phylogeny/Phylogeny';

class ResistanceAll extends Component {
  render() {
    return (
      <div className={styles.container}>
        <Panel title="Resistance Profile" columns={3}>
          <ResistanceProfile />
        </Panel>
        <Panel title="Phylogeny" columns={5}>
          <Phylogeny controlsInset={0} />
        </Panel>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    analyser: state.analyser
  };
}

ResistanceAll.propTypes = {
  dispatch: PropTypes.func.isRequired,
  analyser: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(ResistanceAll);
