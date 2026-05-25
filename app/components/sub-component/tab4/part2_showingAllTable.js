"use client";
import React, { useMemo }   from 'react';
import { motion }           from 'framer-motion';
import { LoadingScreen }    from '../../../components/LoadingScreen';
const maxR = 10;
export default function T2P7_TableAllType({data}) {
    if(!data) return <LoadingScreen />;
    const part2 = data?.tab4?.part2 || null;
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}   
            transition={{ duration: 0.5 }}  
        >
            <h3 className="text-lg font-bold mb-6 text-gray-700">📅 สรุปยอดเรียกรายงาน</h3>  
        </motion.div>
    );
}