/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import _isEqual from 'lodash.isequal';
import _get from 'lodash.get';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

import styles from './Phylogeny.scss';

import * as Colors from '../../constants/Colors';

import PhyloCanvasComponent from '../ui/PhyloCanvasComponent';
import ExperimentsTooltip from '../ui/ExperimentsTooltip';
import ExperimentsList from '../ui/ExperimentsList';

import type { SampleType } from '../../types/SampleType';

import { withExperimentsHighlightedPropTypes } from '../../hoc/withExperimentsHighlighted';

const treeTypes = [
  'radial',
  'rectangular',
  'circular',
  'diagonal',
  'hierarchical',
];
const AUTO_ZOOM_SAMPLES = true;

type State = {
  treeType: string,
};

class Phylogeny extends React.Component<*, State> {
  _phyloCanvas: ?PhyloCanvasComponent;
  _container: ?Element;

  state = {
    treeType: 'circular',
  };

  nodeIsInSamplesToHighlight = node => {
    return this.getSampleIds().includes(node.id);
  };

  onNodeMouseOver = node => {
    const { setExperimentsHighlighted } = this.props;
    if (this.nodeIsInSamplesToHighlight(node)) {
      setExperimentsHighlighted([this.getSampleWithId(node.id)]);
    }
  };

  onLoad = () => {
    console.log('onLoad');
  };

  componentDidMount = () => {
    this.updateMarkers();
    this.updateHighlighted();
    if (AUTO_ZOOM_SAMPLES) {
      this.zoomSamples();
    }
  };

  componentDidUpdate = (prevProps: any) => {
    const {
      highlighted,
      experiments,
      experimentsTree,
      resetExperimentsHighlighted,
    } = this.props;
    const treeChanged = !_isEqual(experimentsTree, prevProps.experimentsTree);
    if (treeChanged || !_isEqual(experiments, prevProps.experiments)) {
      this.updateMarkers();
      resetExperimentsHighlighted();
      if (AUTO_ZOOM_SAMPLES) {
        this.zoomSamples();
      }
    }
    if (!_isEqual(highlighted, prevProps.highlighted)) {
      this.updateHighlighted();
    }
  };

  updateMarkers = () => {
    const { experimentsInTree } = this.props;
    if (!this._phyloCanvas) {
      return;
    }
    this._phyloCanvas.resetHighlightedNodes();
    experimentsInTree.forEach((experiment, index) => {
      const isolateId = _get(experiment, 'metadata.sample.isolateId') || '–';
      const color =
        index === 0
          ? Colors.COLOR_HIGHLIGHT_EXPERIMENT_FIRST
          : Colors.COLOR_HIGHLIGHT_EXPERIMENT;
      this._phyloCanvas.highlightNodeWithId(isolateId, color);
    });
  };

  updateHighlighted = () => {
    // const { highlighted } = this.props;
    // if (highlighted && highlighted.length) {
    //   const nodeId = highlighted[0];
    //   const screenPosition = this._phyloCanvas.getPositionOfNodeWithId(nodeId);
    //   if (screenPosition) {
    //     const boundingClientRect = this._container.getBoundingClientRect();
    //     const sample = this.getSampleWithId(nodeId);
    //     if (sample) {
    //       this._phyloCanvasTooltip.setNode(sample);
    //       this._phyloCanvasTooltip.setVisible(
    //         true,
    //         boundingClientRect.left + screenPosition.x,
    //         boundingClientRect.top + screenPosition.y
    //       );
    //     }
    //   }
    // } else {
    //   this._phyloCanvasTooltip && this._phyloCanvasTooltip.setVisible(false);
    // }
  };

  screenPositionForNodeId = nodeId => {
    if (!this._phyloCanvas || !this._container) {
      return { x: 0, y: 0 };
    }
    const divPosition = this._phyloCanvas.getPositionOfNodeWithId(nodeId);
    if (divPosition) {
      const boundingClientRect = this._container.getBoundingClientRect();
      const screenPosition = {
        x: boundingClientRect.left + divPosition.x,
        y: boundingClientRect.top + divPosition.y,
      };
      return screenPosition;
    }
    return { x: 0, y: 0 };
  };

  onContainerRef = (ref: any) => {
    this._container = ref;
  };

  onPhyloCanvasRef = (ref: any) => {
    this._phyloCanvas = ref;
    this.updateMarkers();
  };

  onPhyloCanvasTooltipRef = (ref: any) => {
    this._phyloCanvasTooltip = ref;
  };

  onZoomSamplesClick = e => {
    e.preventDefault();
    this.zoomSamples();
  };

  render() {
    const {
      controlsInset,
      experimentsTreeNewick,
      experimentsInTree,
      experimentsNotInTree,
      experimentsHighlightedInTree,
    } = this.props;
    const { treeType } = this.state;
    if (!experimentsTreeNewick) {
      return null;
    }
    console.log('experimentsInTree', experimentsInTree);
    console.log('experimentsNotInTree', experimentsNotInTree);
    const insetStyle = { margin: `${controlsInset}px` };
    return (
      <div className={styles.container}>
        <div className={styles.contentContainer} ref={this.onContainerRef}>
          <PhyloCanvasComponent
            ref={this.onPhyloCanvasRef}
            treeType={treeType}
            data={experimentsTreeNewick}
            onNodeMouseOver={this.onNodeMouseOver}
            onNodeMouseOut={this.onNodeMouseOut}
            onLoad={this.onLoad}
            controlsInset={controlsInset}
          />
          <div className={styles.controlsContainerTop} style={insetStyle}>
            {experimentsNotInTree &&
              experimentsNotInTree.length && (
                <UncontrolledDropdown>
                  <DropdownToggle color="mid" outline size={'sm'}>
                    {experimentsNotInTree.length} not shown{' '}
                    <i className="fa fa-caret-down" />
                  </DropdownToggle>
                  <DropdownMenu>
                    <div className={styles.dropdownContent}>
                      <ExperimentsList experiments={experimentsNotInTree} />
                    </div>
                  </DropdownMenu>
                </UncontrolledDropdown>
              )}
            <div className={'ml-auto'}>
              <UncontrolledDropdown>
                <DropdownToggle color="mid" outline size={'sm'}>
                  {treeType} <i className="fa fa-caret-down" />
                </DropdownToggle>
                <DropdownMenu right>
                  {treeTypes.map((thisTreeType, index) => (
                    <DropdownItem
                      className={
                        thisTreeType === treeType
                          ? styles.demoTreeTypeSelected
                          : styles.demoTreeType
                      }
                      key={index}
                      onClick={() => {
                        this.setState({ treeType: thisTreeType });
                        setTimeout(() => {
                          this.updateMarkers();
                          if (AUTO_ZOOM_SAMPLES) {
                            this.zoomSamples();
                          }
                        }, 0);
                      }}
                    >
                      {thisTreeType}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>
          </div>
          <div
            className={styles.controlsContainerBottomLeft}
            style={insetStyle}
          >
            <div
              className={styles.zoomControl}
              onClick={this.onZoomSamplesClick}
            >
              <i className="fa fa-search" />
              <div className={styles.zoomControlText}>Fit samples</div>
            </div>
          </div>

          {experimentsHighlightedInTree &&
            experimentsHighlightedInTree.map(experiment => {
              const isolateId = _get(experiment, 'metadata.sample.isolateId');
              const experimentsTooltipLocation = this.screenPositionForNodeId(
                isolateId
              );
              return (
                <ExperimentsTooltip
                  key={isolateId}
                  experiments={[experiment]}
                  x={experimentsTooltipLocation.x}
                  y={experimentsTooltipLocation.y}
                  onClickOutside={this.onExperimentsTooltipClickOutside}
                />
              );
            })}
        </div>
      </div>
    );
  }

  onExperimentsTooltipClickOutside = () => {
    const { resetExperimentsHighlighted } = this.props;
    resetExperimentsHighlighted();
  };

  getSampleWithId = (nodeId: string): ?SampleType => {
    const { experiments } = this.props;
    return experiments.find(experiment => {
      const isolateId = _get(experiment, 'metadata.sample.isolateId');
      return isolateId === nodeId;
    });
  };

  getSampleIds = (): Array<string> => {
    const { experiments } = this.props;
    const isolateIds = experiments
      .map(experiment => {
        const isolateId = _get(experiment, 'metadata.sample.isolateId');
        return isolateId;
      })
      .filter(isolateId => !!isolateId);
    return isolateIds;
  };

  zoomSamples = () => {
    if (!this._phyloCanvas) {
      return;
    }
    this._phyloCanvas.zoomToNodesWithIds(this.getSampleIds());
  };

  static defaultProps = {
    controlsInset: 30,
  };
}

Phylogeny.propTypes = {
  ...withExperimentsHighlightedPropTypes,
  experiments: PropTypes.array,
  experimentsInTree: PropTypes.array,
  experimentsNotInTree: PropTypes.array,
  controlsInset: PropTypes.number,
};

export default Phylogeny;
