'use client';
import React from 'react';
import FestivalDetailSection from 'src/view/films/sections/FestivalDetailSection';

export default function Page({ params }: { params: { id: string } }) {
  return <FestivalDetailSection id={params.id} />;
}