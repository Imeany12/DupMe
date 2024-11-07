import React from 'react';

import Game from '@/pages/game/page';

export default async function LobbyPage({
  params,
  searchParams,
}: {
  params: { roomId: string };
  searchParams: {
    host: string;
  };
}): Promise<React.JSX.Element> {
  const host = searchParams.host;
  const roomId = params.roomId;

  return <Game host={host} roomId={roomId} />;
}
