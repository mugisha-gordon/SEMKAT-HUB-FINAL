import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle2, AlertTriangle, Home, FileText, LogIn } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  getNotificationsForUser,
  markNotificationAsRead,
  type NotificationDocument,
  type NotificationType,
} from "@/integrations/firebase/notifications";

const variantStyles: Record<string, string> = {
  info: "from-semkat-sky/20 to-semkat-sky/5 border-semkat-sky/30",
  success: "from-semkat-success/20 to-semkat-success/5 border-semkat-success/30",
  warning: "from-semkat-warning/20 to-semkat-warning/5 border-semkat-warning/30",
};

const Notifications = () => {
  const { user, loading } = useAuth();
  const [items, setItems] = useState<NotificationDocument[]>([]);
  const [itemsLoading, setItemsLoading] = useState(false);

  const iconByType = useMemo(
    () =>
      ({
        info: Home,
        success: FileText,
        warning: AlertTriangle,
      }) satisfies Record<NotificationType, any>,
    []
  );

  useEffect(() => {
    if (!user) {
      setItems([]);
      return;
    }

    setItemsLoading(true);
    getNotificationsForUser(user.uid, { limit: 50 })
      .then(setItems)
      .catch((e) => {
        console.error("Error loading notifications", e);
      })
      .finally(() => setItemsLoading(false));
  }, [user]);

  const handleMarkRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      setItems((prev) => prev.map((n) => (n.id === id ? { ...n, readAt: n.readAt ?? (n as any).readAt } : n)));
    } catch (e) {
      console.error("Error marking notification as read", e);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pb-12">
        <section className="relative overflow-hidden py-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--semkat-orange)/0.2),transparent_40%),radial-gradient(circle_at_80%_10%,hsl(var(--semkat-sky)/0.2),transparent_35%)]" />
          <div className="container relative flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-semkat-sky-light backdrop-blur flex items-center justify-center border border-semkat-sky/20">
              <Bell className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Stay in sync with your deals</p>
              <h1 className="font-heading text-3xl font-bold text-foreground">Notifications</h1>
            </div>
          </div>
        </section>

        <section className="container pb-10 space-y-4">
          {/* Show login prompt if not authenticated */}
          {!loading && !user ? (
            <Card className="bg-card border p-10 text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-semkat-sky-light">
                <LogIn className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="font-heading text-2xl font-semibold text-foreground">Sign in to view notifications</h3>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Create an account or sign in to receive property alerts and updates.
              </p>
              <div className="flex justify-center gap-3">
                <Button variant="hero" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/properties">Browse Properties</Link>
                </Button>
              </div>
            </Card>
          ) : itemsLoading ? (
            <Card className="bg-card border p-10 text-center space-y-4">
              <div className="mx-auto w-12 h-12 border-4 border-semkat-sky border-t-transparent rounded-full animate-spin" />
              <p className="text-muted-foreground">Loading notifications...</p>
            </Card>
          ) : (
            <>
              {items.length === 0 ? (
                <Card className="bg-card border p-10 text-center space-y-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-semkat-sky-light">
                    <Bell className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="font-heading text-2xl font-semibold text-foreground">No notifications yet</h3>
                  <p className="text-muted-foreground max-w-lg mx-auto">
                    When there are updates about properties, visits, or your account, you’ll see them here.
                  </p>
                </Card>
              ) : (
                items.map((item) => {
                  const Icon = iconByType[item.type];
                  const timeLabel = item.createdAt?.toDate?.().toLocaleString?.() || "";
                  const isRead = Boolean(item.readAt);
                return (
                  <Card
                    key={item.id}
                    className={`bg-gradient-to-r ${variantStyles[item.type]} border`}
                  >
                    <div className="p-5 flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background/80 border border-border">
                        <Icon className="h-5 w-5 text-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <Link to={`/notifications/${item.id}`} className="font-semibold text-foreground hover:underline">
                            {item.title}
                          </Link>
                          <Badge variant="outline" className="border-border text-muted-foreground">
                            {timeLabel}
                          </Badge>
                          {!isRead && (
                            <Badge className="bg-semkat-orange/20 text-semkat-orange border border-semkat-orange/30">
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground text-sm mt-1">{item.description}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-foreground"
                        onClick={() => handleMarkRead(item.id)}
                        disabled={isRead}
                      >
                        <CheckCircle2 className="h-5 w-5 mr-1" />
                        {isRead ? "Read" : "Mark read"}
                      </Button>
                    </div>
                  </Card>
                );
                })
              )}

              <Card className="bg-card border p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-xl font-semibold text-foreground">Control your alerts</h3>
                  <p className="text-muted-foreground text-sm">Choose channels for price updates, docs, and visits.</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    Mute all
                  </Button>
                  <Button variant="hero">Notification settings</Button>
                </div>
              </Card>
            </>
          )}
        </section>
      </main>
    </div>
  );
};

export default Notifications;

