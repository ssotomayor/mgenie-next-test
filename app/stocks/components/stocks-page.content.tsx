"use client";

import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/app/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import Link from "next/link";

const ITEMS_PER_PAGE = 10;

const StocksPage = ({ stocks }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(stocks.length / ITEMS_PER_PAGE);

  // Calculate the stocks to show on the current page
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentStocks = stocks.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Function to generate page numbers to display
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show before and after current page
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];

    range.push(1);
    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      if (i > 1 && i < totalPages) {
        range.push(i);
      }
    }
    if (totalPages > 1) {
      range.push(totalPages);
    }

    let prev = 0;
    for (const i of range) {
      if (prev) {
        if (i - prev === 2) {
          rangeWithDots.push(prev + 1);
        } else if (i - prev !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      prev = i;
    }

    return rangeWithDots;
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">All Stocks</h1>

      <div className="text-sm text-gray-500 mb-4">
        Showing {startIndex + 1}-
        {Math.min(startIndex + ITEMS_PER_PAGE, stocks.length)} of{" "}
        {stocks.length} stocks
      </div>

      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Ticker</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>CEO</TableHead>
            <TableHead>Website</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentStocks.map((stock) => (
            <TableRow key={stock.ticker}>
              <TableCell>
                <Link
                  href={`/stocks/${stock.ticker}`}
                  className="text-blue-600 hover:underline"
                >
                  {stock.ticker}
                </Link>
              </TableCell>
              <TableCell>{stock.name}</TableCell>
              <TableCell>{stock.industry.join(", ")}</TableCell>
              <TableCell>{stock.ceo}</TableCell>
              <TableCell>
                <a
                  href={stock.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {stock.website}
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-6">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {getPageNumbers().map((pageNum, index) =>
              pageNum === "..." ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={`page-${pageNum}`}>
                  <PaginationLink
                    className="cursor-pointer"
                    onClick={() => setCurrentPage(Number(pageNum))}
                    isActive={currentPage === pageNum}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default StocksPage;
