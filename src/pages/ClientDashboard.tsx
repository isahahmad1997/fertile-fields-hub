import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Leaf,
  LogOut,
  MapPin,
  FileText,
  Download,
  Calendar,
  CreditCard,
  User,
  Home,
} from "lucide-react";

interface ClientData {
  id: string;
  company_name: string;
  contact_person: string;
}

interface Farm {
  id: string;
  farm_name: string;
  total_area_ha: number;
  crop_type: string | null;
  location_description: string | null;
}

interface Service {
  id: string;
  service_type: string;
  status: string;
  area_covered_ha: number | null;
  cost: number | null;
  created_at: string;
}

interface Subscription {
  id: string;
  plan: string;
  status: string;
  start_date: string;
  end_date: string;
}

export default function ClientDashboard() {
  const navigate = useNavigate();
  const { user, loading, signOut, isAdmin } = useAuth();
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
    if (!loading && user && isAdmin) {
      navigate("/admin");
    }
  }, [user, loading, isAdmin, navigate]);

  useEffect(() => {
    if (user) {
      fetchClientData();
    }
  }, [user]);

  const fetchClientData = async () => {
    try {
      // Fetch client profile
      const { data: client } = await supabase
        .from("clients")
        .select("*")
        .eq("user_id", user?.id)
        .maybeSingle();

      if (client) {
        setClientData(client);

        // Fetch farms
        const { data: farmsData } = await supabase
          .from("farms")
          .select("*")
          .eq("client_id", client.id);

        setFarms(farmsData || []);

        // Fetch services
        const { data: servicesData } = await supabase
          .from("services")
          .select("*")
          .eq("client_id", client.id)
          .order("created_at", { ascending: false });

        setServices(servicesData || []);

        // Fetch subscription
        const { data: subData } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("client_id", client.id)
          .eq("status", "Active")
          .maybeSingle();

        setSubscription(subData);
      }
    } catch (error) {
      console.error("Error fetching client data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const totalArea = farms.reduce((sum, farm) => sum + Number(farm.total_area_ha), 0);

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-serif text-lg font-semibold text-foreground">
                GeoSoilLab
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="font-serif text-2xl lg:text-3xl font-bold text-foreground mb-2">
            Welcome, {clientData?.contact_person || user?.email}
          </h1>
          <p className="text-muted-foreground">
            {clientData ? clientData.company_name : "Manage your farms and view your soil data"}
          </p>
        </div>

        {!clientData ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                No Client Profile Found
              </CardTitle>
              <CardDescription>
                Your account is not yet linked to a client profile. Please contact an administrator to set up your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Farms</CardDescription>
                  <CardTitle className="text-3xl">{farms.length}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Total Area</CardDescription>
                  <CardTitle className="text-3xl">{totalArea.toFixed(1)} ha</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Active Services</CardDescription>
                  <CardTitle className="text-3xl">
                    {services.filter(s => s.status !== "Completed").length}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Subscription</CardDescription>
                  <CardTitle className="text-3xl">
                    {subscription?.plan || "None"}
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* Farms Section */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  My Farms
                </CardTitle>
                <CardDescription>
                  View your registered farms and fields
                </CardDescription>
              </CardHeader>
              <CardContent>
                {farms.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No farms registered yet. Contact us to register your farm.
                  </p>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {farms.map((farm) => (
                      <Card key={farm.id} className="bg-muted/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{farm.farm_name}</CardTitle>
                          <CardDescription>
                            {farm.location_description || "No location description"}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-1 text-sm">
                            <p>
                              <span className="text-muted-foreground">Area:</span>{" "}
                              <span className="font-medium">{farm.total_area_ha} ha</span>
                            </p>
                            <p>
                              <span className="text-muted-foreground">Crop:</span>{" "}
                              <span className="font-medium">{farm.crop_type || "N/A"}</span>
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Services Section */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Service History
                </CardTitle>
                <CardDescription>
                  Track your soil testing and mapping services
                </CardDescription>
              </CardHeader>
              <CardContent>
                {services.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No services yet. Request a service to get started.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                      >
                        <div>
                          <p className="font-medium">{service.service_type}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(service.created_at).toLocaleDateString()}
                            {service.area_covered_ha && ` • ${service.area_covered_ha} ha`}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              service.status === "Completed"
                                ? "bg-primary/10 text-primary"
                                : service.status === "InProgress"
                                ? "bg-accent/10 text-accent"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {service.status}
                          </span>
                          {service.status === "Completed" && (
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Subscription Section */}
            {subscription && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Subscription Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-lg">{subscription.plan} Plan</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Valid until {new Date(subscription.end_date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {subscription.status}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </main>
    </div>
  );
}