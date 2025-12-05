import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-hero">
                <span className="font-heading text-xl font-bold text-primary-foreground">S</span>
              </div>
              <span className="font-heading text-xl font-bold">Semkat</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your trusted partner for real estate, land investments, construction, and financial services across Uganda.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="h-9 w-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="h-9 w-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="h-9 w-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="h-9 w-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {['Properties', 'Land Sales', 'Rentals', 'Commercial', 'Agents'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Services</h4>
            <ul className="space-y-3">
              {['Land Documentation', 'Construction', 'Property Financing', 'Property Management', 'Valuation'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-muted-foreground text-sm hover:text-primary transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-muted-foreground text-sm">
                <MapPin className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                <span>Plot 45, Kampala Road<br />Kampala, Uganda</span>
              </li>
              <li>
                <a href="tel:+256700123456" className="flex items-center gap-3 text-muted-foreground text-sm hover:text-primary transition-colors">
                  <Phone className="h-4 w-4 text-primary" />
                  +256 700 123 456
                </a>
              </li>
              <li>
                <a href="mailto:info@semkat.ug" className="flex items-center gap-3 text-muted-foreground text-sm hover:text-primary transition-colors">
                  <Mail className="h-4 w-4 text-primary" />
                  info@semkat.ug
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2024 Semkat Group Uganda Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
