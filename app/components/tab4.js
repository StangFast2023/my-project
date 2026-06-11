import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useState, useMemo, useEffect } from 'react';
import T4P1_filterDlaListed from './sub-component/tab4/part1_filterDlaListed';
import T4P2_showingAllTable from './sub-component/tab4/part2_showingAllTable';
import ShowAllDataTable from './sub-component/tab4/showallDataTable';
import { useColumnStore } from '../components/useTableColumns';
export default function Tab4() {

    const [filters, setFilters] = useState(() => {
        const saved = localStorage.getItem('tab4Filters');
        return saved ? JSON.parse(saved) : {
            regions: [],
            positions: [],
            showEmpty: false,
            showExpired: true,
            all_header: null
        };
    });

    useEffect(() => {
        localStorage.setItem('tab4Filters', JSON.stringify(filters));
    }, [filters]);

    const { data: configData } = useQuery({
        queryKey: ['tab4Config'],
        queryFn: async () => {
            const res = await fetch(`https://dla-backend-production.up.railway.app/api/recruitment/tab4`);
            if (!res.ok) throw new Error('Network response was not ok');
            return res.json();
        },
        staleTime: 1000 * 60 * 60,
        gcTime: 1000 * 60 * 60 * 2,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });

    const { data: tableData, isLoading } = useQuery({
        queryKey: ['tab4Table', filters],
        queryFn: async () => {
            const response = await axios.post(`https://dla-backend-production.up.railway.app/api/updating-tab4-table`, {
                cleanRegions: filters.regions,
                cleanPositions: filters.positions,
                showEmpty: filters.showEmpty,
                showExpired: filters.showExpired
            });
            return response.data;
        },
        enabled: !!filters.regions || !!filters.positions,
        staleTime: 1000 * 60 * 60,
        gcTime: 1000 * 60 * 60 * 2,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });

    const columns = useColumnStore((state) => state.columns);

    const initialConfig = useMemo(() => {
        const regions = Object.keys(configData?.tab4?.part1?.region || {});
        const subs = [];
        regions.forEach(regId => {
            const subList = Object.keys(configData?.tab4?.part1?.region[regId].sub || {});
            subList.forEach(subId => subs.push(`${regId}-${subId}`));
        });
        return { regions, subs };
    }, [configData]);

    const [selectedRegions, setSelectedRegions] = useState(initialConfig.regions);
    const [selectedSubRegions, setSelectedSubRegions] = useState(initialConfig.subs);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [selectedPositions, setSelectedPositions] = useState([]);

    const tableDataResult = tableData || { tab4: { part2: { data: {} } } };
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
                <div className={`${configData ? '' : 'bg-white/50 animate-pulse rounded-2xl mb-6'} grid grid-cols-12 gap-6 my-2`} style={{ height: configData ? 'auto' : '150px' }}>
                    <div className="col-span-12 lg:col-span-12">
                        <T4P1_filterDlaListed

                            data={configData}

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
                <div className={`g${!columns.all_header ? 'hidden' : 'block'} ${configData ? '' : 'bg-white/50 animate-pulse rounded-2xl mb-6'}`}>
                    <div className="col-span-12 lg:col-span-12 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <T4P2_showingAllTable checkData={configData} data={tableDataResult} isLoading={isLoading} />
                    </div>
                </div>
                <div className={`${columns.all_header ? 'hidden' : 'block'} ${configData ? '' : 'bg-white/50 animate-pulse rounded-2xl mb-6'}`}>
                    <div className="col-span-12 lg:col-span-12 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-sm md:text-base lg:text-lg font-bold mb-6 text-gray-700">📅 ข้อมูลสรุปการเรียกบรรจุรายเขต</h3>
                        <ShowAllDataTable checkData={configData} part2={tableData} isLoading={isLoading} />
                    </div>
                </div>
            </div>
        </div>
    );
}