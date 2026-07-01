import { ImageResponse } from 'next/server';
import { getSiteConfig } from '@/lib/db';

export const runtime = 'nodejs';
export const revalidate = 0;

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default async function Icon() {
  try {
    const config = await getSiteConfig();
    const logoUrl = config?.logoUrl;

    if (logoUrl) {
      const response = await fetch(logoUrl);
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        const mimeType = response.headers.get('Content-Type') || 'image/png';
        const dataUrl = `data:${mimeType};base64,${base64}`;

        return new ImageResponse(
          (
            <img
              src={dataUrl}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 8,
              }}
            />
          ),
          {
            ...size,
          }
        );
      }
    }

    const name = config?.name || 'TectoFlow';
    const firstLetter = name[0].toUpperCase();

    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 22,
            background: '#f97316',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            borderRadius: 8,
          }}
        >
          {firstLetter}
        </div>
      ),
      {
        ...size,
      }
    );
  } catch (error) {
    console.error('Error generating favicon:', error);
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 22,
            background: '#f97316',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            borderRadius: 8,
          }}
        >
          T
        </div>
      ),
      {
        ...size,
      }
    );
  }
}
