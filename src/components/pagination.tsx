import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination";

export function PaginationComponent({
  totalItems,
  itemsPerPage,
  currentPage,
  setCurrentPage,
}: {
  totalItems: any;
  itemsPerPage: any;
  currentPage: any;
  setCurrentPage: any;
}) {
  const pages = [];
  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pages.push(i);
  }

  const handleNextPage = () => {
    if (currentPage < pages.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem className="border border-grey-500 rounded-md">
          <PaginationPrevious href="#" onClick={() => handlePreviousPage()} />
        </PaginationItem>
        <div className="flex flex-row gap-1">
          {pages.map((page, index) => (
            <PaginationItem
              key={index}
              className={
                currentPage === page ? "bg-neutral-100 rounded-md" : ""
              }
            >
              <PaginationLink href="#" onClick={() => setCurrentPage(page)}>
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
        </div>
        <PaginationItem className="border border-grey-500 rounded-md">
          <PaginationNext href="#" onClick={() => handleNextPage()} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
