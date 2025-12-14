import React from 'react';
import SubscriptionCheckoutScreen from '../../../../../src/view/films/sections/SubscriptionCheckoutScreen';

export default function BillingCheckoutPage() {
  // page lives inside (filmmaker) so left navigation remains
  return (
    <div className="p-6 w-full">
      <SubscriptionCheckoutScreen billing="monthly" />
    </div>
  );
}