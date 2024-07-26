import * as React from 'react';
import './Pagination.css';
import { useDispatch } from 'react-redux'; //eslint-disable-line
import { AppDispatch } from '../../store/store.ts';
import { setPageNumber } from '../../store/viewSlice.ts';

interface PaginationProps {
	totalItems: number;
	itemsPerPage: number;
	currentPage: number;
	onPageChange: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
	totalItems,
	itemsPerPage,
	currentPage,
	onPageChange,
}) => {
	const dispatch = useDispatch<AppDispatch>();
	const totalPages = Math.ceil(totalItems / itemsPerPage);

	const handlePrevious = () => {
		if (currentPage > 1) {
			onPageChange(currentPage - 1);
			dispatch(setPageNumber(currentPage - 1));
		}
	};

	const handleNext = () => {
		if (currentPage < totalPages) {
			onPageChange(currentPage + 1);
			dispatch(setPageNumber(currentPage + 1));
		}
	};

	// go to the previous page if the current page is empty
	React.useEffect(() => {
		if (totalItems === 0) return;

		const lastPageWithItems = Math.ceil(totalItems / itemsPerPage);
		if (currentPage > lastPageWithItems) {
			onPageChange(lastPageWithItems);
			dispatch(setPageNumber(lastPageWithItems));
		}
	}, [totalItems, itemsPerPage, currentPage, onPageChange, dispatch]);

	return (
		<div className='pagination-container'>
			<button
				type='button'
				onClick={handlePrevious}
				disabled={currentPage === 1}
				className='pagination-button'
			>
				&#10703;
			</button>
			<span className='pagination-info'>
				{currentPage} / {totalPages}
			</span>
			<button
				type='button'
				onClick={handleNext}
				disabled={currentPage === totalPages}
				className='pagination-button'
			>
				&#10704;
			</button>
		</div>
	);
};

export default Pagination;
