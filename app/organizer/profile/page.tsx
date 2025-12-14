import React from 'react';
import OrganizerProfileView from '../../../src/view/organizer/profile/OrganizerProfileView';

// Mock user data for organizer
const mockUser = {
  name: 'Jane Doe',
  role: 'organizer',
  bio: 'We are a leading film festival organization, supporting filmmakers worldwide.',
  email: 'organizer@email.com',
  country: 'Cambodia',
  contact: '+855 12 345 678',
  organization: 'Cambodia Film Fest',
  social: '@cambodiafilmfest',
};

export default function OrganizerProfilePage() {
  return <OrganizerProfileView user={mockUser} />;
}
