/* @flow */

/* TODO Refactor to use redux-form */
/* eslint-disable react/no-string-refs */

import * as React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import type { AuthType } from '../../types/AuthTypes';
import type { UserType } from '../../types/UserTypes';

import styles from './Common.css';
import Loading from '../ui/Loading';

import {
  getAuth,
  getIsFetching as getAuthIsFetching,
  getError,
  signOut,
  requestCurrentUser,
  updateCurrentUser,
  deleteCurrentUser,
  deleteError,
} from '../../modules/auth';

import {
  getOrganisationsIsFetching,
  getOrganisations,
  requestOrganisations,
} from '../../modules/organisations';

class Profile extends React.Component {
  componentWillMount() {
    const { requestCurrentUser, requestOrganisations } = this.props;
    requestCurrentUser();
    requestOrganisations();
  }

  componentWillUnmount() {
    const { deleteError } = this.props;
    deleteError();
  }

  handleSubmit(e) {
    e.preventDefault();
    const { updateCurrentUser } = this.props;
    const userObject: UserType = {
      email: this.refs.email.value,
      firstname: this.refs.firstname.value,
      lastname: this.refs.lastname.value,
      phone: this.refs.phone.value,
      // organisation: this.refs.organisation.value,
    };
    updateCurrentUser(userObject);
  }

  deleteAccount = () => {
    const { deleteCurrentUser } = this.props;
    if (confirm('Delete account?')) {
      deleteCurrentUser();
    }
  };

  render() {
    const { error, isFetching } = this.props;
    const { signOut } = this.props;
    const auth: AuthType = this.props.auth;
    const user: ?UserType = auth.user;
    if (!user) {
      return null;
    }
    if (isFetching) {
      return (
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.title}>Profile</div>
          </div>
          <div className={styles.contentContainer}>
            <div className={styles.formContainer}>
              <Loading />
            </div>
          </div>
        </div>
      );
    }
    const { email, firstname, lastname, phone, organisation } = user;
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.title}>Profile</div>
        </div>
        <div className={styles.contentContainer}>
          <div className={styles.formContainer}>
            <div className={styles.contentTitle}>Profile</div>
            <form
              onSubmit={e => {
                this.handleSubmit(e);
              }}
            >
              {error && (
                <div className={styles.formErrors}>{error.message}</div>
              )}
              <div className={styles.formRow}>
                <label className={styles.label} htmlFor="email">
                  Email
                </label>
                <input
                  className={styles.input}
                  type="email"
                  id="email"
                  ref="email"
                  placeholder="sam.smith@example.com"
                  defaultValue={email}
                />
              </div>
              <div className={styles.formRow}>
                <label className={styles.label} htmlFor="firstname">
                  First name
                </label>
                <input
                  className={styles.input}
                  type="text"
                  id="firstname"
                  ref="firstname"
                  placeholder="Sam"
                  defaultValue={firstname}
                />
              </div>
              <div className={styles.formRow}>
                <label className={styles.label} htmlFor="lastname">
                  Last name
                </label>
                <input
                  className={styles.input}
                  type="text"
                  id="lastname"
                  ref="lastname"
                  placeholder="Smith"
                  defaultValue={lastname}
                />
              </div>
              <div className={styles.formRow}>
                <label className={styles.label} htmlFor="phone">
                  Phone number
                </label>
                <input
                  className={styles.input}
                  type="text"
                  id="phone"
                  ref="phone"
                  placeholder="1234567890"
                  defaultValue={phone}
                />
              </div>
              <div className={styles.formRow}>
                <label className={styles.label} htmlFor="organisation">
                  Organisation
                </label>
                {/*
                <div className={styles.selectWrap}>
                  <select disabled className={styles.select} ref="organisation" id="organisation" defaultValue={selectedOrganisation}>
                    <option />
                    {organisations.data.allOrganisations && organisations.data.allOrganisations.map((org) => {
                      return (
                        <option key={org.id} value={org.id}>
                          {org.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
                */}
                {organisation &&
                  organisation.id && (
                    <Link to={`/organisation/edit/${organisation.id}`}>
                      <i className="fa fa-chevron-circle-right" />{' '}
                      {organisation.name}
                    </Link>
                  )}
              </div>
              <div className={styles.formActions}>
                <button className={styles.button} type="submit">
                  <span>
                    <i className="fa fa-chevron-circle-right" /> Update profile
                  </span>
                </button>
                <div>
                  <a
                    className={styles.buttonBorderless}
                    onClick={() => {
                      signOut();
                    }}
                  >
                    Sign out
                  </a>
                </div>
                <div className={styles.destructiveAction}>
                  <a onClick={this.deleteAccount}>
                    <i className="fa fa-trash" /> Delete account
                  </a>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    auth: getAuth(state),
    organisations: getOrganisations(state),
    error: getError(state),
    isFetching: getAuthIsFetching(state) || getOrganisationsIsFetching(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      signOut,
      requestCurrentUser,
      updateCurrentUser,
      deleteError,
      deleteCurrentUser,
      requestOrganisations,
    },
    dispatch
  );
}

Profile.propTypes = {
  error: PropTypes.string,
  auth: PropTypes.object.isRequired,
  organisations: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired,
  signOut: PropTypes.func.isRequired,
  requestCurrentUser: PropTypes.func.isRequired,
  updateCurrentUser: PropTypes.func.isRequired,
  deleteError: PropTypes.func.isRequired,
  deleteCurrentUser: PropTypes.func.isRequired,
  requestOrganisations: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
