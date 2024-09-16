import React, { useEffect, useState, useRef } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FaChevronDown } from "react-icons/fa";
import { OverlayPanel } from "primereact/overlaypanel";

interface Item {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
}

const DataList: React.FC = () => {
  const [data, setData] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<Item[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [lazyState, setLazyState] = useState({
    first: 0,
    rows: 12,
    page: 1,
  });
  const open = useRef(null);
  const [selectCount, setSelectCount] = useState(0);
  const [remainingToSelect, setRemainingToSelect] = useState(0);

  const fetchData = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.artic.edu/api/v1/artworks?page=${page}`);
      if (!response.ok) { throw new Error("Failed to fetch data"); }
      const result = await response.json();
      setData(result.data);
      setTotalRecords(result.pagination.total);
      return result;
    } catch (error) {
      setError((error as Error).message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(lazyState.page);
  }, [lazyState.page]);

  useEffect(() => {
    if (remainingToSelect > 0) {
      const currentPageData = data.slice(0, Math.min(data.length, remainingToSelect));
      console.log(currentPageData);
      setSelectedRows((prevSelectedRows) => [...prevSelectedRows, ...currentPageData]);
      setRemainingToSelect(remainingToSelect - currentPageData.length);
    }
  }, [data]);

  const onPage = (event:any) => {
    setLazyState({
      ...lazyState,
      first: event.first,
      rows: event.rows,
      page: event.page + 1,
    });
  };

  const onSelectionChange = (event:any) => {
    setSelectedRows(event.value);
  };

  const handleInputChange = (e) => {
    setSelectCount(Number(e.target.value));
  };

  const handleSubmit = () => {
    let selectedItems:any[] = [];
    let rowsToSelectNow = Math.min(selectCount, data.length);
    let remaining = selectCount - rowsToSelectNow;

    if (rowsToSelectNow > 0) {
      selectedItems = [...data.slice(0, rowsToSelectNow)];
    }

    setSelectedRows(selectedItems); 
    setRemainingToSelect(remaining);
    open.current.hide();
  };

  const headerWithSvg = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
      <FaChevronDown onClick={(e) => open.current.toggle(e)} />
      <OverlayPanel ref={open}>
        <div style={{
          border: '1px solid #EAEAEA',
          backgroundColor: '#212121',
          borderRadius: '8px',
          padding: '0.8rem 0.6rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          position: 'absolute',
          top: '12rem'
        }}>
          <input
            type="number"
            placeholder="Select rows..."
            className="overlay-input"
            onChange={handleInputChange} // Update selectCount on input change
          />
          <input
            type="submit"
            value="Submit"
            className="overlay-submit-btn"
            onClick={handleSubmit} // Submit button to trigger selection
          />
        </div>
      </OverlayPanel>
      Title
    </div>
  );

  if (loading) { return <div>Loading...</div>; }
  if (error) { return <div>Error: {error}</div>; }

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
          tableStyle={{ minWidth: '80rem', padding: '0rem 1rem', textAlign: 'start', margin: '1.2rem 0rem' }}
          selection={selectedRows}
          onSelectionChange={onSelectionChange}
        >
          <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
          <Column field="title" header={headerWithSvg} style={{ width: '17%', padding: '0rem 1rem' }}></Column>
          <Column field="place_of_origin" header="Origin" style={{ width: '10%' }}></Column>
          <Column field="artist_display" header="Artist" style={{ width: '27%', padding: '0rem 2rem' }}></Column>
          <Column field="inscriptions" header="Inscription" style={{ width: '30%', padding: '0rem 2rem' }}></Column>
          <Column field="date_start" header="Start Date" style={{ width: '10%' }}></Column>
          <Column field="date_end" header="End Date" style={{ width: '10%' }}></Column>
        </DataTable>
      </div>
    </div>
  );
};

export default DataList;
