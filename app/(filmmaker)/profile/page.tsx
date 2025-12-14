'use client';

import FilmmakerProfileView from '@/view/films/profile/FilmmakerProfileView';

export default function FilmmakerProfilePage() {
  // Example mock data, replace with real user data as needed
  const user = {
    name: 'John Doe',
    role: 'Filmmaker',
    gmail: 'Johndoe@gmail.com.kh',
    country: 'Viet nam',
    contact: '+855 464929',
    social: 'www.JohnPorfolio.com',
    bio: `I am an independent filmmaker specializing in short narrative films and creative storytelling. Her work focuses on youth, identity, and modern culture. She has submitted to festivals across Asia and continues to explore new cinematic styles.`,
    image: '/profile-default.png',
  };

  return <FilmmakerProfileView user={user} />;
}