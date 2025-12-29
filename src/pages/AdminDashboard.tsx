import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Client = Database["public"]["Tables"]["clients"]["Row"];
type Farm = Database["public"]["Tables"]["farms"]["Row"];
type ServiceRequest = Database["public"]["Tables"]["service_requests"]["Row"];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, loading, signOut, isAdmin } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isAddFarmOpen, setIsAddFarmOpen] = useState(false);

  // New client form
  const [newClient, setNewClient] = useState({
    company_name: "",
    contact_person: "",
    email: "",
    phone: "",
    state: "",
    client_type: "Farmer" as "Farmer" | "FertilizerCompany" | "Dealer",
  });

  // New farm form
  const [newFarm, setNewFarm] = useState({
    client_id: "",
    farm_name: "",
    location_description: "",
    total_area_ha: "",
    crop_type: "",
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
      const [clientsRes, farmsRes, requestsRes] = await Promise.all([
        supabase.from("clients").select("*").order("created_at", { ascending: false }),
        supabase.from("farms").select("*").order("created_at", { ascending: false }),
        supabase.from("service_requests").select("*").order("created_at", { ascending: false }),
      ]);

      setClients(clientsRes.data || []);
      setFarms(farmsRes.data || []);
      setServiceRequests(requestsRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase.from("clients").insert([newClient]);

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
      });
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
                  <DialogContent>
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
                        </tr>
                      </thead>
                      <tbody>
                        {clients.map((client) => (
                          <tr key={client.id} className="border-b last:border-0">
                            <td className="py-3 px-4">{client.company_name}</td>
                            <td className="py-3 px-4">{client.contact_person}</td>
                            <td className="py-3 px-4">{client.email}</td>
                            <td className="py-3 px-4">{client.state}</td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                                {client.client_type}
                              </span>
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

          {/* Farms Tab */}
          <TabsContent value="farms">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Farms</CardTitle>
                  <CardDescription>Manage registered farms</CardDescription>
                </div>
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
                          <th className="text-left py-3 px-4 font-medium">Location</th>
                          <th className="text-left py-3 px-4 font-medium">Area (ha)</th>
                          <th className="text-left py-3 px-4 font-medium">Crop</th>
                        </tr>
                      </thead>
                      <tbody>
                        {farms.map((farm) => (
                          <tr key={farm.id} className="border-b last:border-0">
                            <td className="py-3 px-4">{farm.farm_name}</td>
                            <td className="py-3 px-4">{farm.location_description || "-"}</td>
                            <td className="py-3 px-4">{farm.total_area_ha}</td>
                            <td className="py-3 px-4">{farm.crop_type || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
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