import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useInfiniteQuery} from "@tanstack/react-query";
import MaterialReactTable from "material-react-table";
import Modal from '@mui/material/Modal';
import {
    Box,
    IconButton,
    Typography,
    Tooltip,
} from '@mui/material';
import {Delete, Edit} from '@mui/icons-material';
import EditFoodForm from "./EditFoodForm";
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
const columns = [
    {
        accessorKey: 'foodName',
        header: 'Food Name',
    },
    {
        accessorKey: 'foodPrice',
        header: 'Food Price',
    },
    {
        accessorKey: 'foodPicture',
        header: 'Food Picture',
        Cell : ({cell}) => <img style={{"height" : "100%", "width" : "50%"}} src={cell.getValue()} />
    }
];

const fetchSize = 25;

function FoodsDataTable({setFoods,foodsLink,bearerToken}) {
    const tableContainerRef = useRef(null); //we can get access to the underlying TableContainer element and react to its scroll events
    const [columnFilters, setColumnFilters] = useState([]);
    const [globalFilter, setGlobalFilter] = useState();
    const [sorting, setSorting] = useState([]);
    const [open, setOpen] = useState(false);
    const [food,setFood]=useState(null);
    const [isChanged,setIsChanged]=useState(false);

    const handleClose = () => setOpen(false);
    const headers = { 'Authorization': 'Bearer '+bearerToken };
    const {data, fetchNextPage, isError, isFetching, isLoading} =
        useInfiniteQuery({
            queryKey: ['table-data', columnFilters, globalFilter, sorting],
            queryFn: async ({pageParam = 1}) => {
                if(bearerToken!=="") {
                    const url = new URL(
                        "https://localhost:7143/Food/" + foodsLink
                    );
                    const response = await fetch("https://localhost:7143/Food/" + foodsLink + "?page=" + pageParam + "&size=" + fetchSize, {headers}).then((response) => response.json());
                    setFoods(current => [...current, ...response])
                    return response;
                }
                return [];
            },
            getNextPageParam: (_lastGroup, groups) => groups.length,
            keepPreviousData: true,
            refetchOnWindowFocus: false,
        });

    const flatData = useMemo(
        () => data?.pages.flatMap((page) => page) ?? [],
        [data],
    );
    const [tableData, setTableData] = useState([]);
    useEffect(() => {
       setTableData(flatData)
    },[flatData]);
    const [rowCount, setRowCount] = useState(0);
    const getRowsCount = async () => {
        if(bearerToken!=="") {
            const response = await fetch(
                "https://localhost:7143/Food/" + foodsLink + "Length", {headers}
            ).then((response) => response.json());

            // update the state
            setRowCount(response);
        }
        else {
            setRowCount(0)
        }
    };
    useEffect(() => {
        getRowsCount();
    }, [bearerToken]);
    const totalFetched = flatData.length;

    //called on scroll and possibly on mount to fetch more data as the user scrolls and reaches bottom of table
    const fetchMoreOnBottomReached = useCallback(
        (containerRefElement) => {
            if (containerRefElement) {
                const {scrollHeight, scrollTop, clientHeight} = containerRefElement;
                //once the user has scrolled within 400px of the bottom of the table, fetch more data if we can
                if (
                    scrollHeight - scrollTop - clientHeight < 100 &&
                    !isFetching &&
                    totalFetched < rowCount
                ) {
                    fetchNextPage();
                }
            }
        },
        [fetchNextPage, isFetching, totalFetched, rowCount],
    );

    //a check on mount to see if the table is already scrolled to the bottom and immediately needs to fetch more data
    useEffect(() => {
        fetchMoreOnBottomReached(tableContainerRef.current);
    }, [fetchMoreOnBottomReached]);

    function handleEditRow(row) {
        setFood(row);
        setOpen(true);
    }

    const handleDeleteRow = useCallback(
        (row) => {
            if (
                !window.confirm(`Are you sure you want to delete ${row.getValue('foodName')}`)
            ) {
                return;
            }
            fetch('https://localhost:7143/Food/DeleteFood?foodId='+row.original.foodId, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer '+bearerToken
                }
            }).then(async res => {
                res = await res.json();
                if(res){
                    tableData.splice(row.index, 1);
                    setTableData(tableData);
                }
            });
           
        },
        [tableData],
    );

    return (
        <>
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
            <EditFoodForm handleClose={handleClose} tableData={tableData} setTableData={setTableData} row={food}></EditFoodForm>
            </Box>
        </Modal>
        <MaterialReactTable
            columns={columns}
            data={tableData}
            enablePagination={false}
            manualFiltering
            enableRowActions
            renderRowActions={({row, table}) => (
                <Box sx={{display: 'flex', flexWrap: 'nowrap', gap: '8px'}}>
                    <Tooltip arrow placement="left" title="Edit">
                        <IconButton onClick={() => handleEditRow(row)}>
                            <Edit/>
                        </IconButton>
                    </Tooltip>
                    <Tooltip arrow placement="right" title="Delete">
                        <IconButton color="error" onClick={() => handleDeleteRow(row)}>
                            <Delete/>
                        </IconButton>
                    </Tooltip>
                </Box>
            )}
            manualSorting
            muiTableContainerProps={{
                ref: tableContainerRef, //get access to the table container element
                sx: {maxHeight: '600px'}, //give the table a max height
                onScroll: (
                    event, //add an event listener to the table container element
                ) => fetchMoreOnBottomReached(event.target),
            }}
            muiToolbarAlertBannerProps={
                isError
                    ? {
                        color: 'error',
                        children: 'Error loading data',
                    }
                    : undefined
            }
            onColumnFiltersChange={setColumnFilters}
            onGlobalFilterChange={setGlobalFilter}
            onSortingChange={setSorting}
            renderBottomToolbarCustomActions={() => (
                <Typography>
                    Fetched {totalFetched} of {rowCount} total rows.
                </Typography>
            )}
            state={{
                columnFilters,
                isLoading,
                showAlertBanner: isError,
                showProgressBars: isFetching,
                sorting,
            }}
        />
        </>
    );
}

export default FoodsDataTable;