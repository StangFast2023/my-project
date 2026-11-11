
import { Trophy } from 'lucide-react';

export const Completed = () => (
    <div className="flex flex-col items-center justify-center min-h-[350px] sm:min-h-[450px] lg:h-[600px] px-4 py-8 sm:px-6 bg-emerald-50 rounded-2xl border-2 border-dashed border-gray-200 text-center">
        <div className="text-emerald-600 mb-3 sm:mb-4">
            <Trophy
                size={100}
                className="w-20 h-20 sm:w-28 sm:h-28 lg:w-[150px] lg:h-[150px]"
            />
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold text-emerald-600">
            ยินดีด้วย
        </h3>
        <p className="text-sm sm:text-lg lg:text-xl text-emerald-600 mt-2 max-w-2xl leading-relaxed">
            คุณได้รับการบรรจุเป็นข้าราชการหรือพนักงานส่วนท้องถิ่นแล้วครับ
        </p>
    </div>
);
