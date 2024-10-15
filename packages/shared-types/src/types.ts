interface KeyMapping {
  [key: string]: string;
}


export interface IUser {
  username?: string 
  email?: string 
  image?: string 
  password?: string 
  createdAt?: Date 
  games_won?: number 
  games_lost?: number
  keybindings?: KeyMapping
}
