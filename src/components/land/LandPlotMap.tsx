import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MapPin, Navigation, Layers, ZoomIn, ZoomOut, Maximize2, Compass, Search, ExternalLink } from 'lucide-react';

interface Plot {
  id: string;
  number: string;
  size: string;
  status: 'available' | 'sold' | 'reserved';
  price: string;
  coordinates: { lat: number; lng: number };
}

interface LandPlotMapProps {
  estateName: string;
  location: string;
  totalPlots: number;
  plots: Plot[];
  centerCoordinates: { lat: number; lng: number };
}

const defaultPlots: Plot[] = [
  { id: '1', number: 'P001', size: '50x100ft', status: 'available', price: 'UGX 25M', coordinates: { lat: 0.3476, lng: 32.5825 } },
  { id: '2', number: 'P002', size: '50x100ft', status: 'sold', price: 'UGX 25M', coordinates: { lat: 0.3478, lng: 32.5827 } },
  { id: '3', number: 'P003', size: '50x100ft', status: 'available', price: 'UGX 28M', coordinates: { lat: 0.3480, lng: 32.5829 } },
  { id: '4', number: 'P004', size: '100x100ft', status: 'reserved', price: 'UGX 45M', coordinates: { lat: 0.3482, lng: 32.5825 } },
  { id: '5', number: 'P005', size: '50x100ft', status: 'available', price: 'UGX 25M', coordinates: { lat: 0.3484, lng: 32.5827 } },
  { id: '6', number: 'P006', size: '50x100ft', status: 'available', price: 'UGX 30M', coordinates: { lat: 0.3486, lng: 32.5829 } },
];

const LandPlotMap = ({
  estateName = "Semkat Gardens Estate",
  location = "Mukono, Central Region",
  totalPlots = 24,
  plots = defaultPlots,
  centerCoordinates = { lat: 0.3480, lng: 32.5827 }
}: Partial<LandPlotMapProps>) => {
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapView, setMapView] = useState<'satellite' | 'terrain'>('satellite');
  const [zoom, setZoom] = useState(16);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const filteredPlots = plots.filter(plot => 
    plot.number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusColors = {
    available: 'bg-green-500',
    sold: 'bg-red-500',
    reserved: 'bg-yellow-500'
  };

  const statusBadgeColors = {
    available: 'border-green-500/50 text-green-600 bg-green-50',
    sold: 'border-red-500/50 text-red-600 bg-red-50',
    reserved: 'border-yellow-500/50 text-yellow-600 bg-yellow-50'
  };

  const openInGoogleMaps = (coords?: { lat: number; lng: number }) => {
    const target = coords || centerCoordinates;
    window.open(`https://www.google.com/maps?q=${target.lat},${target.lng}`, '_blank');
  };

  const openDirections = (coords: { lat: number; lng: number }) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`, '_blank');
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="font-heading text-xl font-bold text-foreground">{estateName}</h3>
          <p className="text-muted-foreground text-sm flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {location} • {totalPlots} plots
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => openInGoogleMaps()} className="gap-1.5">
            <ExternalLink className="h-4 w-4" />
            View on Google Maps
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Map Container */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden border-2">
            {/* Map toolbar */}
            <div className="flex items-center justify-between p-3 bg-muted/50 border-b">
              <div className="flex gap-2">
                <Button
                  variant={mapView === 'satellite' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMapView('satellite')}
                  className="gap-1.5"
                >
                  <Layers className="h-4 w-4" />
                  Satellite
                </Button>
                <Button
                  variant={mapView === 'terrain' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMapView('terrain')}
                  className="gap-1.5"
                >
                  <Compass className="h-4 w-4" />
                  Terrain
                </Button>
              </div>
              <div className="flex gap-1">
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setZoom(z => Math.min(z + 1, 20))}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setZoom(z => Math.max(z - 1, 10))}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Map embed with plot overlay */}
            <div ref={mapContainerRef} className="relative h-[400px] bg-slate-200">
              {/* Google Maps iframe */}
              <iframe
                src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d${Math.pow(2, 21 - zoom)}!2d${centerCoordinates.lng}!3d${centerCoordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMMKwMjAnNTIuOCJOIDMywrAzNCc1Ny43IkU!5e${mapView === 'satellite' ? '1' : '0'}!3m2!1sen!2sug!4v1234567890`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              />
              
              {/* Plot overlay grid (simplified representation) */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg pointer-events-auto">
                  <h4 className="font-semibold text-sm mb-2">Estate Plot Layout</h4>
                  <div className="grid grid-cols-3 gap-1">
                    {plots.slice(0, 6).map(plot => (
                      <button
                        key={plot.id}
                        onClick={() => setSelectedPlot(plot)}
                        className={`w-10 h-10 rounded text-[10px] font-bold text-white flex items-center justify-center transition-transform hover:scale-110 ${statusColors[plot.status]} ${selectedPlot?.id === plot.id ? 'ring-2 ring-white ring-offset-2' : ''}`}
                      >
                        {plot.number.replace('P00', '')}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-3 text-[10px]">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-green-500" />Available</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-yellow-500" />Reserved</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-red-500" />Sold</span>
                  </div>
                </div>
              </div>

              {/* Selected plot info */}
              {selectedPlot && (
                <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-72 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold">Plot {selectedPlot.number}</h4>
                    <Badge variant="outline" className={statusBadgeColors[selectedPlot.status]}>
                      {selectedPlot.status}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground mb-3">
                    <p>Size: {selectedPlot.size}</p>
                    <p>Price: {selectedPlot.price}</p>
                    <p className="text-xs">Coords: {selectedPlot.coordinates.lat.toFixed(4)}, {selectedPlot.coordinates.lng.toFixed(4)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="hero" 
                      className="flex-1 gap-1"
                      onClick={() => openDirections(selectedPlot.coordinates)}
                    >
                      <Navigation className="h-3.5 w-3.5" />
                      Get Directions
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setSelectedPlot(null)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Plot list sidebar */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search plots..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <Card className="p-3 max-h-[360px] overflow-y-auto">
            <h4 className="font-semibold text-sm mb-3">All Plots ({filteredPlots.length})</h4>
            <div className="space-y-2">
              {filteredPlots.map(plot => (
                <button
                  key={plot.id}
                  onClick={() => setSelectedPlot(plot)}
                  className={`w-full text-left p-3 rounded-lg border transition-all hover:shadow-md ${
                    selectedPlot?.id === plot.id 
                      ? 'border-semkat-orange bg-semkat-orange/5' 
                      : 'border-border hover:border-semkat-orange/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm">{plot.number}</span>
                    <Badge variant="outline" className={`text-[10px] ${statusBadgeColors[plot.status]}`}>
                      {plot.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {plot.size} • {plot.price}
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Quick stats */}
          <Card className="p-3 bg-gradient-to-br from-semkat-orange/10 to-semkat-sky/10">
            <h4 className="font-semibold text-sm mb-2">Availability</h4>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-lg font-bold text-green-600">
                  {plots.filter(p => p.status === 'available').length}
                </div>
                <div className="text-[10px] text-muted-foreground">Available</div>
              </div>
              <div>
                <div className="text-lg font-bold text-yellow-600">
                  {plots.filter(p => p.status === 'reserved').length}
                </div>
                <div className="text-[10px] text-muted-foreground">Reserved</div>
              </div>
              <div>
                <div className="text-lg font-bold text-red-600">
                  {plots.filter(p => p.status === 'sold').length}
                </div>
                <div className="text-[10px] text-muted-foreground">Sold</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LandPlotMap;
