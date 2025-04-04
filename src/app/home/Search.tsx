import styles from "./Search.module.css";

export const Search = ({
  category,
  setCategory,
}: {
  category: string;
  setCategory: (val: string) => void;
}) => {
  const categories = {
    ALL: "ALL",
    Anime_Manga: "アニメ/漫画",
    Games: "ゲーム",
    Music: "音楽",
    History: "歴史",
    Math: "数学",
    Science: "理科",
    Literature: "文学",
    Other: "その他",
  };

  return (
    <div className={styles.container}>
      {/* <div>
        <select
          name="category"
          id="category"
          value={category}
          onChange={(e) => setCategory(String(e.currentTarget.value))}
        >
          <option value="ALL">ALL</option>
          <option value="Anime_Manga">アニメ/漫画</option>
          <option value="Games">ゲーム</option>
          <option value="Music">音楽</option>
          <option value="History">歴史</option>
          <option value="Math">数学</option>
          <option value="Science">理科</option>
          <option value="Literature">文学</option>
          <option value="Other">その他</option>
        </select>
      </div> */}

      <div className={styles.tab1}>
        {Object.entries(categories).map(([key, value]) => {
          return (
            <label key={key}>
              <input
                type="radio"
                name={key}
                value={key}
                checked={key === category}
                onChange={() => setCategory(key)}
              />
              {value}
            </label>
          );
        })}
      </div>
    </div>
  );
};
