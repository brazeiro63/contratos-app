import React from 'react';
import RentalForm from '../../components/forms/RentalForm';
import BackButton from '../../components/shared/BackButton';

const RentalContract: React.FC = () => {
  return (
    <div>
      <BackButton />
      <RentalForm />
    </div>
  );
};

export default RentalContract;
