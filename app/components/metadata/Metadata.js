/* @flow */

import React, { Component } from 'react';
import Key from 'components/header/Key';
import styles from './Metadata.css';

import MetadataForm from './MetadataForm';

class Metadata extends Component {

  constructor(props: Object) {
    super(props);
  }

  render() {
    return (
      <div className={styles.container}>
        <Key single />
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <div className={styles.formHeaderTitle}>
              Metadata
            </div>
            <div className={styles.formHeaderActions}>
              <div className={styles.formHeaderAction}>
                Open template
              </div>
            </div>
          </div>
          <MetadataForm />
        </div>
      </div>
    );
  }
}

export default Metadata;
