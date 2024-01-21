import { NextResponse } from "next/server";
export async function GET(req, { params }) {
  const client = new Client({});
  const { lat, lon } = req.query;

  console.log("Request URL:", `/api/search?lat=${lat}&lon=${lon}`);

  const response = await client.placesNearby({
    params: {
      key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      location: { lat: parseFloat(lat), lng: parseFloat(lon) },
      radius: 1000,
      type: "convenience_store",
    },
  });

  console.log("Response:", response.data);

  try {
    const response = await client.placesNearby({
      params: {
        key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        location: { lat: parseFloat(lat), lng: parseFloat(lon) },
        radius: 1000,
        type: "convenience_store",
      },
    });

    if (response.data.status === "OK") {
      res.status(200).json(response.data.results);
      return NextResponse.json(response.data.results);
    } else {
      res.status(500).json({ error: "Error fetching data" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
