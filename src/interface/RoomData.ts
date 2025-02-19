import { Quiz } from "./Quiz";

interface RoomData {
  roomId: string;
  user1?: { id: number; name: string };
  user2?: { id: number; name: string };
  quizzesData?: Quiz[];
  ans_user1?: object;
  ans_user2?: object;
  [key: `ans_user${number}`]: object | undefined;
}

export type { RoomData };
