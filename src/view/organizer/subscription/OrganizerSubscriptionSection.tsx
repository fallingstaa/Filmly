'use client';
import React, { useState } from 'react';
import SubscriptionHeroSection from '../../films/sections/SubscriptionHeroSection';
import SubscriptionPlansSection from '../../films/sections/SubscriptionPlansSection';
import SubscriptionComparisonSection from '../../films/sections/SubscriptionComparisonSection';

export default function OrganizerSubscriptionSection() {
    const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');

    return (
        <div className="w-full p-6 space-y-6">
            <SubscriptionHeroSection billing={billing} setBilling={setBilling} />
            <SubscriptionPlansSection billing={billing} />
            <SubscriptionComparisonSection />
        </div>
    );
}
