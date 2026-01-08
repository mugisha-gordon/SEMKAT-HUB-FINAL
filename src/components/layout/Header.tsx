import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, MapPin, Phone, User, Heart, Bell, LayoutDashboard, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, role, signOut } = useAuth();

  const navLinks = [
    { label: 'Explore', href: '/explore' },
    { label: 'Properties', href: '/properties' },
    { label: 'Services', href: '/services' },
    { label: 'Agents', href: '/agents' },
    { label: 'Settings', href: '/settings' },
    { label: 'About', href: '/about' },
  ];

  const getDashboardLink = () => {
    switch (role) {
      case 'admin':
        return '/admin';
      case 'agent':
        return '/agent-dashboard';
      default:
        return '/dashboard';
    }
  };

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
          {/* Only show Saved and Alerts when logged in */}
          {user && (
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
          )}
        </div>
      </div>

      {/* Main header */}
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex items-center justify-center h-14 w-14  shadow-md">
            <img 
              src="/LOGO.png" 
              alt="Semkat Group Uganda Limited" 
              className="h-10 w-10 object-contain"
              onError={(e) => {
                // Fallback if SVG doesn't load
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-lg font-bold text-foreground leading-tight">
              Semkat Group
            </span>
            <span className="text-xs text-muted-foreground">Uganda Limited</span>
          </div>
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
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <User className="h-5 w-5" />
                  {role && (
                    <span className={cn(
                      "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background",
                      role === 'admin' ? 'bg-red-500' : role === 'agent' ? 'bg-semkat-orange' : 'bg-semkat-sky'
                    )} />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to={getDashboardLink()} className="flex items-center gap-2 cursor-pointer">
                    <LayoutDashboard className="h-4 w-4" />
                    {role === 'admin' ? 'Admin Panel' : role === 'agent' ? 'Agent Dashboard' : 'My Dashboard'}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/favorites" className="flex items-center gap-2 cursor-pointer">
                    <Heart className="h-4 w-4" />
                    Saved Properties
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center gap-2 cursor-pointer">
                    <User className="h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="flex items-center gap-2 cursor-pointer text-destructive">
                  <LogOut className="h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="icon" className="hidden md:flex" asChild>
                <Link to="/auth">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="hero" className="hidden sm:flex" asChild>
                <Link to="/auth">Login</Link>
              </Button>
            </>
          )}
          
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
          isMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
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
          {user ? (
            <>
              <Link
                to={getDashboardLink()}
                className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors flex items-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <LayoutDashboard className="h-4 w-4" />
                {role === 'admin' ? 'Admin Panel' : role === 'agent' ? 'Agent Dashboard' : 'My Dashboard'}
              </Link>
              <Button variant="outline" className="w-full mt-2" onClick={() => { signOut(); setIsMenuOpen(false); }}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </Button>
            </>
          ) : (
            <Button variant="hero" className="w-full mt-2" asChild>
              <Link to="/auth" onClick={() => setIsMenuOpen(false)}>Login</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
