// src/DataList.tsx
import React, { lazy, useEffect, useState } from "react";
import { DataTable } from 'primereact/datatable';
import { Paginator } from "primereact/paginator";
import { Column } from 'primereact/column';

interface Item {
  id: number;
  title: string,
  place_of_origin: string,
  artist_display: string,
  inscriptions: string,
  date_start: number,
  date_end: number
}

const DataList: React.FC = () => {
  const [data, setData] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectAll, setSelectAll] = useState(false);

  const [lazyState, setlazyState] = useState({
    first: 0,
    rows: 12,
    page: 1,
  });

  const fetchData = async (page:number) => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.artic.edu/api/v1/artworks?page=${page}`);
      if (!response.ok) {throw new Error("Failed to fetch data");}
      const result = await response.json();
      setData(result.data);
      setTotalRecords(result.pagination.total)
      console.log(result);
    } 
    catch (error) {setError((error as Error).message)} 
    finally {setLoading(false)}
  };
  useEffect(() => {fetchData(lazyState.page)}, [lazyState.page]);

  const onPage = (event) => {
    setlazyState({
      ...lazyState,
      first: event.first,
      rows: event.rows,
      page: event.page + 1
    });
  };

  const onSelectionChange = (event) => {
      const value = event.value;

      setSelectedRow(value);
      setSelectAll(value.length === totalRecords);
  };

  if (loading) {return <div>Loading...</div>}
  if (error) {return <div>Error: {error}</div>}

  return (
    <div>
      <div className="main-div">
            <DataTable 
            value={data} 
            lazy 
            dataKey="id" 
            paginator
            first={lazyState.first} 
            rows={12} 
            totalRecords={totalRecords} 
            onPage={onPage} 
            loading={loading}
            tableStyle={{ minWidth: '80rem', padding:'0rem 1rem', textAlign:'start', margin:'1.2rem 0rem'}} 
            selectionMode={null} 
            selection={selectedRow} 
            onSelectionChange={onSelectionChange} 
            selectAll={selectAll}>
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                <Column field="title" header="Title" style={{ width: '17%', padding:'0rem 1rem' }}></Column>
                <Column field="place_of_origin" header="Origin" style={{ width: '10%' }}></Column>
                <Column field="artist_display" header="Artist" style={{ width: '27%', padding : '0rem 2rem' }}></Column>
                <Column field="inscriptions" header="Inscription" style={{ width: '30%', padding : '0rem 2rem' }}></Column>
                <Column field="date_start" header="Start Date" style={{ width: '10%' }}></Column>
                <Column field="date_end" header="End Date" style={{ width: '10%' }}></Column>
            </DataTable>
        </div>
    </div>
  );
};

export default DataList;
