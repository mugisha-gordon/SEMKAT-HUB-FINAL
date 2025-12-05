import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, MapPin, Phone, User, Heart, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Properties', href: '/properties' },
    { label: 'Land', href: '/properties?type=land' },
    { label: 'Rentals', href: '/properties?type=rental' },
    { label: 'Services', href: '/services' },
    { label: 'Agents', href: '/agents' },
    { label: 'About', href: '/about' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top bar */}
      <div className="hidden border-b bg-muted/50 md:block">
        <div className="container flex h-10 items-center justify-between text-sm">
          <div className="flex items-center gap-6">
            <a href="tel:+256700123456" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
              <Phone className="h-3.5 w-3.5" />
              +256 700 123 456
            </a>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              Kampala, Uganda
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/favorites" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
              <Heart className="h-3.5 w-3.5" />
              Saved
            </Link>
            <Link to="/notifications" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="h-3.5 w-3.5" />
              Alerts
            </Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-hero">
            <span className="font-heading text-xl font-bold text-primary-foreground">S</span>
          </div>
          <span className="font-heading text-xl font-bold text-foreground">
            Semkat
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="hero" className="hidden sm:flex">
            List Property
          </Button>
          
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile navigation */}
      <div
        className={cn(
          "lg:hidden absolute top-full left-0 right-0 bg-background border-b shadow-lg transition-all duration-300 overflow-hidden",
          isMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="container py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t my-2" />
          <Button variant="hero" className="w-full mt-2">
            List Property
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
