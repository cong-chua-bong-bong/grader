import { getAccessToken } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

export const GET = async function getAClass(req) {
  try {
    const { accessToken } = await getAccessToken();

    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.search);
    const classId = searchParams.get('classId');

    const response = await fetch(`${process.env.API_BASE_URL}/api/classes/${classId}/details`, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 200 });
  }
};
