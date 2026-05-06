import { db } from '@/lib/db'; 
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [calling_dla] = await db.query('SELECT * FROM calling_dla');
    const [positions_dla] = await db.query('SELECT * FROM positions_dla');
    const [prefixes_dla] = await db.query('SELECT * FROM prefixes_dla');
    const [provinces_dla] = await db.query('SELECT * FROM provinces_dla');
    const [type_positions_dla] = await db.query('SELECT * FROM type_positions_dla');
    const [updated_list_dla] = await db.query('SELECT * FROM updated_list_dla');
    
    return NextResponse.json({
        calling: calling_dla,
        positions: positions_dla,
        prefixes: prefixes_dla,
        provinces: provinces_dla,
        typePositions: type_positions_dla,
        updatedList: updated_list_dla
    });
  } catch (error) {
    // บังคับให้ส่ง JSON แม้จะพัง เพื่อไม่ให้หน้าบ้านเจอ <!DOCTYPE
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}