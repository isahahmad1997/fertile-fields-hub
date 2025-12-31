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
  FlaskConical,
  Map,
  Layers,
} from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type ClientData = Database["public"]["Tables"]["clients"]["Row"];
type Farm = Database["public"]["Tables"]["farms"]["Row"];
type Field = Database["public"]["Tables"]["fields"]["Row"];
type Service = Database["public"]["Tables"]["services"]["Row"];
type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];
type SoilSample = Database["public"]["Tables"]["soil_samples"]["Row"];
type GisOutput = Database["public"]["Tables"]["gis_outputs"]["Row"];

export default function ClientDashboard() {
  const navigate = useNavigate();
  const { user, loading, signOut, isAdmin } = useAuth();
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [soilSamples, setSoilSamples] = useState<SoilSample[]>([]);
  const [gisOutputs, setGisOutputs] = useState<GisOutput[]>([]);
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
      // Fetch client profile linked to user
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

        // Fetch fields for all farms
        if (farmsData && farmsData.length > 0) {
          const farmIds = farmsData.map(f => f.id);
          const { data: fieldsData } = await supabase
            .from("fields")
            .select("*")
            .in("farm_id", farmIds);

          setFields(fieldsData || []);

          // Fetch soil samples for all fields
          if (fieldsData && fieldsData.length > 0) {
            const fieldIds = fieldsData.map(f => f.id);
            const [soilRes, gisRes] = await Promise.all([
              supabase
                .from("soil_samples")
                .select("*")
                .in("field_id", fieldIds)
                .order("sampling_date", { ascending: false }),
              supabase
                .from("gis_outputs")
                .select("*")
                .in("field_id", fieldIds)
                .order("created_at", { ascending: false }),
            ]);

            setSoilSamples(soilRes.data || []);
            setGisOutputs(gisRes.data || []);
          }
        }

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

  const getFieldName = (fieldId: string) => {
    const field = fields.find(f => f.id === fieldId);
    if (!field) return "Unknown Field";
    const farm = farms.find(f => f.id === field.farm_id);
    return `${farm?.farm_name || "Unknown"} - ${field.field_name}`;
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
                    {farms.map((farm) => {
                      const farmFields = fields.filter(f => f.farm_id === farm.id);
                      return (
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
                              <p>
                                <span className="text-muted-foreground">Fields:</span>{" "}
                                <span className="font-medium">{farmFields.length}</span>
                              </p>
                            </div>
                            {farmFields.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-border">
                                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                                  <Layers className="w-3 h-3" /> Fields:
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {farmFields.map(field => (
                                    <span key={field.id} className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">
                                      {field.field_name} ({field.area_ha} ha)
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Soil Samples Section */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FlaskConical className="w-5 h-5" />
                  Soil Lab Results
                </CardTitle>
                <CardDescription>
                  View your soil sample analysis results
                </CardDescription>
              </CardHeader>
              <CardContent>
                {soilSamples.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No soil samples yet. Contact us to schedule soil testing.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium">Field</th>
                          <th className="text-left py-3 px-4 font-medium">Date</th>
                          <th className="text-left py-3 px-4 font-medium">pH</th>
                          <th className="text-left py-3 px-4 font-medium">N</th>
                          <th className="text-left py-3 px-4 font-medium">P</th>
                          <th className="text-left py-3 px-4 font-medium">K</th>
                          <th className="text-left py-3 px-4 font-medium">OM %</th>
                          <th className="text-left py-3 px-4 font-medium">Lab</th>
                        </tr>
                      </thead>
                      <tbody>
                        {soilSamples.map((sample) => (
                          <tr key={sample.id} className="border-b last:border-0">
                            <td className="py-3 px-4 text-sm">{getFieldName(sample.field_id)}</td>
                            <td className="py-3 px-4 text-sm">
                              {new Date(sample.sampling_date).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4 text-sm">{sample.ph ?? "-"}</td>
                            <td className="py-3 px-4 text-sm">{sample.nitrogen ?? "-"}</td>
                            <td className="py-3 px-4 text-sm">{sample.phosphorus ?? "-"}</td>
                            <td className="py-3 px-4 text-sm">{sample.potassium ?? "-"}</td>
                            <td className="py-3 px-4 text-sm">{sample.organic_matter ?? "-"}</td>
                            <td className="py-3 px-4 text-sm">{sample.lab_name || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* GIS Outputs Section */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Map className="w-5 h-5" />
                  GIS Maps & Outputs
                </CardTitle>
                <CardDescription>
                  View and download your field maps and analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                {gisOutputs.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No GIS outputs yet. These will appear after field mapping is complete.
                  </p>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {gisOutputs.map((output) => (
                      <Card key={output.id} className="bg-muted/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              output.map_type === "N" ? "bg-green-500/10 text-green-600" :
                              output.map_type === "P" ? "bg-blue-500/10 text-blue-600" :
                              output.map_type === "K" ? "bg-amber-500/10 text-amber-600" :
                              output.map_type === "pH" ? "bg-red-500/10 text-red-600" :
                              "bg-purple-500/10 text-purple-600"
                            }`}>
                              {output.map_type}
                            </span>
                          </CardTitle>
                          <CardDescription>
                            {getFieldName(output.field_id)}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            {output.season && (
                              <p>
                                <span className="text-muted-foreground">Season:</span>{" "}
                                <span className="font-medium">{output.season}</span>
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground">
                              Created: {new Date(output.created_at).toLocaleDateString()}
                            </p>
                            <Button variant="outline" size="sm" className="w-full mt-2" asChild>
                              <a href={output.file_url} target="_blank" rel="noopener noreferrer">
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </a>
                            </Button>
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
