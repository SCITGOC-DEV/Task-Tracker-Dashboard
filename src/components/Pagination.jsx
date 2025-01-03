import React, {useEffect, useState} from "react";
import ReactPaginate from "react-paginate";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { useStateContext } from "../contexts/ContextProvider";

const Pagination = ({ totalPages, currentPage, handlePageClick }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Set visibility to true after a delay to allow for transition
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100); // Adjust the delay as necessary

        return () => clearTimeout(timer);
    }, [totalPages]); // Update visibility when totalPages change

    return (
        <div className={`transition-all ease-in-out duration-150 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <ReactPaginate
                onPageChange={handlePageClick}
                breakLabel={<span className="dark:text-white text-black">...</span>}
                nextLabel={
                    currentPage < totalPages - 1 ? (
                        <span className="w-10 h-10 dark:text-white text-gray-900 items-center flex justify-center dark:bg-secondary-dark-bg bg-light-gray rounded-md mr-4">
                            <BsChevronRight />
                        </span>
                    ) : null
                }
                pageRangeDisplayed={3}
                pageCount={totalPages}
                previousLabel={
                    currentPage > 0 ? (
                        <span className="w-10 h-10 dark:text-white text-gray-900 items-center flex justify-center dark:bg-secondary-dark-bg bg-light-gray rounded-md mr-4">
                            <BsChevronLeft />
                        </span>
                    ) : null
                }
                containerClassName="flex items-center justify-center mt-8 mb-4"
                pageClassName="block border border-solid border-gray-400 hover:bg-[#0C1FA2] flex items-center justify-center w-10 h-10 rounded-md hover:text-white mr-4 dark:text-white text-black"
                activeClassName={`bg-[#0C1FA2] text-white`}
            />
        </div>
    );
};

export default Pagination;
