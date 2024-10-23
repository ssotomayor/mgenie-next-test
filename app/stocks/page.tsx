// app/stocks/page.js
import fs from "fs";
import path from "path";
import StocksPageContent from "./components/stocks-page.content"; // Adjust the import path as needed

// Helper to read all stock JSON files from the content folder
const getAllStocks = () => {
  const contentDir = path.join(process.cwd(), "app", "stocks", "content");
  const files = fs.readdirSync(contentDir);

  const stocks = files.slice(0, 50).map((file) => {
    const filePath = path.join(contentDir, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(fileContent);
  });

  return stocks;
};

export default function Page() {
  const stocks = getAllStocks();
  return <StocksPageContent stocks={stocks} />;
}
