import { useState, lazy, Suspense } from 'react';
import { 
  X, MapPin, Phone, Mail, Calendar, Heart, Share2, 
  ChevronLeft, ChevronRight, Bed, Bath, Maximize, 
  FileCheck, Star, MessageCircle, Move3D, Video, Eye
} from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Property } from '@/types/property';
import { formatPrice, getPropertyTypeLabel } from '@/data/mockData';

// Lazy load the heavy 3D components
const PropertyVisualization = lazy(() => import('@/components/virtual-tour/PropertyVisualization'));

interface PropertyDetailModalProps {
  property: Property | null;
  open: boolean;
  onClose: () => void;
}

const PropertyDetailModal = ({ property, open, onClose }: PropertyDetailModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('photos');

  if (!property) return null;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  // Check if property supports virtual tour
  const supportsVirtualTour = property.type === 'residential' || property.type === 'commercial' || property.type === 'rental' || property.type === 'land' || property.type === 'agricultural';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto p-0">
        {/* View Mode Tabs */}
        <div className="sticky top-0 z-20 bg-background border-b">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start rounded-none bg-transparent border-0 p-0 h-12">
              <TabsTrigger 
                value="photos" 
                className="gap-1.5 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                <Eye className="h-4 w-4" />
                Photos
              </TabsTrigger>
              {supportsVirtualTour && (
                <TabsTrigger 
                  value="virtual-tour"
                  className="gap-1.5 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  <Move3D className="h-4 w-4" />
                  Virtual Tour
                </TabsTrigger>
              )}
            </TabsList>
          </Tabs>
        </div>

        {/* Photos Tab */}
        {activeTab === 'photos' && (
          <div className="relative aspect-video">
            <img
              src={property.images[currentImageIndex]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            
            {/* Navigation arrows */}
            {property.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}

            {/* Image indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {property.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-primary' : 'bg-background/60'
                  }`}
                />
              ))}
            </div>

            {/* Top actions */}
            <div className="absolute top-3 right-3 flex gap-2">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Badges */}
            <div className="absolute top-3 left-3 flex gap-2">
              {property.isFeatured && <Badge variant="featured">Featured</Badge>}
              <Badge variant="orange">{getPropertyTypeLabel(property.type)}</Badge>
            </div>

            {/* Virtual Tour Button Overlay */}
            {supportsVirtualTour && (
              <button
                onClick={() => setActiveTab('virtual-tour')}
                className="absolute bottom-3 right-3 flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full font-medium text-sm hover:bg-primary/90 transition-colors shadow-lg"
              >
                <Move3D className="h-4 w-4" />
                View 3D Tour
              </button>
            )}
          </div>
        )}

        {/* Virtual Tour Tab */}
        {activeTab === 'virtual-tour' && supportsVirtualTour && (
          <div className="p-4">
            <Suspense fallback={
              <div className="h-[400px] rounded-xl bg-muted animate-pulse flex items-center justify-center">
                <div className="text-center">
                  <Move3D className="h-12 w-12 text-muted-foreground mx-auto mb-3 animate-spin" />
                  <p className="text-muted-foreground">Loading 3D Experience...</p>
                </div>
              </div>
            }>
              <PropertyVisualization property={property} />
            </Suspense>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="font-heading text-3xl font-bold text-foreground">
                    {formatPrice(property.price, property.currency)}
                  </span>
                  {property.type === 'rental' && (
                    <span className="text-muted-foreground">/month</span>
                  )}
                </div>
                <h2 className="font-heading text-xl font-semibold text-foreground mb-2">
                  {property.title}
                </h2>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{property.location.address}, {property.location.district}</span>
                </div>
              </div>

              {/* Quick stats */}
              <div className="flex flex-wrap gap-4 p-4 bg-muted rounded-xl">
                {property.bedrooms && (
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
                      <Bed className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">{property.bedrooms}</div>
                      <div className="text-xs text-muted-foreground">Bedrooms</div>
                    </div>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
                      <Bath className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">{property.bathrooms}</div>
                      <div className="text-xs text-muted-foreground">Bathrooms</div>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
                    <Maximize className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">{property.size.value} {property.size.unit}</div>
                    <div className="text-xs text-muted-foreground">Size</div>
                  </div>
                </div>
                {property.hasTitle && (
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-semkat-success/10 flex items-center justify-center">
                      <FileCheck className="h-5 w-5 text-semkat-success" />
                    </div>
                    <div>
                      <div className="font-semibold text-semkat-success">Titled</div>
                      <div className="text-xs text-muted-foreground">Documentation</div>
                    </div>
                  </div>
                )}
                {supportsVirtualTour && (
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-semkat-sky-light flex items-center justify-center">
                      <Move3D className="h-5 w-5 text-semkat-sky" />
                    </div>
                    <div>
                      <div className="font-semibold text-semkat-sky">3D Tour</div>
                      <div className="text-xs text-muted-foreground">Available</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="font-heading font-semibold text-lg mb-3">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {property.description}
                </p>
              </div>

              {/* Features */}
              <div>
                <h3 className="font-heading font-semibold text-lg mb-3">Features & Amenities</h3>
                <div className="grid grid-cols-2 gap-2">
                  {property.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar - Agent card */}
            <div className="lg:col-span-1">
              <div className="sticky top-16 p-5 border rounded-xl bg-card space-y-4">
                {property.agent && (
                  <>
                    <div className="flex items-center gap-3">
                      <img
                        src={property.agent.avatar}
                        alt={property.agent.name}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-heading font-semibold">{property.agent.name}</h4>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span>{property.agent.rating}</span>
                          <span>·</span>
                          <span>{property.agent.totalListings} listings</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Button variant="hero" className="w-full">
                        <Phone className="h-4 w-4 mr-2" />
                        Call Agent
                      </Button>
                      <Button variant="outline-sky" className="w-full">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Send Message
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Visit
                      </Button>
                      {supportsVirtualTour && activeTab !== 'virtual-tour' && (
                        <Button 
                          variant="sky" 
                          className="w-full"
                          onClick={() => setActiveTab('virtual-tour')}
                        >
                          <Move3D className="h-4 w-4 mr-2" />
                          View Virtual Tour
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyDetailModal;
