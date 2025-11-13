import React from 'react';
import PropertyManagementForm from '../../components/forms/PropertyManagementForm';
import BackButton from '../../components/shared/BackButton';

const PropertyManagement: React.FC = () => {
  return (
    <div>
      <BackButton />
      <PropertyManagementForm />
    </div>
  );
};

export default PropertyManagement;
