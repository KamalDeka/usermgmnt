import React, { useEffect } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import { useHistory } from "react-router-dom";
import { Icon, Segment } from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";
import { ACTIONS } from "../viewHelper/contants";

const TableHeaderRow = ({headers}: {headers: any}) => {
    let th = headers.map((column: any) => 
        <th {...column.getHeaderProps(column.getSortByToggleProps())}>
            {column.render('Header')}
            <span>
                {column.isSorted
                    ? column.isSortedDesc
                        ? <Icon className="caret down"/>
                        : <Icon className="caret up"/>
                    : ''}
            </span>
        </th>
    );
    
    return <thead><tr>{th}</tr></thead>;
};

const TableCells = ({cells}:{cells:any;}) => {
    let td = cells.map((cell: any) => <td {...cell.getCellProps()}>{cell.render("Cell")}</td>);

    return <React.Fragment>{td}</React.Fragment>
}

const TableRows = React.memo(({page, prepareRow}: {page: any, prepareRow: (x:any)=>void}) => {
    const history = useHistory();

    let rows = page.map(
        (row: any, i: number) => {
            prepareRow(row);
            let pointerClass = row?.original?.isActive ? "pointer": "disabled";
            return (
                <tr {...row.getRowProps()} key={i} onDoubleClick={(e) => {
                    if (row?.original?.isActive) {
                        let redirectUrl = `/customer?id=${row.original._id}`;
                        history.push(redirectUrl);
                    }
                }} className={pointerClass} >
                    <TableCells cells={row.cells}/>
                </tr>
            )
        }
    )
    
    return <React.Fragment>{rows}</React.Fragment>
});

const Pagination = React.memo((
    { 
        pageCount,
        pageOptions,
        canPreviousPage,
        canNextPage,
        pageIndex,
        pageSize,
        gotoPage, 
        previousPage, 
        nextPage, 
        setPageSize,
        pageSizes       
    }: {
        pageCount: number;
        pageOptions: number[];
        canPreviousPage: boolean;
        canNextPage: boolean;
        pageIndex: number;
        pageSize: number
        gotoPage: (updater: ((pageIndex: number) => number) | number) => void;
        previousPage: () => void;
        nextPage: () => void;
        setPageSize: (pageSize: number) => void;
        pageSizes: Array<number>;
    }) => {

    const dispatch = useDispatch();

    const onPageSizeChange = (e: any) => {
        setPageSize(Number(e.target.value));
        dispatch({type: ACTIONS.SET_PAGE_SIZE, pageSize: pageSize});
    }

    const pageSizeOptions = () => {
        let options = pageSizes.map((pgSize: number) => (
            <option key={pgSize} value={pgSize}>
                Show {pgSize}
            </option>
        ));

        return <React.Fragment>{options}</React.Fragment>;
    }

    const gotoFirstPage = () => {
        gotoPage(0);
        dispatch({type: ACTIONS.SET_PAGE_INDEX, pageIndex: 0 })
    }

    const gotoPreviousPage = () => {
        previousPage();
        dispatch({type: ACTIONS.SET_PAGE_INDEX, pageIndex: pageIndex - 1 })
    }

    const gotoNextPage = () => {
        nextPage();
        dispatch({type: ACTIONS.SET_PAGE_INDEX, pageIndex: pageIndex + 1})
    }

    const gotoLastPage = () => {
        gotoPage(pageCount - 1);
        dispatch({type: ACTIONS.SET_PAGE_INDEX, pageIndex: pageCount - 1})
    }
    return (<div className="pages">
        <Icon className={"angle double left pageIcon " + (!canPreviousPage ? "disabled" : "pointer")} onClick={canPreviousPage ? gotoFirstPage: undefined}/>
        <Icon className={"angle left pageIcon " +  (!canPreviousPage ? "disabled" : "pointer")} onClick={canPreviousPage ? gotoPreviousPage: undefined}/>
        <span>{`Page ${pageIndex + 1} of ${pageOptions.length}`}</span>
        <Icon className={"angle right pageIcon " +  (!canNextPage ? "disabled" : "pointer")} onClick={canNextPage ? gotoNextPage : undefined} />
        <Icon className={"angle double right pageIcon " +  (!canNextPage ? "disabled" : "pointer")} onClick={canNextPage ? gotoLastPage: undefined}/>
        <select
            value={pageSize}
            onChange={onPageSizeChange}>
            {pageSizeOptions()}
        </select>
    </div>);
})

const DataTable = React.memo((
    { 
        columns, 
        data, 
        pageSizes, 
        initialPageSize,
        handleSort
    }: { 
        columns: any; 
        data: any; 
        pageSizes: Array<number>; 
        initialPageSize: number;
        handleSort: (sortBy: any) => void;
    }) => {
    const size = useSelector((state: any) => state?.pageSize);
    const index = useSelector((state: any) => state?.pageIndex);
    
    const {
        getTableProps,
        getTableBodyProps,
        headers,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: {pageIndex, pageSize, sortBy}
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: index || 0 , pageSize: size || initialPageSize },
            manualSortBy: true
        },
        useSortBy,
        usePagination,
    );   

    useEffect(()=>{
        handleSort(sortBy);
    }, [handleSort, sortBy])

    return (
        <Segment>
            <table {...getTableProps()}>
                <TableHeaderRow headers={headers} />
                <tbody {...getTableBodyProps()}>
                    <TableRows page={page} prepareRow={prepareRow}/>
                </tbody>
            </table>
            <Pagination 
                pageCount={pageCount}
                pageIndex={pageIndex}
                pageOptions={pageOptions}
                pageSize={pageSize}
                canNextPage={canNextPage}
                canPreviousPage={canPreviousPage}
                gotoPage={gotoPage}
                nextPage={nextPage}
                previousPage={previousPage} 
                setPageSize={setPageSize}
                pageSizes={pageSizes}/>
            
        </Segment>
    );
});

export default DataTable;