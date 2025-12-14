'use client';
import React, { useState } from 'react';
import SubscriptionHeroSection from './SubscriptionHeroSection';
import SubscriptionPlansSection from './SubscriptionPlansSection';
import SubscriptionComparisonSection from './SubscriptionComparisonSection';

export default function SubscriptionSection() {
    const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');

    return (
        <div className="w-full p-6 space-y-6">
            <SubscriptionHeroSection billing={billing} setBilling={setBilling} />
            <SubscriptionPlansSection billing={billing} />
            <SubscriptionComparisonSection />
        </div>
    );
}