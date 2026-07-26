import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Prevent Next.js from caching the weather response

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const q = searchParams.get('q') || 'Ludhiana';

  try {
    const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    const hasApiKey = API_KEY && API_KEY !== 'your_key_here';

    // 1. If API Key exists, use OpenWeather API for both coords and city name
    if (hasApiKey) {
      let openWeatherUrl = '';
      if (lat && lon) {
        openWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
      } else {
        openWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${q}&appid=${API_KEY}&units=metric`;
      }
      
      const res = await fetch(openWeatherUrl, { next: { revalidate: 0 } });
      if (res.ok) {
        return NextResponse.json(await res.json());
      }
    }

    // 2. Fallback to Open-Meteo if no API key or if OpenWeather failed (for coords)
    if (lat && lon) {
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&timezone=auto`,
        { next: { revalidate: 0 } }
      );
      const weatherData = await weatherRes.json();

      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`,
        { headers: { 'User-Agent': 'CropCare/1.0' }, next: { revalidate: 0 } }
      );
      const geoData = await geoRes.json();
      const address = geoData?.address || {};
      const locationName = address.city || address.town || address.village || address.suburb || address.state || "Your Farm";

      return NextResponse.json({
        name: locationName,
        main: {
          temp: weatherData?.current?.temperature_2m ?? 25,
          humidity: weatherData?.current?.relative_humidity_2m ?? 60,
          pressure: 1013,
        },
        weather: [{
          main: getWeatherDesc(weatherData?.current?.weather_code ?? 0),
          description: "Live from your fields",
          icon: "04d"
        }],
        wind: { speed: weatherData?.current?.wind_speed_10m ?? 0 },
        sys: { country: address.country_code?.toUpperCase() || "IN" },
        rain: { "1h": weatherData?.current?.precipitation ?? 0 }
      });
    }

    // 3. Default Demo Fallback if no API key and no coords
    return NextResponse.json({
      name: `${q} (Demo)`,
      main: { temp: 28.5, humidity: 75, pressure: 1012 },
      weather: [{ main: "Clouds", description: "broken clouds", icon: "04d" }],
      wind: { speed: 4.2 },
      sys: { country: "IN" }
    });

  } catch (error) {
    console.error("Weather API Error:", error);
    return NextResponse.json({ error: 'Failed to fetch weather' }, { status: 500 });
  }
}

function getWeatherDesc(code: number) {
  if (code === 0) return "Clear Sky";
  if (code <= 3) return "Partly Cloudy";
  if (code <= 48) return "Foggy";
  if (code <= 67) return "Rainy";
  if (code <= 77) return "Snowy";
  if (code <= 82) return "Showers";
  if (code <= 99) return "Thunderstorm";
  return "Clear";
}
