import { Client } from 'pg';
import { NextResponse } from 'next/server';

export async function GET() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL, // เอา URL ของ Neon มาใส่ใน Vercel Environment Variables
    });

    try {
        await client.connect();
        // ตรงนี้ใส่ Query ที่คุณเคยเขียนใน Laravel ได้เลยครับ
        const result = await client.query('SELECT sum(total::integer) as total FROM calling_dla WHERE call_status = 1');
        return NextResponse.json(result.rows[0]);
    } catch (error) {
        return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    } finally {
        await client.end();
    }
}