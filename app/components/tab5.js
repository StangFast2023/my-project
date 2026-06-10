import React, { useCallback, useState, useEffect } from 'react';
import axios from 'axios';
import T5P1_filterDlaSearch from './sub-component/tab5/part1_filterDropdownSearch';
import T5P2_chartPrediction from './sub-component/tab5/part2_chartPredictions';
import LoadingSkeleton from '../components/sub-component/tab5/loading';
export default function Tab5({ setIsOpen, details }) {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true); useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`https://dla-backend-production.up.railway.app/api/recruitment/tab5`, { cache: 'no-store' });
                const result = await res.json();
                setData(result);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const [dataforPrediction, setdataforPrediction] = useState(null);
    const fetchData = useCallback(async (details) => {
        if (!details) return;
        const { regionId, areaId, positionId, sequence, frequency } = details;
        try {
            const response = await axios.get(`https://dla-backend-production.up.railway.app/api/prediction-user-detail/${regionId}/${areaId}/${positionId}/${sequence}/${frequency}`);
            setdataforPrediction(response.data);
        } catch (error) {
            console.error("Error fetching details:", error);
        }
    }, []);

    useEffect(() => {
        if (details) {
            const performFetch = async () => {
                await fetchData(details);
            };
            performFetch();
        }
    }, [details, fetchData]);
    if (!data && loading) return <LoadingSkeleton />;
    return (
        <div className="animate-fade-in">
            <div className="my-3">
                <div className="flex items-center gap-4 mb-8">
                    <div className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-teal-400 to-teal-600 rounded-2xl shadow-lg shadow-teal-100 aspect-[3/4]">
                        <span className="text-lg md:text-base lg:text-4xl font-black text-white drop-shadow-sm">
                            5
                        </span>
                    </div>
                    <div className="flex flex-col justify-center">
                        <h2 className="text-lg md:text-base lg:text-3xl font-black text-gray-800 leading-none font-kanit text-center">
                            ข้อมูลเจาะลึก และคาดการณ์เรียกบรรจุ
                        </h2>
                    </div>
                </div>
                <div className="grid grid-cols-12 gap-6 my-2">
                    <div className="col-span-12 lg:col-span-12">
                        <T5P1_filterDlaSearch setIsOpen={setIsOpen} details={details} data={data} />
                    </div>
                </div>
            </div>
            <div className="my-1">
                <T5P2_chartPrediction details={details} base_data={data} data={dataforPrediction} />
            </div>
        </div>
    );
}