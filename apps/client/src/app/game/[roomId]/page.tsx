'use client';

import { useParams, useSearchParams } from 'next/navigation';
import React from 'react';

import Game from '@/pages/game/page';

export default function LobbyPage(): React.JSX.Element {
  const searchParams = useSearchParams();
  const host = searchParams.get('host') || 'false';
  const { roomId } = useParams<{ roomId: string }>();

  return <Game host={host} roomId={roomId} />;
}
