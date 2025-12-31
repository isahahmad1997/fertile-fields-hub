import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  Users,
  MapPin,
  FileText,
  Plus,
  Home,
  Inbox,
  BarChart3,
  Edit,
  Link as LinkIcon,
  Upload,
  FlaskConical,
  Map,
} from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Client = Database["public"]["Tables"]["clients"]["Row"];
type Farm = Database["public"]["Tables"]["farms"]["Row"];
type ServiceRequest = Database["public"]["Tables"]["service_requests"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Field = Database["public"]["Tables"]["fields"]["Row"];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, loading, signOut, isAdmin } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  
  // Dialog states
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isAddFarmOpen, setIsAddFarmOpen] = useState(false);
  const [isEditClientOpen, setIsEditClientOpen] = useState(false);
  const [isUploadSoilOpen, setIsUploadSoilOpen] = useState(false);
  const [isUploadGisOpen, setIsUploadGisOpen] = useState(false);
  const [isAddFieldOpen, setIsAddFieldOpen] = useState(false);
  
  // Selected item for editing
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // New client form
  const [newClient, setNewClient] = useState({
    company_name: "",
    contact_person: "",
    email: "",
    phone: "",
    state: "",
    client_type: "Farmer" as "Farmer" | "FertilizerCompany" | "Dealer",
    user_id: "",
  });

  // New farm form
  const [newFarm, setNewFarm] = useState({
    client_id: "",
    farm_name: "",
    location_description: "",
    total_area_ha: "",
    crop_type: "",
  });

  // New field form
  const [newField, setNewField] = useState({
    farm_id: "",
    field_name: "",
    area_ha: "",
  });

  // Soil sample form
  const [soilSample, setSoilSample] = useState({
    field_id: "",
    sampling_date: "",
    ph: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    organic_matter: "",
    lab_name: "",
  });

  // GIS output form
  const [gisOutput, setGisOutput] = useState({
    field_id: "",
    map_type: "N" as "N" | "P" | "K" | "pH" | "VRA",
    season: "",
    file_url: "",
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
    if (!loading && user && !isAdmin) {
      navigate("/dashboard");
    }
  }, [user, loading, isAdmin, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchData();
    }
  }, [user, isAdmin]);

  const fetchData = async () => {
    try {
      const [clientsRes, farmsRes, fieldsRes, requestsRes, profilesRes] = await Promise.all([
        supabase.from("clients").select("*").order("created_at", { ascending: false }),
        supabase.from("farms").select("*").order("created_at", { ascending: false }),
        supabase.from("fields").select("*").order("created_at", { ascending: false }),
        supabase.from("service_requests").select("*").order("created_at", { ascending: false }),
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      ]);

      setClients(clientsRes.data || []);
      setFarms(farmsRes.data || []);
      setFields(fieldsRes.data || []);
      setServiceRequests(requestsRes.data || []);
      setProfiles(profilesRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const clientData = {
      ...newClient,
      user_id: newClient.user_id || null,
    };

    const { error } = await supabase.from("clients").insert([clientData]);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Client Added",
        description: "New client has been added successfully.",
      });
      setIsAddClientOpen(false);
      setNewClient({
        company_name: "",
        contact_person: "",
        email: "",
        phone: "",
        state: "",
        client_type: "Farmer",
        user_id: "",
      });
      fetchData();
    }
  };

  const handleEditClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;

    const { error } = await supabase
      .from("clients")
      .update({
        company_name: selectedClient.company_name,
        contact_person: selectedClient.contact_person,
        email: selectedClient.email,
        phone: selectedClient.phone,
        state: selectedClient.state,
        client_type: selectedClient.client_type,
        user_id: selectedClient.user_id || null,
        is_active: selectedClient.is_active,
      })
      .eq("id", selectedClient.id);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Client Updated",
        description: "Client has been updated successfully.",
      });
      setIsEditClientOpen(false);
      setSelectedClient(null);
      fetchData();
    }
  };

  const handleAddFarm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase.from("farms").insert([{
      ...newFarm,
      total_area_ha: parseFloat(newFarm.total_area_ha),
    }]);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Farm Added",
        description: "New farm has been added successfully.",
      });
      setIsAddFarmOpen(false);
      setNewFarm({
        client_id: "",
        farm_name: "",
        location_description: "",
        total_area_ha: "",
        crop_type: "",
      });
      fetchData();
    }
  };

  const handleAddField = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase.from("fields").insert([{
      farm_id: newField.farm_id,
      field_name: newField.field_name,
      area_ha: parseFloat(newField.area_ha),
    }]);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Field Added",
        description: "New field has been added successfully.",
      });
      setIsAddFieldOpen(false);
      setNewField({ farm_id: "", field_name: "", area_ha: "" });
      fetchData();
    }
  };

  const handleUploadSoilSample = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase.from("soil_samples").insert([{
      field_id: soilSample.field_id,
      sampling_date: soilSample.sampling_date,
      ph: soilSample.ph ? parseFloat(soilSample.ph) : null,
      nitrogen: soilSample.nitrogen ? parseFloat(soilSample.nitrogen) : null,
      phosphorus: soilSample.phosphorus ? parseFloat(soilSample.phosphorus) : null,
      potassium: soilSample.potassium ? parseFloat(soilSample.potassium) : null,
      organic_matter: soilSample.organic_matter ? parseFloat(soilSample.organic_matter) : null,
      lab_name: soilSample.lab_name || null,
    }]);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Soil Sample Added",
        description: "Soil sample data has been uploaded successfully.",
      });
      setIsUploadSoilOpen(false);
      setSoilSample({
        field_id: "",
        sampling_date: "",
        ph: "",
        nitrogen: "",
        phosphorus: "",
        potassium: "",
        organic_matter: "",
        lab_name: "",
      });
    }
  };

  const handleUploadGisOutput = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase.from("gis_outputs").insert([{
      field_id: gisOutput.field_id,
      map_type: gisOutput.map_type,
      season: gisOutput.season || null,
      file_url: gisOutput.file_url,
    }]);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "GIS Output Added",
        description: "GIS output has been uploaded successfully.",
      });
      setIsUploadGisOpen(false);
      setGisOutput({
        field_id: "",
        map_type: "N",
        season: "",
        file_url: "",
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const openEditClient = (client: Client) => {
    setSelectedClient(client);
    setIsEditClientOpen(true);
  };

  const getLinkedUserEmail = (userId: string | null) => {
    if (!userId) return null;
    const profile = profiles.find(p => p.id === userId);
    return profile?.email || null;
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const totalHectares = farms.reduce((sum, farm) => sum + Number(farm.total_area_ha), 0);
  const newRequests = serviceRequests.filter(r => r.status === "new").length;

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
                GeoSoilLab Admin
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-2xl lg:text-3xl font-bold text-foreground mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage clients, farms, and service requests
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Clients</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Users className="w-6 h-6 text-primary" />
                {clients.length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Farms</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                <MapPin className="w-6 h-6 text-primary" />
                {farms.length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Hectares</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-primary" />
                {totalHectares.toFixed(0)}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>New Requests</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Inbox className="w-6 h-6 text-accent" />
                {newRequests}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="clients" className="space-y-6">
          <TabsList>
            <TabsTrigger value="clients">Clients</TabsTrigger>
            <TabsTrigger value="farms">Farms</TabsTrigger>
            <TabsTrigger value="uploads">Data Uploads</TabsTrigger>
            <TabsTrigger value="requests">Service Requests</TabsTrigger>
          </TabsList>

          {/* Clients Tab */}
          <TabsContent value="clients">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Clients</CardTitle>
                  <CardDescription>Manage your client database</CardDescription>
                </div>
                <Dialog open={isAddClientOpen} onOpenChange={setIsAddClientOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Client
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Add New Client</DialogTitle>
                      <DialogDescription>
                        Enter the client details below
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddClient} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Company Name</Label>
                          <Input
                            value={newClient.company_name}
                            onChange={(e) =>
                              setNewClient({ ...newClient, company_name: e.target.value })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Contact Person</Label>
                          <Input
                            value={newClient.contact_person}
                            onChange={(e) =>
                              setNewClient({ ...newClient, contact_person: e.target.value })
                            }
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input
                            type="email"
                            value={newClient.email}
                            onChange={(e) =>
                              setNewClient({ ...newClient, email: e.target.value })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Phone</Label>
                          <Input
                            value={newClient.phone}
                            onChange={(e) =>
                              setNewClient({ ...newClient, phone: e.target.value })
                            }
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>State</Label>
                          <Input
                            value={newClient.state}
                            onChange={(e) =>
                              setNewClient({ ...newClient, state: e.target.value })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Client Type</Label>
                          <Select
                            value={newClient.client_type}
                            onValueChange={(value: "Farmer" | "FertilizerCompany" | "Dealer") =>
                              setNewClient({ ...newClient, client_type: value })
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
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <LinkIcon className="w-4 h-4" />
                          Link to User Account (Optional)
                        </Label>
                        <Select
                          value={newClient.user_id}
                          onValueChange={(value) =>
                            setNewClient({ ...newClient, user_id: value === "none" ? "" : value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select user to link" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No user linked</SelectItem>
                            {profiles.map((profile) => (
                              <SelectItem key={profile.id} value={profile.id}>
                                {profile.email} ({profile.full_name || "No name"})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          Linking allows this user to access their client dashboard
                        </p>
                      </div>
                      <Button type="submit" className="w-full">
                        Add Client
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {clients.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No clients yet. Add your first client.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium">Company</th>
                          <th className="text-left py-3 px-4 font-medium">Contact</th>
                          <th className="text-left py-3 px-4 font-medium">Email</th>
                          <th className="text-left py-3 px-4 font-medium">State</th>
                          <th className="text-left py-3 px-4 font-medium">Type</th>
                          <th className="text-left py-3 px-4 font-medium">Linked User</th>
                          <th className="text-left py-3 px-4 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clients.map((client) => (
                          <tr key={client.id} className="border-b last:border-0">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                {client.company_name}
                                {!client.is_active && (
                                  <span className="text-xs px-2 py-0.5 rounded bg-destructive/10 text-destructive">
                                    Inactive
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4">{client.contact_person}</td>
                            <td className="py-3 px-4">{client.email}</td>
                            <td className="py-3 px-4">{client.state}</td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                                {client.client_type}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              {client.user_id ? (
                                <span className="flex items-center gap-1 text-xs text-primary">
                                  <LinkIcon className="w-3 h-3" />
                                  {getLinkedUserEmail(client.user_id)}
                                </span>
                              ) : (
                                <span className="text-xs text-muted-foreground">Not linked</span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditClient(client)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Edit Client Dialog */}
          <Dialog open={isEditClientOpen} onOpenChange={setIsEditClientOpen}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Edit Client</DialogTitle>
                <DialogDescription>
                  Update client details and user linking
                </DialogDescription>
              </DialogHeader>
              {selectedClient && (
                <form onSubmit={handleEditClient} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Company Name</Label>
                      <Input
                        value={selectedClient.company_name}
                        onChange={(e) =>
                          setSelectedClient({ ...selectedClient, company_name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Contact Person</Label>
                      <Input
                        value={selectedClient.contact_person}
                        onChange={(e) =>
                          setSelectedClient({ ...selectedClient, contact_person: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={selectedClient.email}
                        onChange={(e) =>
                          setSelectedClient({ ...selectedClient, email: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input
                        value={selectedClient.phone}
                        onChange={(e) =>
                          setSelectedClient({ ...selectedClient, phone: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>State</Label>
                      <Input
                        value={selectedClient.state}
                        onChange={(e) =>
                          setSelectedClient({ ...selectedClient, state: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Client Type</Label>
                      <Select
                        value={selectedClient.client_type}
                        onValueChange={(value: "Farmer" | "FertilizerCompany" | "Dealer") =>
                          setSelectedClient({ ...selectedClient, client_type: value })
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
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <LinkIcon className="w-4 h-4" />
                      Link to User Account
                    </Label>
                    <Select
                      value={selectedClient.user_id || "none"}
                      onValueChange={(value) =>
                        setSelectedClient({ ...selectedClient, user_id: value === "none" ? null : value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select user to link" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No user linked</SelectItem>
                        {profiles.map((profile) => (
                          <SelectItem key={profile.id} value={profile.id}>
                            {profile.email} ({profile.full_name || "No name"})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={selectedClient.is_active}
                      onChange={(e) =>
                        setSelectedClient({ ...selectedClient, is_active: e.target.checked })
                      }
                      className="rounded border-border"
                    />
                    <Label htmlFor="is_active">Client is active</Label>
                  </div>
                  <Button type="submit" className="w-full">
                    Save Changes
                  </Button>
                </form>
              )}
            </DialogContent>
          </Dialog>

          {/* Farms Tab */}
          <TabsContent value="farms">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Farms</CardTitle>
                  <CardDescription>Manage registered farms</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Dialog open={isAddFieldOpen} onOpenChange={setIsAddFieldOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Field
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Field</DialogTitle>
                        <DialogDescription>
                          Add a field to an existing farm
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleAddField} className="space-y-4">
                        <div className="space-y-2">
                          <Label>Farm</Label>
                          <Select
                            value={newField.farm_id}
                            onValueChange={(value) =>
                              setNewField({ ...newField, farm_id: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select farm" />
                            </SelectTrigger>
                            <SelectContent>
                              {farms.map((farm) => (
                                <SelectItem key={farm.id} value={farm.id}>
                                  {farm.farm_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Field Name</Label>
                          <Input
                            value={newField.field_name}
                            onChange={(e) =>
                              setNewField({ ...newField, field_name: e.target.value })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Area (ha)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={newField.area_ha}
                            onChange={(e) =>
                              setNewField({ ...newField, area_ha: e.target.value })
                            }
                            required
                          />
                        </div>
                        <Button type="submit" className="w-full">
                          Add Field
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Dialog open={isAddFarmOpen} onOpenChange={setIsAddFarmOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Farm
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Farm</DialogTitle>
                        <DialogDescription>
                          Enter the farm details below
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleAddFarm} className="space-y-4">
                        <div className="space-y-2">
                          <Label>Client</Label>
                          <Select
                            value={newFarm.client_id}
                            onValueChange={(value) =>
                              setNewFarm({ ...newFarm, client_id: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select client" />
                            </SelectTrigger>
                            <SelectContent>
                              {clients.map((client) => (
                                <SelectItem key={client.id} value={client.id}>
                                  {client.company_name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Farm Name</Label>
                          <Input
                            value={newFarm.farm_name}
                            onChange={(e) =>
                              setNewFarm({ ...newFarm, farm_name: e.target.value })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Location Description</Label>
                          <Input
                            value={newFarm.location_description}
                            onChange={(e) =>
                              setNewFarm({ ...newFarm, location_description: e.target.value })
                            }
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Total Area (ha)</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={newFarm.total_area_ha}
                              onChange={(e) =>
                                setNewFarm({ ...newFarm, total_area_ha: e.target.value })
                              }
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Crop Type</Label>
                            <Input
                              value={newFarm.crop_type}
                              onChange={(e) =>
                                setNewFarm({ ...newFarm, crop_type: e.target.value })
                              }
                            />
                          </div>
                        </div>
                        <Button type="submit" className="w-full">
                          Add Farm
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {farms.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No farms yet. Add your first farm.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium">Farm Name</th>
                          <th className="text-left py-3 px-4 font-medium">Client</th>
                          <th className="text-left py-3 px-4 font-medium">Location</th>
                          <th className="text-left py-3 px-4 font-medium">Area (ha)</th>
                          <th className="text-left py-3 px-4 font-medium">Crop</th>
                          <th className="text-left py-3 px-4 font-medium">Fields</th>
                        </tr>
                      </thead>
                      <tbody>
                        {farms.map((farm) => {
                          const client = clients.find(c => c.id === farm.client_id);
                          const farmFields = fields.filter(f => f.farm_id === farm.id);
                          return (
                            <tr key={farm.id} className="border-b last:border-0">
                              <td className="py-3 px-4">{farm.farm_name}</td>
                              <td className="py-3 px-4">{client?.company_name || "-"}</td>
                              <td className="py-3 px-4">{farm.location_description || "-"}</td>
                              <td className="py-3 px-4">{farm.total_area_ha}</td>
                              <td className="py-3 px-4">{farm.crop_type || "-"}</td>
                              <td className="py-3 px-4">{farmFields.length}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Uploads Tab */}
          <TabsContent value="uploads">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Soil Samples Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FlaskConical className="w-5 h-5" />
                    Soil Lab Results
                  </CardTitle>
                  <CardDescription>
                    Upload soil sample data for client fields
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Dialog open={isUploadSoilOpen} onOpenChange={setIsUploadSoilOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Soil Sample
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Upload Soil Sample Data</DialogTitle>
                        <DialogDescription>
                          Enter lab results for a specific field
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleUploadSoilSample} className="space-y-4">
                        <div className="space-y-2">
                          <Label>Field</Label>
                          <Select
                            value={soilSample.field_id}
                            onValueChange={(value) =>
                              setSoilSample({ ...soilSample, field_id: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select field" />
                            </SelectTrigger>
                            <SelectContent>
                              {fields.map((field) => {
                                const farm = farms.find(f => f.id === field.farm_id);
                                return (
                                  <SelectItem key={field.id} value={field.id}>
                                    {farm?.farm_name} - {field.field_name}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Sampling Date</Label>
                            <Input
                              type="date"
                              value={soilSample.sampling_date}
                              onChange={(e) =>
                                setSoilSample({ ...soilSample, sampling_date: e.target.value })
                              }
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Lab Name</Label>
                            <Input
                              value={soilSample.lab_name}
                              onChange={(e) =>
                                setSoilSample({ ...soilSample, lab_name: e.target.value })
                              }
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>pH</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={soilSample.ph}
                              onChange={(e) =>
                                setSoilSample({ ...soilSample, ph: e.target.value })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Organic Matter (%)</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={soilSample.organic_matter}
                              onChange={(e) =>
                                setSoilSample({ ...soilSample, organic_matter: e.target.value })
                              }
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Nitrogen (ppm)</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={soilSample.nitrogen}
                              onChange={(e) =>
                                setSoilSample({ ...soilSample, nitrogen: e.target.value })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Phosphorus (ppm)</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={soilSample.phosphorus}
                              onChange={(e) =>
                                setSoilSample({ ...soilSample, phosphorus: e.target.value })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Potassium (ppm)</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={soilSample.potassium}
                              onChange={(e) =>
                                setSoilSample({ ...soilSample, potassium: e.target.value })
                              }
                            />
                          </div>
                        </div>
                        <Button type="submit" className="w-full">
                          Upload Soil Sample
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>

              {/* GIS Outputs Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Map className="w-5 h-5" />
                    GIS Outputs
                  </CardTitle>
                  <CardDescription>
                    Upload maps and GIS data for client fields
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Dialog open={isUploadGisOpen} onOpenChange={setIsUploadGisOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload GIS Output
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Upload GIS Output</DialogTitle>
                        <DialogDescription>
                          Add a map or GIS output for a field
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleUploadGisOutput} className="space-y-4">
                        <div className="space-y-2">
                          <Label>Field</Label>
                          <Select
                            value={gisOutput.field_id}
                            onValueChange={(value) =>
                              setGisOutput({ ...gisOutput, field_id: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select field" />
                            </SelectTrigger>
                            <SelectContent>
                              {fields.map((field) => {
                                const farm = farms.find(f => f.id === field.farm_id);
                                return (
                                  <SelectItem key={field.id} value={field.id}>
                                    {farm?.farm_name} - {field.field_name}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                          <Label>Map Type</Label>
                            <Select
                              value={gisOutput.map_type}
                              onValueChange={(value: "N" | "P" | "K" | "pH" | "VRA") =>
                                setGisOutput({ ...gisOutput, map_type: value })
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
                                <SelectItem value="VRA">VRA</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Season</Label>
                            <Input
                              value={gisOutput.season}
                              onChange={(e) =>
                                setGisOutput({ ...gisOutput, season: e.target.value })
                              }
                              placeholder="e.g., 2024 Spring"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>File URL</Label>
                          <Input
                            value={gisOutput.file_url}
                            onChange={(e) =>
                              setGisOutput({ ...gisOutput, file_url: e.target.value })
                            }
                            placeholder="https://..."
                            required
                          />
                        </div>
                        <Button type="submit" className="w-full">
                          Upload GIS Output
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Service Requests Tab */}
          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle>Service Requests</CardTitle>
                <CardDescription>Review incoming service requests from the website</CardDescription>
              </CardHeader>
              <CardContent>
                {serviceRequests.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No service requests yet.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {serviceRequests.map((request) => (
                      <div
                        key={request.id}
                        className="p-4 rounded-lg bg-muted/50 border border-border"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium">{request.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {request.company_name || "Individual"}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              request.status === "new"
                                ? "bg-accent/10 text-accent"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {request.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                          <p>
                            <span className="text-muted-foreground">Email:</span> {request.email}
                          </p>
                          <p>
                            <span className="text-muted-foreground">Phone:</span> {request.phone}
                          </p>
                          <p>
                            <span className="text-muted-foreground">State:</span> {request.state}
                          </p>
                          <p>
                            <span className="text-muted-foreground">Farm Size:</span>{" "}
                            {request.farm_size_ha ? `${request.farm_size_ha} ha` : "N/A"}
                          </p>
                        </div>
                        {request.message && (
                          <p className="mt-2 text-sm text-muted-foreground">
                            {request.message}
                          </p>
                        )}
                        <p className="mt-2 text-xs text-muted-foreground">
                          Received: {new Date(request.created_at).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
