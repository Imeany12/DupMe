'use client';

import { useParams, useSearchParams } from 'next/navigation';

import Lobby from '@/pages/lobby/page';

export default function LobbyPage(): React.JSX.Element {
  const searchParams = useSearchParams();
  const host = searchParams.get('host') || 'false';
  const { roomId } = useParams<{ roomId: string }>();

  return <Lobby host={host} roomId={roomId} />;
}
