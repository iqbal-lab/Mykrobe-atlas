/* @flow */

import * as React from 'react';

import Loading from 'makeandship-js-common/src/components/ui/loading';

import Phylogeny from '../../phylogeny/Phylogeny';
import Uploading from '../../ui/Uploading';

import ExperimentGeographicMap from './ExperimentGeographicMap';
import AppDocumentTitle from '../../ui/AppDocumentTitle';

import { withExperimentPropTypes } from '../../../hoc/withExperiment';
import { withFileUploadPropTypes } from '../../../hoc/withFileUpload';
import { withExperimentsHighlightedPropTypes } from '../../../hoc/withExperimentsHighlighted';

import styles from './Analysis.scss';

const EXPERIMENTAL_RENDER_TREE_NEIGHBOURS = false;

class Analysis extends React.Component<*> {
  render() {
    const {
      isFetchingExperiment,
      isBusyWithCurrentRoute,
      experimentsTreeNewick,
      experimentAndNearestNeigbours,
      experimentAndNearestNeigboursInTree,
      experimentAndNearestNeigboursNotInTree,
      experimentAndNearestNeigboursWithGeolocation,
      experimentAndNearestNeigboursWithoutGeolocation,
      experimentIsolateId,
      experimentsHighlighted,
      setExperimentsHighlighted,
      resetExperimentsHighlighted,
      experimentsHighlightedInTree,
      experimentsHighlightedNotInTree,
      experimentsHighlightedWithGeolocation,
      experimentsHighlightedWithoutGeolocation,
      experimentTreeNearestNeigbours,
    } = this.props;
    let content;
    if (isBusyWithCurrentRoute) {
      content = <Uploading sectionName="Analysis" />;
    } else if (isFetchingExperiment) {
      content = <Loading />;
    } else {
      content = (
        <div className={styles.content}>
          <div className={styles.mapAndPhylogenyContainer}>
            <ExperimentGeographicMap
              experiments={experimentAndNearestNeigbours}
              experimentsWithGeolocation={
                experimentAndNearestNeigboursWithGeolocation
              }
              experimentsWithoutGeolocation={
                experimentAndNearestNeigboursWithoutGeolocation
              }
              experimentsHighlighted={experimentsHighlighted}
              experimentsHighlightedWithGeolocation={
                experimentsHighlightedWithGeolocation
              }
              experimentsHighlightedWithoutGeolocation={
                experimentsHighlightedWithoutGeolocation
              }
              setExperimentsHighlighted={setExperimentsHighlighted}
              resetExperimentsHighlighted={resetExperimentsHighlighted}
              experimentIsolateId={experimentIsolateId}
            />
            <div className={styles.phylogenyContainer}>
              {EXPERIMENTAL_RENDER_TREE_NEIGHBOURS ? (
                <Phylogeny
                  experimentsTreeNewick={experimentsTreeNewick}
                  experiments={experimentTreeNearestNeigbours}
                  experimentsHighlighted={experimentsHighlighted}
                  experimentsHighlightedInTree={experimentsHighlightedInTree}
                  experimentsHighlightedNotInTree={
                    experimentsHighlightedNotInTree
                  }
                  experimentsInTree={experimentTreeNearestNeigbours}
                  experimentsNotInTree={[]}
                  setExperimentsHighlighted={setExperimentsHighlighted}
                  resetExperimentsHighlighted={resetExperimentsHighlighted}
                  experimentIsolateId={experimentIsolateId}
                />
              ) : (
                <Phylogeny
                  experimentsTreeNewick={experimentsTreeNewick}
                  experiments={experimentAndNearestNeigbours}
                  experimentsHighlighted={experimentsHighlighted}
                  experimentsHighlightedInTree={experimentsHighlightedInTree}
                  experimentsHighlightedNotInTree={
                    experimentsHighlightedNotInTree
                  }
                  experimentsInTree={experimentAndNearestNeigboursInTree}
                  experimentsNotInTree={experimentAndNearestNeigboursNotInTree}
                  setExperimentsHighlighted={setExperimentsHighlighted}
                  resetExperimentsHighlighted={resetExperimentsHighlighted}
                  experimentIsolateId={experimentIsolateId}
                />
              )}
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className={styles.container}>
        <AppDocumentTitle title={[experimentIsolateId, 'Analysis']} />
        {content}
      </div>
    );
  }
}

Analysis.propTypes = {
  ...withExperimentPropTypes,
  ...withFileUploadPropTypes,
  ...withExperimentsHighlightedPropTypes,
};

export default Analysis;
