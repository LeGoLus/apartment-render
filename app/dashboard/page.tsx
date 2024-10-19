"use client"

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import FloorplanCanvas from '@/components/FloorplanCanvas';

interface Room {
  x: number;
  y: number;
}

interface FloorplanData {
  id: string;
  fileName: string;
  roomCount: number;
  imageUrl: string;
  rooms: Room[];
  totalArea: number;
  pricePerSqft: number;
}

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const [floorplanData, setFloorplanData] = useState<FloorplanData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const floorplanId = searchParams.get('floorplanId');
    if (floorplanId) {
      // Simulated data fetch
      try {
        setFloorplanData({
          id: floorplanId,
          fileName: 'example-floorplan.jpg',
          roomCount: 4,
          imageUrl: 'https://source.unsplash.com/random/800x600?apartment',
          rooms: [
            { x: 100, y: 100 },
            { x: 200, y: 200 },
            { x: 300, y: 300 },
            { x: 400, y: 400 },
          ],
          totalArea: 1200,
          pricePerSqft: 2.5,
        });
        setError(null);
      } catch (err) {
        console.error('Error fetching floorplan data:', err);
        setError('Failed to load floorplan data');
      }
    } else {
      setError('No floorplan ID provided');
    }
  }, [searchParams]);

  if (error) {
    return <div className="container mx-auto py-8 text-red-500">Error: {error}</div>;
  }

  if (!floorplanData) {
    return <div className="container mx-auto py-8">Loading...</div>;
  }

  const totalPrice = floorplanData.totalArea * floorplanData.pricePerSqft;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Floorplan Details</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Floorplan ID:</strong> {floorplanData.id}</p>
            <p><strong>File Name:</strong> {floorplanData.fileName}</p>
            <p><strong>Number of Rooms:</strong> {floorplanData.roomCount}</p>
            <p><strong>Total Area:</strong> {floorplanData.totalArea} sq ft</p>
            <p><strong>Price per sq ft:</strong> ${floorplanData.pricePerSqft.toFixed(2)}</p>
            <p><strong>Total Price:</strong> ${totalPrice.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Floorplan Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <FloorplanCanvas
              imageUrl={floorplanData.imageUrl}
              rooms={floorplanData.rooms}
              editable={false}
            />
          </CardContent>
        </Card>
      </div>
      <div className="mt-8">
        <Button>Edit Floorplan</Button>
        <Button className="ml-4">Publish Listing</Button>
      </div>
    </div>
  );
}