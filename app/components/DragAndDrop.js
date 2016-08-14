import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import styles from './DragAndDrop.css';
import fs from 'fs';

import Dropzone from 'react-dropzone';

import MykrobeConfig from '../api/MykrobeConfig';
import MykrobeService from '../api/MykrobeService';

class DragAndDrop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filePath: false,
      isAnalysing: false,
      isDone: false,
      progress: 0,
      isDragActive: false,
      json: false
    };
  }

  render() {
    const { isDragActive } = this.state;
    const disableClick = true;
    const multiple = false;

    const awaitingDragAndDrop = (
      <div>
        <div>
          Drag and drop {isDragActive ? 'dragging' : false}
        </div>
        <button type="button" onClick={this.onOpenClick.bind(this)}>
          Browse...
        </button>
      </div>
    );

    const analysing = (
      <div>
        Analysing... {this.state.progress}%
      </div>
    );

    const done = (
      <div>
        <button type="button" onClick={this.onSaveClick.bind(this)}>
          Save...
        </button>
        <pre>
          {this.state.json}
        </pre>
      </div>
    );

    const content = this.state.isDone ? done : this.state.isAnalysing ? analysing : awaitingDragAndDrop;

    return (
      <Dropzone
        className={styles.container}
        ref={(ref) => { this._dropzone = ref; }}
        onDropAccepted={this.onDropAccepted.bind(this)}
        onDropRejected={this.onDropRejected.bind(this)}
        onDragLeave={this.onDragLeave.bind(this)}
        onDragEnter={this.onDragEnter.bind(this)}
        disableClick={disableClick}
        multiple={multiple}
        accept=".json,.bam,.gz,.fastq"
        >
        { content }
      </Dropzone>
    );
  }

  onDragLeave(e) {
    this.setState({
      isDragActive: false
    });
  }

  onDragEnter(e) {
    // e.preventDefault();
    // e.dataTransfer.dropEffect = 'copy';

    this.setState({
      isDragActive: true
    });
  }

  onDropAccepted(files) {
    this.setState({
      isDragActive: false
    });
    console.log('onDropAccepted', files);

    const config = new MykrobeConfig();
    const service = new MykrobeService(config);
    if (this.analyser) {
      this.analyser.cancel();
    }
    this.setState({
      isAnalysing: true,
      progress: 0
    });
    this.analyser = service.analyseFileWithPath(files[0].path)
      .on('progress', (progress) => {
        console.log('progress', progress);
        this.setState({
          isAnalysing: true,
          progress: Math.round(100 * progress.progress / progress.total)
        });
      })
      .on('done', (json) => {
        this.setState({
          isAnalysing: false,
          isDone: true,
          json
        });
      });
    // console.log('service:', service.analyseFileWithPath().pathToBin());
  }

  onDropRejected(files) {
    this.setState({
      isDragActive: false
    });
    console.log('onDropRejected', files);
  }

  onOpenClick(e) {
    this._dropzone.open();
    console.log('onOpenClick');
  }

  onSaveClick(e) {
    const {dialog} = require('electron').remote;
    dialog.showSaveDialog(null, {
      title: 'Save',
      defaultPath: 'mykrobe.json'
    },
      (filePath) => {
        console.log('filePath', filePath);
        // JSON.stringify(that.state.json, null, 4);
        if (filePath) {
          fs.writeFile(filePath, this.state.json, (err) => {
            if (err) {
              console.log(err);
            }
            else {
              console.log('JSON saved to ', filePath);
            }
          });
        }
      }
    );
    console.log('onSaveClick');
  }
}

DragAndDrop.propTypes = {
};

export default DragAndDrop;
