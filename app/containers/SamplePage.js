/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Sample from '../components/sample/Sample';
import withAnalyser from '../hoc/withAnalyser';

import { fetchCurrentUser } from '../modules/auth';
import { fetchExperiment } from '../modules/analyser';
import { fetchTemplate } from '../modules/metadata';

class SamplePage extends React.Component {
  componentDidMount() {
    const {
      analyser,
      fetchExperiment,
      fetchTemplate,
      fetchCurrentUser,
    } = this.props;
    const { id } = this.props.match.params;
    if (!analyser.analysing && !analyser.json) {
      fetchExperiment(id);
    }

    // re-fetch user details before requesting template
    // this ensures the correct organisation/template is used,
    // as it may have changed since the user logged in
    fetchCurrentUser().then(user => {
      fetchTemplate(user);
    });
  }

  render() {
    const { match } = this.props;
    return <Sample match={match} />;
  }
}

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchExperiment,
      fetchTemplate,
      fetchCurrentUser,
    },
    dispatch
  );
}

SamplePage.propTypes = {
  match: PropTypes.object.isRequired,
  analyser: PropTypes.object.isRequired,
  fetchExperiment: PropTypes.func.isRequired,
  fetchTemplate: PropTypes.func.isRequired,
  fetchCurrentUser: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(
  withAnalyser(SamplePage)
);
