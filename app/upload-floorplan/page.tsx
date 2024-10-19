"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import FloorplanCanvas from '@/components/FloorplanCanvas';
import { useToast } from '@/components/ui/use-toast';

interface Room {
  x: number;
  y: number;
}

export default function UploadFloorplanPage() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const { toast } = useToast();
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const fileUrl = URL.createObjectURL(selectedFile);
      setImageUrl(fileUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    // Simulate file upload and processing
    const formData = new FormData();
    formData.append('file', file);
    formData.append('rooms', JSON.stringify(rooms));

    // Simulated API call
    try {
      // In a real application, you would send the formData to your server
      // const response = await fetch('/api/upload-floorplan', { method: 'POST', body: formData });
      // const data = await response.json();

      // Simulated response
      const data = {
        id: 'floorplan-123',
        fileName: file.name,
        roomCount: rooms.length,
        // Add more properties as needed
      };

      toast({
        title: "Floorplan Uploaded Successfully",
        description: `File: ${file.name}, Rooms marked: ${rooms.length}`,
      });

      // Redirect to dashboard with the processed data
      router.push(`/dashboard?floorplanId=${data.id}`);
    } catch (error) {
      console.error('Error uploading floorplan:', error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your floorplan. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Upload Floorplan</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="floorplan">Floorplan Image</Label>
          <Input id="floorplan" type="file" accept="image/*,application/pdf" onChange={handleFileChange} />
        </div>
        {imageUrl && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Mark Rooms</h2>
            <FloorplanCanvas imageUrl={imageUrl} rooms={rooms} onRoomsChange={setRooms} />
          </div>
        )}
        <Button type="submit" disabled={!file}>
          Upload Floorplan {rooms.length > 0 ? `with ${rooms.length} Room${rooms.length > 1 ? 's' : ''}` : ''}
        </Button>
      </form>
    </div>
  );
}