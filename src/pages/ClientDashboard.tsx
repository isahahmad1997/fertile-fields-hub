import { useEffect, useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { getSafeErrorMessage } from "@/lib/error-handler";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
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
  Edit,
  Shield,
  ChevronDown,
  Trash2,
  Plus,
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
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, loading, signOut, isAdmin } = useAuth();
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [soilSamples, setSoilSamples] = useState<SoilSample[]>([]);
  const [gisOutputs, setGisOutputs] = useState<GisOutput[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  
  // Admin-specific state
  const [allClients, setAllClients] = useState<ClientData[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [isEditClientOpen, setIsEditClientOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientData | null>(null);
  
  // Edit dialogs state
  const [isEditSoilSampleOpen, setIsEditSoilSampleOpen] = useState(false);
  const [editingSoilSample, setEditingSoilSample] = useState<SoilSample | null>(null);
  const [isEditGisOutputOpen, setIsEditGisOutputOpen] = useState(false);
  const [editingGisOutput, setEditingGisOutput] = useState<GisOutput | null>(null);
  const [isEditServiceOpen, setIsEditServiceOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Get client_id from URL if admin is viewing a specific client
  const viewingClientId = searchParams.get("client_id");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  // Fetch all clients for admin selector
  useEffect(() => {
    if (user && isAdmin) {
      fetchAllClients();
    }
  }, [user, isAdmin]);

  useEffect(() => {
    if (user) {
      if (isAdmin && viewingClientId) {
        fetchClientDataById(viewingClientId);
      } else if (isAdmin && !viewingClientId) {
        // Admin viewing without specific client - show client selector
        setLoadingData(false);
      } else {
        fetchClientData();
      }
    }
  }, [user, isAdmin, viewingClientId]);

  const fetchAllClients = async () => {
    try {
      const { data } = await supabase
        .from("clients")
        .select("*")
        .order("company_name", { ascending: true });
      setAllClients(data || []);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const fetchClientDataById = async (clientId: string) => {
    try {
      const { data: client } = await supabase
        .from("clients")
        .select("*")
        .eq("id", clientId)
        .maybeSingle();

      if (client) {
        setClientData(client);
        await fetchRelatedData(client.id);
      }
    } catch (error) {
      console.error("Error fetching client data:", error);
    } finally {
      setLoadingData(false);
    }
  };

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
        await fetchRelatedData(client.id);
      }
    } catch (error) {
      console.error("Error fetching client data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const fetchRelatedData = async (clientId: string) => {
    // Fetch farms
    const { data: farmsData } = await supabase
      .from("farms")
      .select("*")
      .eq("client_id", clientId);

    setFarms(farmsData || []);

    // Fetch fields for all farms
    if (farmsData && farmsData.length > 0) {
      const farmIds = farmsData.map(f => f.id);
      const { data: fieldsData } = await supabase
        .from("fields")
        .select("*")
        .in("farm_id", farmIds);

      setFields(fieldsData || []);

      // Fetch soil samples and GIS outputs for all fields
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
      .eq("client_id", clientId)
      .order("created_at", { ascending: false });

    setServices(servicesData || []);

    // Fetch subscription
    const { data: subData } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("client_id", clientId)
      .eq("status", "Active")
      .maybeSingle();

    setSubscription(subData);
  };

  const handleEditClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient) return;

    const { error } = await supabase
      .from("clients")
      .update({
        company_name: editingClient.company_name,
        contact_person: editingClient.contact_person,
        email: editingClient.email,
        phone: editingClient.phone,
        state: editingClient.state,
        client_type: editingClient.client_type,
        is_active: editingClient.is_active,
      })
      .eq("id", editingClient.id);

    if (error) {
      toast({
        title: "Error",
        description: getSafeErrorMessage(error),
        variant: "destructive",
      });
    } else {
      toast({
        title: "Client Updated",
        description: "Client has been updated successfully.",
      });
      setIsEditClientOpen(false);
      setClientData(editingClient);
      setEditingClient(null);
    }
  };

  // Handle edit soil sample
  const handleEditSoilSample = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSoilSample) return;

    const { error } = await supabase
      .from("soil_samples")
      .update({
        sampling_date: editingSoilSample.sampling_date,
        ph: editingSoilSample.ph,
        nitrogen: editingSoilSample.nitrogen,
        phosphorus: editingSoilSample.phosphorus,
        potassium: editingSoilSample.potassium,
        organic_matter: editingSoilSample.organic_matter,
        lab_name: editingSoilSample.lab_name,
      })
      .eq("id", editingSoilSample.id);

    if (error) {
      toast({ title: "Error", description: getSafeErrorMessage(error), variant: "destructive" });
    } else {
      toast({ title: "Soil Sample Updated", description: "Soil sample has been updated successfully." });
      setIsEditSoilSampleOpen(false);
      setSoilSamples(prev => prev.map(s => s.id === editingSoilSample.id ? editingSoilSample : s));
      setEditingSoilSample(null);
    }
  };

  const handleDeleteSoilSample = async (sampleId: string) => {
    if (!confirm("Are you sure you want to delete this soil sample?")) return;

    const { error } = await supabase.from("soil_samples").delete().eq("id", sampleId);
    if (error) {
      toast({ title: "Error", description: getSafeErrorMessage(error), variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Soil sample has been deleted." });
      setSoilSamples(prev => prev.filter(s => s.id !== sampleId));
    }
  };

  // Handle edit GIS output
  const handleEditGisOutput = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGisOutput) return;

    const { error } = await supabase
      .from("gis_outputs")
      .update({
        map_type: editingGisOutput.map_type,
        season: editingGisOutput.season,
      })
      .eq("id", editingGisOutput.id);

    if (error) {
      toast({ title: "Error", description: getSafeErrorMessage(error), variant: "destructive" });
    } else {
      toast({ title: "GIS Output Updated", description: "GIS output has been updated successfully." });
      setIsEditGisOutputOpen(false);
      setGisOutputs(prev => prev.map(g => g.id === editingGisOutput.id ? editingGisOutput : g));
      setEditingGisOutput(null);
    }
  };

  const handleDeleteGisOutput = async (output: GisOutput) => {
    if (!confirm("Are you sure you want to delete this GIS output?")) return;

    // Delete file from storage if it's a storage path
    if (output.file_url.startsWith('gis-outputs/')) {
      const filePath = output.file_url.replace('gis-outputs/', '');
      await supabase.storage.from('gis-outputs').remove([filePath]);
    }

    const { error } = await supabase.from("gis_outputs").delete().eq("id", output.id);
    if (error) {
      toast({ title: "Error", description: getSafeErrorMessage(error), variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "GIS output has been deleted." });
      setGisOutputs(prev => prev.filter(g => g.id !== output.id));
    }
  };

  // Handle edit service
  const handleEditService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    const { error } = await supabase
      .from("services")
      .update({
        service_type: editingService.service_type,
        status: editingService.status,
        area_covered_ha: editingService.area_covered_ha,
        cost: editingService.cost,
      })
      .eq("id", editingService.id);

    if (error) {
      toast({ title: "Error", description: getSafeErrorMessage(error), variant: "destructive" });
    } else {
      toast({ title: "Service Updated", description: "Service has been updated successfully." });
      setIsEditServiceOpen(false);
      setServices(prev => prev.map(s => s.id === editingService.id ? editingService : s));
      setEditingService(null);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    const { error } = await supabase.from("services").delete().eq("id", serviceId);
    if (error) {
      toast({ title: "Error", description: getSafeErrorMessage(error), variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Service has been deleted." });
      setServices(prev => prev.filter(s => s.id !== serviceId));
    }
  };

  const handleSelectClient = (clientId: string) => {
    setSelectedClientId(clientId);
    setSearchParams({ client_id: clientId });
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

  const handleDownloadGisOutput = async (fileUrl: string, mapType: string) => {
    try {
      // Check if it's a storage path (new format) or a direct URL (legacy)
      if (fileUrl.startsWith('gis-outputs/')) {
        // Extract the path after 'gis-outputs/'
        const filePath = fileUrl.replace('gis-outputs/', '');
        
        // Create a signed URL that expires in 1 hour
        const { data, error } = await supabase.storage
          .from('gis-outputs')
          .createSignedUrl(filePath, 3600);
        
        if (error) {
          console.error("Error creating signed URL:", error);
          return;
        }
        
        if (data?.signedUrl) {
          window.open(data.signedUrl, '_blank');
        }
      } else {
        // Legacy: direct URL
        window.open(fileUrl, '_blank');
      }
    } catch (error) {
      console.error("Error downloading file:", error);
    }
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
              {isAdmin && (
                <Button variant="outline" size="sm" asChild>
                  <Link to="/admin">
                    <Shield className="w-4 h-4 mr-2" />
                    Admin Panel
                  </Link>
                </Button>
              )}
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
        {/* Admin Client Selector */}
        {isAdmin && !viewingClientId && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Admin View - Select a Client
              </CardTitle>
              <CardDescription>
                Select a client to view and manage their dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-w-md">
                <Select onValueChange={handleSelectClient}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a client..." />
                  </SelectTrigger>
                  <SelectContent>
                    {allClients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.company_name} - {client.contact_person}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Admin indicator when viewing specific client */}
        {isAdmin && viewingClientId && clientData && (
          <div className="mb-4 flex items-center gap-2 text-sm">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Admin viewing:</span>
            <span className="font-medium">{clientData.company_name}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSearchParams({})}
              className="ml-2"
            >
              ← Back to client list
            </Button>
          </div>
        )}

        {/* Welcome */}
        {(clientData || (!isAdmin && !viewingClientId)) && (
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="font-serif text-2xl lg:text-3xl font-bold text-foreground mb-2">
                {isAdmin && clientData ? `${clientData.contact_person}'s Dashboard` : `Welcome, ${clientData?.contact_person || user?.email}`}
              </h1>
              <p className="text-muted-foreground">
                {clientData ? clientData.company_name : "Manage your farms and view your soil data"}
              </p>
            </div>
            {isAdmin && clientData && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setEditingClient(clientData);
                  setIsEditClientOpen(true);
                }}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Client
              </Button>
            )}
          </div>
        )}

        {!clientData && !isAdmin ? (
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
        ) : clientData ? (
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
                          {isAdmin && <th className="text-left py-3 px-4 font-medium">Actions</th>}
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
                            {isAdmin && (
                              <td className="py-3 px-4 text-sm">
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setEditingSoilSample(sample);
                                      setIsEditSoilSampleOpen(true);
                                    }}
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteSoilSample(sample.id)}
                                    className="text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </td>
                            )}
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
                          <div className="flex items-center justify-between">
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
                            {isAdmin && (
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setEditingGisOutput(output);
                                    setIsEditGisOutputOpen(true);
                                  }}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteGisOutput(output)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </div>
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
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full mt-2"
                              onClick={() => handleDownloadGisOutput(output.file_url, output.map_type)}
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download
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
                            {service.cost && ` • ₦${Number(service.cost).toLocaleString()}`}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
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
                          {isAdmin && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditingService(service);
                                  setIsEditServiceOpen(true);
                                }}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteService(service.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </>
                          )}
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
        ) : null}

        {/* Edit Client Dialog */}
        <Dialog open={isEditClientOpen} onOpenChange={setIsEditClientOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Client</DialogTitle>
              <DialogDescription>
                Update client information
              </DialogDescription>
            </DialogHeader>
            {editingClient && (
              <form onSubmit={handleEditClient} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-company">Company Name</Label>
                    <Input
                      id="edit-company"
                      value={editingClient.company_name}
                      onChange={(e) =>
                        setEditingClient({ ...editingClient, company_name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-contact">Contact Person</Label>
                    <Input
                      id="edit-contact"
                      value={editingClient.contact_person}
                      onChange={(e) =>
                        setEditingClient({ ...editingClient, contact_person: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-email">Email</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={editingClient.email}
                      onChange={(e) =>
                        setEditingClient({ ...editingClient, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-phone">Phone</Label>
                    <Input
                      id="edit-phone"
                      value={editingClient.phone}
                      onChange={(e) =>
                        setEditingClient({ ...editingClient, phone: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-state">State</Label>
                    <Input
                      id="edit-state"
                      value={editingClient.state}
                      onChange={(e) =>
                        setEditingClient({ ...editingClient, state: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-type">Client Type</Label>
                    <Select
                      value={editingClient.client_type}
                      onValueChange={(value: "Farmer" | "FertilizerCompany" | "Dealer") =>
                        setEditingClient({ ...editingClient, client_type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Farmer">Farmer</SelectItem>
                        <SelectItem value="FertilizerCompany">Fertilizer Company</SelectItem>
                        <SelectItem value="Dealer">Dealer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="edit-active"
                    checked={editingClient.is_active}
                    onChange={(e) =>
                      setEditingClient({ ...editingClient, is_active: e.target.checked })
                    }
                    className="h-4 w-4"
                  />
                  <Label htmlFor="edit-active">Active</Label>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditClientOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Soil Sample Dialog */}
        <Dialog open={isEditSoilSampleOpen} onOpenChange={setIsEditSoilSampleOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Soil Sample</DialogTitle>
              <DialogDescription>
                Update soil lab results
              </DialogDescription>
            </DialogHeader>
            {editingSoilSample && (
              <form onSubmit={handleEditSoilSample} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-sample-date">Sampling Date</Label>
                    <Input
                      id="edit-sample-date"
                      type="date"
                      value={editingSoilSample.sampling_date}
                      onChange={(e) =>
                        setEditingSoilSample({ ...editingSoilSample, sampling_date: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-sample-lab">Lab Name</Label>
                    <Input
                      id="edit-sample-lab"
                      value={editingSoilSample.lab_name || ""}
                      onChange={(e) =>
                        setEditingSoilSample({ ...editingSoilSample, lab_name: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-sample-ph">pH</Label>
                    <Input
                      id="edit-sample-ph"
                      type="number"
                      step="0.1"
                      value={editingSoilSample.ph ?? ""}
                      onChange={(e) =>
                        setEditingSoilSample({ ...editingSoilSample, ph: e.target.value ? parseFloat(e.target.value) : null })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-sample-n">Nitrogen (N)</Label>
                    <Input
                      id="edit-sample-n"
                      type="number"
                      step="0.1"
                      value={editingSoilSample.nitrogen ?? ""}
                      onChange={(e) =>
                        setEditingSoilSample({ ...editingSoilSample, nitrogen: e.target.value ? parseFloat(e.target.value) : null })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-sample-p">Phosphorus (P)</Label>
                    <Input
                      id="edit-sample-p"
                      type="number"
                      step="0.1"
                      value={editingSoilSample.phosphorus ?? ""}
                      onChange={(e) =>
                        setEditingSoilSample({ ...editingSoilSample, phosphorus: e.target.value ? parseFloat(e.target.value) : null })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-sample-k">Potassium (K)</Label>
                    <Input
                      id="edit-sample-k"
                      type="number"
                      step="0.1"
                      value={editingSoilSample.potassium ?? ""}
                      onChange={(e) =>
                        setEditingSoilSample({ ...editingSoilSample, potassium: e.target.value ? parseFloat(e.target.value) : null })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-sample-om">Organic Matter (%)</Label>
                    <Input
                      id="edit-sample-om"
                      type="number"
                      step="0.1"
                      value={editingSoilSample.organic_matter ?? ""}
                      onChange={(e) =>
                        setEditingSoilSample({ ...editingSoilSample, organic_matter: e.target.value ? parseFloat(e.target.value) : null })
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsEditSoilSampleOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit GIS Output Dialog */}
        <Dialog open={isEditGisOutputOpen} onOpenChange={setIsEditGisOutputOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit GIS Output</DialogTitle>
              <DialogDescription>
                Update map details
              </DialogDescription>
            </DialogHeader>
            {editingGisOutput && (
              <form onSubmit={handleEditGisOutput} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-gis-type">Map Type</Label>
                  <Select
                    value={editingGisOutput.map_type}
                    onValueChange={(value: "N" | "P" | "K" | "pH" | "VRA") =>
                      setEditingGisOutput({ ...editingGisOutput, map_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="N">Nitrogen (N)</SelectItem>
                      <SelectItem value="P">Phosphorus (P)</SelectItem>
                      <SelectItem value="K">Potassium (K)</SelectItem>
                      <SelectItem value="pH">pH</SelectItem>
                      <SelectItem value="VRA">Variable Rate Application (VRA)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-gis-season">Season</Label>
                  <Input
                    id="edit-gis-season"
                    value={editingGisOutput.season || ""}
                    onChange={(e) =>
                      setEditingGisOutput({ ...editingGisOutput, season: e.target.value || null })
                    }
                    placeholder="e.g., 2025"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsEditGisOutputOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Service Dialog */}
        <Dialog open={isEditServiceOpen} onOpenChange={setIsEditServiceOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Service</DialogTitle>
              <DialogDescription>
                Update service details
              </DialogDescription>
            </DialogHeader>
            {editingService && (
              <form onSubmit={handleEditService} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-service-type">Service Type</Label>
                  <Input
                    id="edit-service-type"
                    value={editingService.service_type}
                    onChange={(e) =>
                      setEditingService({ ...editingService, service_type: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-service-status">Status</Label>
                  <Select
                    value={editingService.status}
                    onValueChange={(value: "Pending" | "InProgress" | "Completed") =>
                      setEditingService({ ...editingService, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="InProgress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-service-area">Area (ha)</Label>
                    <Input
                      id="edit-service-area"
                      type="number"
                      step="0.1"
                      value={editingService.area_covered_ha ?? ""}
                      onChange={(e) =>
                        setEditingService({ ...editingService, area_covered_ha: e.target.value ? parseFloat(e.target.value) : null })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-service-cost">Cost (₦)</Label>
                    <Input
                      id="edit-service-cost"
                      type="number"
                      step="0.01"
                      value={editingService.cost ?? ""}
                      onChange={(e) =>
                        setEditingService({ ...editingService, cost: e.target.value ? parseFloat(e.target.value) : null })
                      }
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsEditServiceOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
