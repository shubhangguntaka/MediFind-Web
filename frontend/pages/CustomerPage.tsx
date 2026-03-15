
import React from 'react';
import UserView from '../components/UserView';

interface CustomerPageProps {
  onLoginClick: () => void;
}

const CustomerPage: React.FC<CustomerPageProps> = ({ onLoginClick }) => {
  return <UserView onLoginClick={onLoginClick} />;
};

export default CustomerPage;
