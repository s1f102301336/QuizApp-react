import { Quiz } from "./Quiz";

interface RoomData {
  roomId: string;
  user1?: { id: number; name: string };
  user2?: { id: number; name: string };
  quizzesData?: Quiz[];
  ans_user1?: object;
  ans_user2?: object;
  [key: `ans_user${number}`]: object | undefined; //動的キーの型も明示的に記載
  [key: `user${number}`]: { id: number; name: string } | undefined;
}

export type { RoomData };
