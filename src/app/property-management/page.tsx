import React from 'react';
import PropertyManagementForm from '@/components/forms/PropertyManagementForm';
import BackButton from '@/components/shared/BackButton';

export default function PropertyManagement() {
  return (
    <div>
      <BackButton />
      <PropertyManagementForm />
    </div>
  );
}
