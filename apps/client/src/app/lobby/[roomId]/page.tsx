import Lobby from '@/pages/lobby/page';

export default async function LobbyPage({
  params,
  searchParams,
}: {
  params: { roomId: string };
  searchParams: {
    host: boolean;
  };
}): Promise<React.JSX.Element> {
  const host = searchParams.host;
  const roomId = params.roomId;

  return <Lobby host={host} roomId={roomId} />;
}
