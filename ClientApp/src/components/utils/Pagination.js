import React from "react";
import {PageItem, Pagination} from "react-bootstrap";
import "./Pagination.css";

const PaginationBar = ({elements, elementsPerPage, currentPage, handlePageChange,numberOfPages}) => {
    return (
        <Pagination className="food-pagination">
            <Pagination.Prev
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
            />
            {[...Array(numberOfPages).keys()].map((pageNumber) => (
                <PageItem 
                    className="food-page-item"
                    key={pageNumber + 1}
                    active={pageNumber + 1 === currentPage}
                    onClick={() => handlePageChange(pageNumber + 1)}
                >
                    {pageNumber + 1}
                </PageItem>
            ))}
            <Pagination.Next
                disabled={currentPage === Math.ceil(elements.length / elementsPerPage)}
                onClick={() => handlePageChange(currentPage + 1)}
            />
        </Pagination>
    );
}

export default PaginationBar;