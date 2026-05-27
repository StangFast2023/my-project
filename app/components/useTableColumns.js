import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useColumnStore = create(persist((set) => ({
    columns: { 
        all_header:     true,
        column_part1:   true,
        column_part2:   true,
        column_part3:   true,
    },
    setColumns: (newSettings) => set({ columns: newSettings }),
    
}), { 
    name: 'table-storage' 
}));