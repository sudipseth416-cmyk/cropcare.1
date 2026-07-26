import React, { useEffect, useRef } from 'react';
import { AlertTriangle, Info, Droplets, CloudRain } from 'lucide-react';
import { WeatherData } from '@/hooks/useWeather';
import { useNotifications } from '@/hooks/useNotifications';

interface Alert {
  type: 'warning' | 'info' | 'danger';
  message: string;
  icon: any;
}

export default function FarmingAlerts({ weather }: { weather: WeatherData }) {
  const { sendNotification, requestPermission, permission } = useNotifications();
  const lastAlertRef = useRef<string | null>(null);
  const alerts: Alert[] = [];

  // Logic for farming alerts
  if ((weather?.main?.humidity ?? 0) > 70) {
    alerts.push({
      type: 'warning',
      message: 'High humidity detected. Increased risk of fungal diseases. Monitor closely.',
      icon: Droplets
    });
  }

  if (weather?.rain && weather?.rain["1h"] && (weather?.rain["1h"] ?? 0) > 0) {
    alerts.push({
      type: 'danger',
      message: 'Active rainfall detected. Deactivate irrigation systems.',
      icon: CloudRain
    });
  }

  if ((weather?.main?.temp ?? 0) > 35) {
    alerts.push({
      type: 'warning',
      message: 'Extreme heat alert. Increase irrigation frequency.',
      icon: AlertTriangle
    });
  }

  const alertString = JSON.stringify(alerts.map(a => a.message));

  useEffect(() => {
    const criticalAlert = alerts.find(a => a.type === 'danger' || a.type === 'warning');
    if (criticalAlert && criticalAlert.message !== lastAlertRef.current) {
      sendNotification(`CropCare Alert: ${criticalAlert.type === 'danger' ? 'Emergency' : 'Warning'}`, {
        body: criticalAlert.message,
      });
      lastAlertRef.current = criticalAlert.message;
    }
  }, [alertString, sendNotification]);

  if (alerts.length === 0) {
    alerts.push({
      type: 'info',
      message: 'Weather conditions are stable for farming.',
      icon: Info
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <AlertTriangle size={20} className="text-warning" /> AI Farming Alerts
        </h3>
        {permission !== 'granted' && (
          <button 
            onClick={() => requestPermission()}
            className="text-[10px] font-bold text-primary uppercase border border-primary/20 px-2 py-1 rounded-lg"
          >
            Enable Popups
          </button>
        )}
      </div>
      {alerts.map((alert, i) => (
        <div 
          key={i} 
          className={`
            p-4 rounded-2xl border flex gap-4 items-start transition-all
            ${alert.type === 'warning' ? 'bg-warning/10 border-warning/20 text-warning' : ''}
            ${alert.type === 'danger' ? 'bg-danger/10 border-danger/20 text-danger' : ''}
            ${alert.type === 'info' ? 'bg-info/10 border-info/20 text-info' : ''}
          `}
        >
          <div className="mt-1"><alert.icon size={20} /></div>
          <p className="text-sm font-medium leading-relaxed">{alert.message}</p>
        </div>
      ))}
    </div>
  );
}
