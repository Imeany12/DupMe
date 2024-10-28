'use client';

import React from 'react';

import Game from '@/pages/game/page';

export default function GamePage({
  params,
  searchParams,
}: {
  params: { roomId: string };
  searchParams: {
    host: boolean;
  };
}) {
  return <Game roomId={params.roomId} host={searchParams.host} />;
}
