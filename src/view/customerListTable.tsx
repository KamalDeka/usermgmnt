import React from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import { useHistory } from "react-router-dom";
import { Icon, Segment } from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";
import { ACTIONS } from "../viewHelper/contants";

const DataTable = React.memo(({ columns, data }: { columns: any, data: any }) =>{
    const dispatch = useDispatch();
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
        state: {pageIndex, pageSize}
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: index || 0 , pageSize: size || 15 },
        },
        useSortBy,
        usePagination,
    );
    
    const history = useHistory();

    return (
        <Segment>
            <table {...getTableProps()}>
                <thead>
                    <tr>{headers.map((column: any) => (
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
                    ))}
                    </tr>
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map(
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
                                    {row.cells.map((cell: any) => {
                                        return (
                                            <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                        )
                                    })}
                                </tr>
                            )
                        }
                    )}
                </tbody>
            </table>
            <div className="pages">
                <Icon className={"angle double left pageIcon " + (!canPreviousPage ? "disabled" : "pointer")} onClick={()=> {
                    gotoPage(0);
                    dispatch({type: ACTIONS.SET_PAGE_INDEX, pageIndex: 0 })
                }}/>
                <Icon className={"angle left pageIcon " +  (!canPreviousPage ? "disabled" : "pointer")} onClick={()=> {
                    previousPage();
                    dispatch({type: ACTIONS.SET_PAGE_INDEX, pageIndex: pageIndex - 1 })
                }}/>
                <span>{`Page ${pageIndex + 1} of ${pageOptions.length}`}</span>
                <Icon className={"angle right pageIcon " +  (!canNextPage ? "disabled" : "pointer")} onClick={()=>{
                    nextPage();
                    dispatch({type: ACTIONS.SET_PAGE_INDEX, pageIndex: pageIndex + 1})
                }} />
                <Icon className={"angle double right pageIcon " +  (!canNextPage ? "disabled" : "pointer")} onClick={()=>{
                    gotoPage(pageCount - 1);
                    dispatch({type: ACTIONS.SET_PAGE_INDEX, pageIndex: pageCount - 1})
                }}/>
                <select
                    value={pageSize}
                    onChange={e => {
                        setPageSize(Number(e.target.value));
                        dispatch({type: ACTIONS.SET_PAGE_SIZE, pageSize: pageSize});
                    }}
                    >
                    {[10, 15, 30, 50].map(pgSize => (
                        <option key={pgSize} value={pgSize}>
                            Show {pgSize}
                        </option>
                    ))}
                    </select>
            </div>
        </Segment>
    );
});

export default DataTable;