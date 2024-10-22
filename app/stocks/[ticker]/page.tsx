import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";

interface StockData {
  ticker: string;
  name: string;
  description: string;
  industry?: string[];
  headquarters: string;
  founded: string;
  website: string;
  ceo: string;
  social_media?: {
    twitter?: string;
    linkedin?: string;
  };
  investor_relations: string;
  key_executives?: { name: string; position: string }[];
  product_categories?: { category: string; products?: string[] }[];
  seo: {
    meta_title: string;
    meta_description: string;
    keywords?: string[];
  };
  faq?: { question: string; answer: string }[];
  competitors?: string[];
  related_stocks?: string[];
}

// Helper to read JSON file from the content folder
const getStockData = (ticker: string): StockData | null => {
  try {
    const filePath = path.join(
      process.cwd(),
      "app",
      "stocks",
      "content",
      `${ticker.toLowerCase()}.json`
    );
    const fileContent = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    return null;
  }
};

export async function generateMetadata({ params }) {
  const { ticker } = await params;
  const stockData = getStockData(ticker);
  if (!stockData) return notFound();

  return {
    title: stockData.seo.meta_title,
    description: stockData.seo.meta_description,
  };
}

export async function generateStaticParams() {
  const contentDir = path.join(process.cwd(), "app", "stocks", "content");
  const files = fs.readdirSync(contentDir);
  const paths = files.map((file) => ({
    ticker: file.replace(".json", ""),
  }));

  return paths;
}

// Page component
export default async function StockPage({ params }) {
  const { ticker } = await params;
  const stockData = getStockData(ticker);

  if (!stockData) {
    return <div className="text-center mt-8 text-xl">Stock not found</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4">
        {stockData.name} ({stockData.ticker})
      </h1>
      <p className="text-gray-700 mb-8">{stockData.description}</p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Key Executives</h2>
        <ul className="space-y-2">
          {stockData.key_executives?.map((executive) => (
            <li
              key={executive.name}
              className="flex justify-between items-center border-b py-2"
            >
              <span>{executive.name}</span>
              <span className="text-gray-500">{executive.position}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Product Categories</h2>
        {stockData.product_categories?.map((category) => (
          <div key={category.category} className="mb-4">
            <h3 className="text-xl font-medium">{category.category}</h3>
            <ul className="list-disc pl-5 text-gray-600">
              {category.products?.map((product) => (
                <li key={product}>{product}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">FAQ</h2>
        {stockData.faq?.map((faqItem) => (
          <details key={faqItem.question} className="mb-2">
            <summary className="cursor-pointer font-semibold">
              {faqItem.question}
            </summary>
            <p className="mt-1 text-gray-600">{faqItem.answer}</p>
          </details>
        ))}
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Competitors</h2>
        <p>{stockData.competitors?.join(", ")}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Related Stocks</h2>
        <p>{stockData.related_stocks?.join(", ")}</p>
      </section>

      <footer className="mt-12">
        <p className="text-sm">
          CEO:{" "}
          <a href={stockData.social_media?.linkedin} className="text-blue-600">
            {stockData.ceo}
          </a>
        </p>
        <p className="text-sm">
          Website:{" "}
          <a href={stockData.website} className="text-blue-600">
            {stockData.website}
          </a>
        </p>
        <p className="text-sm">
          Investor Relations:{" "}
          <a href={stockData.investor_relations} className="text-blue-600">
            {stockData.investor_relations}
          </a>
        </p>
      </footer>
    </div>
  );
}
