/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Container } from 'reactstrap';

import {
  login,
  getIsFetching,
  getError,
} from 'makeandship-js-common/src/modules/auth';
import {
  DecoratedForm,
  FormFooter,
} from 'makeandship-js-common/src/components/ui/form';
import {
  SubmitButton,
  LinkButton,
} from 'makeandship-js-common/src/components/ui/Buttons';

import { loginSchema } from '../../schemas/auth';
import HeaderContainer from '../header/HeaderContainer';
import styles from './Common.scss';

const uiSchema = {
  username: {
    'ui:placeholder': 'sam.smith@example.com',
    'ui:autofocus': true,
  },
  password: {
    'ui:widget': 'password',
  },
};

class Login extends React.Component<*> {
  render() {
    const { isFetching, login, error } = this.props;
    return (
      <div className={styles.container}>
        <HeaderContainer title={'Account'} />
        <Container fluid>
          <DecoratedForm
            formKey="auth/login"
            promptUnsavedChanges={false}
            schema={loginSchema}
            uiSchema={uiSchema}
            onSubmit={login}
            isFetching={isFetching}
            error={error}
          >
            <FormFooter>
              <div>
                <SubmitButton data-tid="button-submit" marginRight>
                  Log in
                </SubmitButton>
                <LinkButton to="/auth/register" marginRight>
                  Sign up
                </LinkButton>
                <LinkButton to="/auth/forgot">Forgot password</LinkButton>
              </div>
            </FormFooter>
          </DecoratedForm>
        </Container>
      </div>
    );
  }
}

Login.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  login: PropTypes.func.isRequired,
  error: PropTypes.any,
};

const withRedux = connect(
  state => ({
    isFetching: getIsFetching(state),
    error: getError(state),
  }),
  { login }
);

export default withRedux(Login);
