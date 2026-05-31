import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../components/ui/pagination";

type PaginationComponentProps = {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
};

export function PaginationComponent({
  totalItems,
  itemsPerPage,
  currentPage,
  setCurrentPage,
}: PaginationComponentProps) {
  const pages: number[] = [];
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
        <PaginationItem className="rounded-md border border-border">
          <PaginationPrevious
            href="#"
            onClick={(event) => {
              event.preventDefault();
              handlePreviousPage();
            }}
          />
        </PaginationItem>
        <div className="flex flex-row gap-1">
          {pages.map((page) => (
            <PaginationItem
              key={page}
              className={
                currentPage === page ? "rounded-md bg-muted" : ""
              }
            >
              <PaginationLink
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  setCurrentPage(page);
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
        </div>
        <PaginationItem className="rounded-md border border-border">
          <PaginationNext
            href="#"
            onClick={(event) => {
              event.preventDefault();
              handleNextPage();
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
