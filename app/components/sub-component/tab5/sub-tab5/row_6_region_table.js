
"use client";
import React from 'react';
import { AppWindow, TrendingUp, TrendingDown, Equal } from 'lucide-react';

export default function Row6RegionTable({ data }) {
    const TableData = data?.chart_3_region || {};
    if (!TableData) return null;
    const regionText = {
        '1': 'ภาคเหนือ',
        '2': 'ภาคเหนือ',
        '3': 'ภาคตะวันออกเฉียงเหนือ',
        '4': 'ภาคใต้',
    };
    return (
        <div>

        </div>
    );
}