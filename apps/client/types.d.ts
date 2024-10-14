type User =
  | {
      name?: string | null | undefined;
      email?: string | null | undefined;
      image?: string | null | undefined;
    }
  | undefined;

type IUser =
  | {
      username?: string | null | undefined;
      email?: string;
      image?: string | null | undefined;
      password?: string | null | undefined;
      createdAt?: Date | null | undefined;
      games_won?: number | null | undefined;
      games_lost?: number | null | undefined;
    }
  | undefined;
