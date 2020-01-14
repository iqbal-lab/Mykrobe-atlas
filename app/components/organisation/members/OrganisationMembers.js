/* @flow */

import * as React from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { Link } from 'react-router-dom';

import PageHeader, {
  styles as pageHeaderStyles,
} from 'makeandship-js-common/src/components/ui/PageHeader';
import { PrimaryButton } from 'makeandship-js-common/src/components/ui/Buttons';
import Table, { TdLink } from 'makeandship-js-common/src/components/ui/table';

import OrganisationHeader from '../ui/OrganisationHeader';
import OrganisationStatusIcon from '../../organisation/ui/OrganisationStatusIcon';
import HeaderContainer from '../../ui/header/HeaderContainer';
import Footer from '../../ui/footer/Footer';
import { withOrganisationPropTypes } from '../../../hoc/withOrganisation';
import { notImplemented } from '../../../util';

import styles from './OrganisationMembers.scss';

const headings = [
  {
    title: 'Email',
  },
  {
    title: 'Last name',
  },
  {
    title: 'First name',
  },
  {
    title: 'Status',
  },
  {
    title: '',
  },
];

const OrganisationMemberActions = ({
  organisationId,
  member,
  onApprove,
  onReject,
  onPromote,
  onDemote,
  onRemove,
}: React.ElementProps<*>): React.Element<*> => {
  const { id, organisationUserStatus: memberOrganisationUserStatus } = member;
  return (
    <UncontrolledDropdown>
      <DropdownToggle
        tag={'a'}
        href="#"
        className={styles.dropdownToggle}
        onClick={e => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <i className="fa fa-ellipsis-v" />
      </DropdownToggle>
      <DropdownMenu>
        {memberOrganisationUserStatus === 'unapproved' && (
          <React.Fragment>
            <DropdownItem
              onClick={e => {
                e.preventDefault();
                onApprove(id);
              }}
            >
              <i className="fa fa-check-circle" /> Approve
            </DropdownItem>
            <DropdownItem
              onClick={e => {
                e.preventDefault();
                onReject(id);
              }}
            >
              <i className="fa fa-times-circle" /> Reject
            </DropdownItem>
          </React.Fragment>
        )}
        {memberOrganisationUserStatus === 'owner' && (
          <DropdownItem
            onClick={e => {
              e.preventDefault();
              onDemote(id);
            }}
          >
            <i className="fa fa-chevron-circle-down" /> Demote to member
          </DropdownItem>
        )}
        {memberOrganisationUserStatus === 'member' && (
          <DropdownItem
            onClick={e => {
              e.preventDefault();
              onPromote(id);
            }}
          >
            <i className="fa fa-chevron-circle-up" /> Promote to owner
          </DropdownItem>
        )}
        {memberOrganisationUserStatus === 'member' && (
          <DropdownItem
            onClick={e => {
              e.preventDefault();
              onRemove(id);
            }}
          >
            <i className="fa fa-ban" /> Remove
          </DropdownItem>
        )}
        <DropdownItem
          tag={Link}
          to={`/organisations/${organisationId}/members/${id}`}
          onClick={notImplemented}
        >
          <i className="fa fa-chevron-circle-right" /> View
        </DropdownItem>
        <DropdownItem
          tag={Link}
          to={`/organisations/${organisationId}/members/${id}/edit`}
          onClick={notImplemented}
        >
          <i className="fa fa-pencil" /> Edit
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

class OrganisationMembers extends React.Component<*> {
  componentWillMount() {
    const { requestOrganisation, organisationId, isNew } = this.props;
    if (!isNew) {
      requestOrganisation(organisationId);
    }
  }

  onNewMember = (e: any) => {
    e && e.preventDefault();
    notImplemented();
  };

  onChangeListOrder = ({ sort, order }: any) => {
    notImplemented();
  };

  onApprove = (memberId: string) => {
    const { organisationId, approveJoinOrganisationRequest } = this.props;
    approveJoinOrganisationRequest({
      memberId,
      id: organisationId,
    });
  };

  onReject = (memberId: string) => {
    const { organisationId, rejectJoinOrganisationRequest } = this.props;
    rejectJoinOrganisationRequest({
      memberId,
      id: organisationId,
    });
  };

  onPromote = (memberId: string) => {
    const { organisationId, promoteOrganisationMember } = this.props;
    promoteOrganisationMember({
      memberId,
      id: organisationId,
    });
  };

  onDemote = (memberId: string) => {
    const { organisationId, demoteOrganisationOwner } = this.props;
    demoteOrganisationOwner({
      memberId,
      id: organisationId,
    });
  };

  onRemove = (memberId: string) => {
    const { organisationId, removeOrganisationMember } = this.props;
    removeOrganisationMember({
      memberId,
      id: organisationId,
    });
  };

  renderRow = (member: any) => {
    const { organisationId } = this.props;
    const { id, firstname, lastname, email, organisationUserStatus } = member;
    return (
      <TdLink key={id} to={`/organisations/${organisationId}/members/${id}`}>
        <td>{email}</td>
        <td>{lastname}</td>
        <td>{firstname}</td>
        <td>
          <OrganisationStatusIcon status={organisationUserStatus} />{' '}
          {organisationUserStatus || '–'}
        </td>
        <td>
          <OrganisationMemberActions
            organisationId={organisationId}
            organisationUserStatus={organisationUserStatus}
            member={member}
            onApprove={this.onApprove}
            onReject={this.onReject}
            onPromote={this.onPromote}
            onDemote={this.onDemote}
            onRemove={this.onRemove}
          />
        </td>
      </TdLink>
    );
  };

  render() {
    const { organisationMembers } = this.props;
    return (
      <div className={styles.container}>
        <OrganisationHeader {...this.props} />
        <div className={styles.container}>
          <Container fluid>
            <PageHeader border={false}>
              <div className={pageHeaderStyles.title}>Members</div>
              <div>
                <PrimaryButton
                  onClick={this.onNewMember}
                  outline
                  size="sm"
                  icon="plus-circle"
                  marginLeft
                >
                  New Member
                </PrimaryButton>
              </div>
            </PageHeader>
            <Table
              headings={headings}
              data={organisationMembers}
              renderRow={this.renderRow}
              onChangeOrder={this.onChangeListOrder}
            />
          </Container>
        </div>
        <Footer />
      </div>
    );
  }
}

OrganisationMembers.propTypes = {
  ...withOrganisationPropTypes,
};

export default OrganisationMembers;
