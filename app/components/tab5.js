
import axios from 'axios';
import Swal from 'sweetalert2';
import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import withReactContent from 'sweetalert2-react-content';
import T5P1_filterDlaSearch from './sub-component/tab5/part1_filterDropdownSearch';
import T5P2_chartPrediction from './sub-component/tab5/part2_chartPredictions';
const MySwal = withReactContent(Swal);
export default function Tab5({ setIsOpen, details }) {

    const { data: configData } = useQuery({
        queryKey: ['tab5Config'],
        queryFn: async () => {
            const res = await fetch(`https://dla-backend-production.up.railway.app/api/recruitment/tab5`);
            if (!res.ok) throw new Error('Network response was not ok');
            return res.json();
        },
        staleTime: 10 * 60 * 1000,
    });
    const { data: dataforPrediction, isFetching } = useQuery({
        queryKey: ['predictionDetails', details],
        queryFn: async () => {
            if (!details) return null;
            const { regionId, areaId, positionId, sequence, frequency } = details;
            const response = await axios.get(
                `https://dla-backend-production.up.railway.app/api/prediction-user-detail/${regionId}/${areaId}/${positionId}/${sequence}/${frequency}`
            );
            return response.data;
        },
        enabled: !!details,
        staleTime: 5 * 60 * 1000,
    });
    useEffect(() => {
        if (isFetching) {
            Swal.fire({
                title: 'กำลังประมวลผล...',
                text: 'กรุณารอสักครู่ ระบบกำลังดึงข้อมูล',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
        } else {
            Swal.close();
        }
    }, [isFetching]);
    const prevIsFetching = useRef(isFetching);
    useEffect(() => {
        if (prevIsFetching.current === true && isFetching === false) {
            Swal.fire({
                icon: 'success',
                title: 'สำเร็จ!',
                text: 'ประมวลผลข้อมูลเสร็จเรียบร้อยแล้ว',
                timer: 2000,
                showConfirmButton: false
            });
        }
        prevIsFetching.current = isFetching;
    }, [isFetching]);
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
                <div className={`${configData ? '' : 'bg-white/50 animate-pulse p-20 rounded-2xl'} grid grid-cols-12 gap-6 my-2`} style={{ height: configData ? 'auto' : '180px' }}>
                    <div className={`${configData ? '' : 'hidden'} col-span-12 lg:col-span-12`}>
                        <T5P1_filterDlaSearch setIsOpen={setIsOpen} details={details} data={configData} />
                    </div>
                </div>
            </div>
            <div className={`${configData ? '' : 'bg-white/50 animate-pulse p-20 rounded-2xl'} my-1`} style={{ height: configData ? 'auto' : '800px' }}>
                <div className={`${configData ? '' : 'hidden'}`}>
                    <T5P2_chartPrediction details={details} base_data={configData} data={dataforPrediction} />
                </div>
            </div>
        </div>
    );
}