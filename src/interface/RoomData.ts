import { Quiz } from "./Quiz";

interface RoomData {
  roomId: string;
  quizzesData?: Quiz[];
  points?: Point;
  [key: `ans_user${number}`]: object | undefined; //動的キーの型も明示的に記載
  [key: `user${number}`]: { id: number; name: string } | undefined;
}

interface Point {
  [key: `user${number}`]: number | undefined;
}

export type { RoomData };
