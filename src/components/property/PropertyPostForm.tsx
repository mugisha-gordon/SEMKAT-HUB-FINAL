import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { createProperty } from "@/integrations/firebase/properties";
import type { PropertyType, PropertyStatus } from "@/types/property";
import { Plus } from "lucide-react";

interface PropertyPostFormProps {
  agentId: string;
  onSuccess?: () => void;
}

const PropertyPostForm = ({ agentId, onSuccess }: PropertyPostFormProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    type: "residential" as PropertyType,
    status: "available" as PropertyStatus,
    price: "",
    currency: "UGX",
    region: "",
    district: "",
    address: "",
    sizeValue: "",
    sizeUnit: "acres" as "acres" | "sqft" | "sqm" | "hectares",
    description: "",
    images: "" as string, // Comma-separated URLs
    features: "" as string, // Comma-separated
    hasTitle: true,
    bedrooms: "",
    bathrooms: "",
    isFeatured: false,
    installmentEnabled: false,
    depositPercentage: "",
    numberOfInstallments: "",
    installmentTerms: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Parse images
      const images = formData.images
        .split(",")
        .map((url) => url.trim())
        .filter((url) => url.length > 0);

      if (images.length === 0) {
        toast.error("Please provide at least one image URL");
        setLoading(false);
        return;
      }

      // Parse features
      const features = formData.features
        .split(",")
        .map((f) => f.trim())
        .filter((f) => f.length > 0);

      // Calculate installment payment if enabled
      let installmentPayment = undefined;
      if (formData.installmentEnabled && (formData.type === 'agricultural' || formData.type === 'land')) {
        const price = parseFloat(formData.price);
        const depositPercent = formData.depositPercentage ? parseFloat(formData.depositPercentage) : 30;
        const numInstallments = formData.numberOfInstallments ? parseInt(formData.numberOfInstallments) : 12;
        const depositAmount = (price * depositPercent) / 100;
        const remainingAmount = price - depositAmount;
        const installmentAmount = remainingAmount / numInstallments;

        installmentPayment = {
          enabled: true,
          depositPercentage: depositPercent,
          numberOfInstallments: numInstallments,
          installmentAmount: Math.round(installmentAmount),
          terms: formData.installmentTerms || undefined,
        };
      }

      const property = await createProperty({
        agentId,
        title: formData.title,
        type: formData.type,
        status: formData.status,
        price: parseFloat(formData.price),
        currency: formData.currency,
        location: {
          region: formData.region,
          district: formData.district,
          address: formData.address,
        },
        size: {
          value: parseFloat(formData.sizeValue),
          unit: formData.sizeUnit,
        },
        images,
        description: formData.description,
        features,
        hasTitle: formData.hasTitle,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : undefined,
        bathrooms: formData.bathrooms ? parseFloat(formData.bathrooms) : undefined,
        isFeatured: formData.isFeatured,
        installmentPayment,
      });

      toast.success("Property posted successfully!");
      setOpen(false);
      // Reset form
      setFormData({
        title: "",
        type: "residential",
        status: "available",
        price: "",
        currency: "UGX",
        region: "",
        district: "",
        address: "",
        sizeValue: "",
        sizeUnit: "acres",
        description: "",
        images: "",
        features: "",
        hasTitle: true,
        bedrooms: "",
        bathrooms: "",
        isFeatured: false,
        installmentEnabled: false,
        depositPercentage: "",
        numberOfInstallments: "",
        installmentTerms: "",
      });
      onSuccess?.();
    } catch (error: any) {
      console.error("Error posting property:", error);
      toast.error(error.message || "Failed to post property");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="hero" className="gap-2">
          <Plus className="h-4 w-4" />
          Post Property
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-white/10 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">Post New Property</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="3 Bedroom Villa in Kololo"
                required
                className="bg-white/5 border-white/20"
              />
            </div>
            <div className="space-y-2">
              <Label>Type *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as PropertyType })}>
                <SelectTrigger className="bg-white/5 border-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="land">Land</SelectItem>
                  <SelectItem value="rental">Rental</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="agricultural">Agricultural</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Installment Payment Option (for agricultural/land only) */}
          {(formData.type === 'agricultural' || formData.type === 'land') && (
            <div className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="installment" className="font-semibold text-semkat-orange cursor-pointer">
                  Enable Installment Payment Plan
                </Label>
                <Switch
                  id="installment"
                  checked={formData.installmentEnabled}
                  onCheckedChange={(checked) => setFormData({ ...formData, installmentEnabled: checked })}
                />
              </div>
              {formData.installmentEnabled && (
                <div className="grid grid-cols-3 gap-4 pl-6">
                  <div className="space-y-2">
                    <Label>Deposit %</Label>
                    <Input
                      type="number"
                      value={formData.depositPercentage}
                      onChange={(e) => setFormData({ ...formData, depositPercentage: e.target.value })}
                      placeholder="30"
                      className="bg-white/5 border-white/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Installments</Label>
                    <Input
                      type="number"
                      value={formData.numberOfInstallments}
                      onChange={(e) => setFormData({ ...formData, numberOfInstallments: e.target.value })}
                      placeholder="12"
                      className="bg-white/5 border-white/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Terms (optional)</Label>
                    <Input
                      value={formData.installmentTerms}
                      onChange={(e) => setFormData({ ...formData, installmentTerms: e.target.value })}
                      placeholder="Monthly"
                      className="bg-white/5 border-white/20"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status *</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as PropertyStatus })}>
                <SelectTrigger className="bg-white/5 border-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                  <SelectItem value="under-offer">Under Offer</SelectItem>
                  <SelectItem value="rented">Rented</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Price *</Label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="850000000"
                required
                className="bg-white/5 border-white/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Region *</Label>
              <Input
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                placeholder="Central Region"
                required
                className="bg-white/5 border-white/20"
              />
            </div>
            <div className="space-y-2">
              <Label>District *</Label>
              <Input
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                placeholder="Kampala"
                required
                className="bg-white/5 border-white/20"
              />
            </div>
            <div className="space-y-2">
              <Label>Address *</Label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Kololo Hill Road"
                required
                className="bg-white/5 border-white/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Size Value *</Label>
              <Input
                type="number"
                value={formData.sizeValue}
                onChange={(e) => setFormData({ ...formData, sizeValue: e.target.value })}
                placeholder="5"
                required
                className="bg-white/5 border-white/20"
              />
            </div>
            <div className="space-y-2">
              <Label>Size Unit *</Label>
              <Select value={formData.sizeUnit} onValueChange={(value) => setFormData({ ...formData, sizeUnit: value as any })}>
                <SelectTrigger className="bg-white/5 border-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="acres">Acres</SelectItem>
                  <SelectItem value="sqft">Square Feet</SelectItem>
                  <SelectItem value="sqm">Square Meters</SelectItem>
                  <SelectItem value="hectares">Hectares</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Bedrooms</Label>
              <Input
                type="number"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                placeholder="3"
                className="bg-white/5 border-white/20"
              />
            </div>
            <div className="space-y-2">
              <Label>Bathrooms</Label>
              <Input
                type="number"
                step="0.5"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                placeholder="2.5"
                className="bg-white/5 border-white/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description *</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Beautiful property description..."
              required
              rows={4}
              className="bg-white/5 border-white/20"
            />
          </div>

          <div className="space-y-2">
            <Label>Image URLs (comma-separated) *</Label>
            <Input
              value={formData.images}
              onChange={(e) => setFormData({ ...formData, images: e.target.value })}
              placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
              required
              className="bg-white/5 border-white/20"
            />
            <p className="text-xs text-white/50">Enter image URLs separated by commas</p>
          </div>

          <div className="space-y-2">
            <Label>Features (comma-separated)</Label>
            <Input
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              placeholder="Swimming Pool, Garage, Garden, Security"
              className="bg-white/5 border-white/20"
            />
          </div>

          <Button type="submit" variant="hero" className="w-full" disabled={loading}>
            {loading ? "Posting..." : "Post Property"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyPostForm;
