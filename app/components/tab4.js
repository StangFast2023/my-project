import React, { useState, useEffect, useMemo } from 'react';

import T4P1_filterDlaListed from './sub-component/tab4/part1_filterDlaListed';
import T4P2_showingAllTable from './sub-component/tab4/part2_showingAllTable';
import ShowAllDataTable from './sub-component/tab4/showallDataTable';
import { LoadingScreen } from '../components/LoadingScreen';
import { useColumnStore } from '../components/useTableColumns';

export default function Tab4({ data }) {
    const columns = useColumnStore((state) => state.columns);
    const initialRegions = Object.keys(data?.tab4?.part1?.region || {});
    const [selectedRegions, setSelectedRegions] = useState(initialRegions);
    const [selectedSubRegions, setSelectedSubRegions] = useState(() => {
        const allSubs = [];
        Object.keys(data?.tab4?.part1?.region || {}).forEach(regId => {
            const subs = Object.keys(data?.tab4?.part1?.region[regId].sub || {});
            subs.forEach(subId => allSubs.push(`${regId}-${subId}`));
        });
        return allSubs;
    });
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [selectedPositions, setSelectedPositions] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({ regions: [], positions: [], showEmpty: false });
    const [fetchedData, setFetchedData] = useState(null);

    const tableData = useMemo(() => {
        if (fetchedData) return fetchedData;
        return data || { tab4: { part2: { data: {} } } };
    }, [data, fetchedData]);

    useEffect(() => {
        let ignore = false;
        requestAnimationFrame(() => {
            if (!ignore) setIsLoading(true);
        });
        fetch('http://127.0.0.1:8000/api/updating-tab4-table', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
                cleanRegions: filters.regions,
                cleanPositions: filters.positions,
                showEmpty: filters.showEmpty
            })
        })
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(result => {
                if (!ignore) {
                    setFetchedData(result);
                    setTimeout(() => {
                        setIsLoading(false);
                    }, 300);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                setIsLoading(false);
            });

        return () => { ignore = true; };
    }, [filters, data]);
    if (!data) return <LoadingScreen />;
    return (
        <div className="animate-fade-in">
            <div className="my-3">
                <div className="flex items-center gap-4 mb-8">
                    <div className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-teal-400 to-teal-600 rounded-2xl shadow-lg shadow-teal-100 aspect-[3/4]">
                        <span className="text-sm md:text-base lg:text-4xl font-black text-white drop-shadow-sm">
                            4
                        </span>
                    </div>
                    <div className="flex flex-col justify-center">
                        <h2 className="text-sm md:text-base lg:text-3xl font-black text-gray-800 leading-none font-kanit text-center">
                            ระบบสืบค้นและเจาะลึกสถิติการเรียกรายงานตัวรายเขตพื้นที่
                        </h2>
                    </div>
                </div>
                <div className="grid grid-cols-12 gap-6 my-2">
                    <div className="col-span-12 lg:col-span-12">
                        <T4P1_filterDlaListed

                            data={data}

                            selectedRegions={selectedRegions}
                            setSelectedRegions={setSelectedRegions}

                            selectedSubRegions={selectedSubRegions}
                            setSelectedSubRegions={setSelectedSubRegions}

                            selectedTypes={selectedTypes}
                            setSelectedTypes={setSelectedTypes}

                            selectedPositions={selectedPositions}
                            setSelectedPositions={setSelectedPositions}

                            filters={filters}
                            setFilters={setFilters}
                        />
                    </div>
                </div>
                <div className={`grid grid-cols-12 gap-6 my-2 ${!columns.all_header ? 'hidden' : 'block'}`}>
                    <div className="col-span-12 lg:col-span-12 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <T4P2_showingAllTable data={tableData} isLoading={isLoading} />
                    </div>
                </div>
                <div className={`grid grid-cols-12 gap-6 my-2 ${columns.all_header ? 'hidden' : 'block'}`}>
                    <div className="col-span-12 lg:col-span-12 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-sm md:text-base lg:text-lg font-bold mb-6 text-gray-700">📅 ข้อมูลสรุปการเรียกบรรจุรายเขต</h3>
                        <ShowAllDataTable part2={tableData} isLoading={isLoading} />
                    </div>
                </div>
            </div>
        </div>
    );
}