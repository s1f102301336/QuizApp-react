import { Quiz } from "./Quiz";

interface QuizWithId extends Quiz {
  id: string;
}

export type { QuizWithId };
