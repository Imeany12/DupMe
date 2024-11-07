import React from 'react';

import Game from '@/pages/game/page';

export default function GamePage({
  params,
  searchParams,
}: {
  params: {
    roomId: string;
  };
  searchParams: {
    host: string;
  };
}): React.JSX.Element {
  const host = searchParams.host || 'false';
  const { roomId } = params;

  return <Game host={host} roomId={roomId} />;
}
