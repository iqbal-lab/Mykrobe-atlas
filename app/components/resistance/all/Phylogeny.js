import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import styles from './Phylogeny.css';

import PhyloCanvasComponent from 'components/ui/PhyloCanvasComponent';

const TREE_DATA = require('static/api/tree.json');
const SAMPLE_DATA = require('static/api/sample1.json');

class Phylogeny extends Component {
  render() {
    // const {analyser} = this.props;
    // const everything = JSON.stringify(analyser.transformed, null, 2);
    const {newick} = TREE_DATA;
    return (
      <div className={styles.container}>
        <PhyloCanvasComponent ref={(ref) => { this._phyloCanvas = ref; }} treeType="circular" data={newick} />
      </div>
    );
  }

  componentDidMount() {
    console.log('this._phyloCanvas', this._phyloCanvas);
    console.log('this._phyloCanvas._tree', this._phyloCanvas._tree);
    for (let sampleKey in SAMPLE_DATA) {
      const sample = SAMPLE_DATA[sampleKey];
      const neighbours = sample.neighbours;
      for (let neighbourKey in neighbours) {
        const neighbour = neighbours[neighbourKey];
        const samples = neighbour.samples;
        this._phyloCanvas.highlightNodesWithIds(samples);
      }
    }
  }
}

function mapStateToProps(state) {
  return {
    analyser: state.analyser
  };
}

Phylogeny.propTypes = {
  dispatch: PropTypes.func.isRequired,
  analyser: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(Phylogeny);
