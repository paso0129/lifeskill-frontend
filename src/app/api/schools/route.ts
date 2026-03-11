import { NextRequest, NextResponse } from 'next/server';

const NEIS_API_KEY = '7ab65c4d39394a3a8b1abbd02b6ee35a';
const NEIS_API_URL = 'https://open.neis.go.kr/hub/schoolInfo';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';

  if (query.length < 2) {
    return NextResponse.json([]);
  }

  try {
    const params = new URLSearchParams({
      KEY: NEIS_API_KEY,
      Type: 'json',
      pIndex: '1',
      pSize: '10',
      SCHUL_KND_SC_NM: '초등학교',
      SCHUL_NM: query,
    });

    const res = await fetch(`${NEIS_API_URL}?${params.toString()}`);
    const data = await res.json();

    const rows = data?.schoolInfo?.[1]?.row;
    if (!rows) {
      return NextResponse.json([]);
    }

    const schools = rows.map((row: Record<string, string>) => ({
      name: row.SCHUL_NM,
      address: row.ORG_RDNMA,
      region: row.LCTN_SC_NM,
      code: row.SD_SCHUL_CODE,
    }));

    return NextResponse.json(schools);
  } catch {
    return NextResponse.json([]);
  }
}
