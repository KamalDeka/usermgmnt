import React from "react";
import { useTable, useSortBy } from "react-table";
import { useHistory } from "react-router-dom";
import { Icon } from "semantic-ui-react";

const DataTable = React.memo(({ columns, data }: { columns: any, data: any }) =>{
    const {
        getTableProps,
        getTableBodyProps,
        headers,
        rows,
        prepareRow,
    } = useTable(
        {
            columns,
            data,
        },
        useSortBy
    );
    
    const history = useHistory();

    return (
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
                {rows.map(
                    (row: any, i: number) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()} onDoubleClick={(e) => {
                                if (row?.original?.isActive) {
                                    let redirectUrl = `/customer?id=${row.original._id}`;
                                    history.push(redirectUrl);
                                }
                            }}>
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
    );
});

export default DataTable;