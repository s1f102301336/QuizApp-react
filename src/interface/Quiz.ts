interface Quiz {
  category:
    | "Anime_Manga"
    | "Games"
    | "Music"
    | "History"
    | "Math"
    | "Science"
    | "Literature"
    | "Other";
  //配列の中身が複数になる場合、Array<>で囲う
  choices: Array<{
    isCorrect: boolean;
    text: string;
  }>;
  description: string;
  explanation: string;
  date: number;
  question: string;
  title: string;
}

export type { Quiz };
