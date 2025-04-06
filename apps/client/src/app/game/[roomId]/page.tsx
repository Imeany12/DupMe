import React from 'react';

import Game from '@/pages/game/page';

export default async function GamePage(props: {
  params: Promise<{
    roomId: string;
  }>;
  searchParams: Promise<{
    host: string;
  }>;
}): Promise<React.JSX.Element> {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const host =
    typeof searchParams.host === 'string' ? searchParams.host : 'false';
  const { roomId } = params;

  return <Game host={host} roomId={roomId} />;
}
