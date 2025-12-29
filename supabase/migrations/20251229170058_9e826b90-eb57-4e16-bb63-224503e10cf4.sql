-- Create enums for the application
CREATE TYPE public.client_type AS ENUM ('Farmer', 'FertilizerCompany', 'Dealer');
CREATE TYPE public.service_status AS ENUM ('Pending', 'InProgress', 'Completed');
CREATE TYPE public.subscription_plan AS ENUM ('Basic', 'Pro', 'Enterprise');
CREATE TYPE public.subscription_status AS ENUM ('Active', 'Expired');
CREATE TYPE public.map_type AS ENUM ('N', 'P', 'K', 'pH', 'VRA');
CREATE TYPE public.app_role AS ENUM ('admin', 'client');

-- Create profiles table linked to auth.users
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create user_roles table for role-based access
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (user_id, role)
);

-- Create clients table
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  company_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  state TEXT NOT NULL,
  client_type public.client_type NOT NULL DEFAULT 'Farmer',
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create farms table
CREATE TABLE public.farms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  farm_name TEXT NOT NULL,
  location_description TEXT,
  total_area_ha DECIMAL(10, 2) NOT NULL,
  crop_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create fields table
CREATE TABLE public.fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID REFERENCES public.farms(id) ON DELETE CASCADE NOT NULL,
  field_name TEXT NOT NULL,
  area_ha DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create soil_samples table
CREATE TABLE public.soil_samples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  field_id UUID REFERENCES public.fields(id) ON DELETE CASCADE NOT NULL,
  sampling_date DATE NOT NULL,
  nitrogen FLOAT,
  phosphorus FLOAT,
  potassium FLOAT,
  ph FLOAT,
  organic_matter FLOAT,
  lab_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create gis_outputs table
CREATE TABLE public.gis_outputs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  field_id UUID REFERENCES public.fields(id) ON DELETE CASCADE NOT NULL,
  map_type public.map_type NOT NULL,
  season TEXT,
  file_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create services table
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  service_type TEXT NOT NULL,
  area_covered_ha DECIMAL(10, 2),
  cost DECIMAL(12, 2),
  status public.service_status NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create subscriptions table
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  plan public.subscription_plan NOT NULL DEFAULT 'Basic',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status public.subscription_status NOT NULL DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create service_requests table for contact form submissions
CREATE TABLE public.service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  company_name TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  state TEXT NOT NULL,
  farm_size_ha DECIMAL(10, 2),
  crop_type TEXT,
  message TEXT,
  status TEXT DEFAULT 'new' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.soil_samples ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gis_outputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to get client_id for a user
CREATE OR REPLACE FUNCTION public.get_user_client_id(_user_id UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.clients WHERE user_id = _user_id LIMIT 1
$$;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- User roles policies
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Clients policies
CREATE POLICY "Clients can view own record" ON public.clients
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all clients" ON public.clients
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Farms policies
CREATE POLICY "Clients can view own farms" ON public.farms
  FOR SELECT USING (client_id = public.get_user_client_id(auth.uid()));

CREATE POLICY "Admins can manage all farms" ON public.farms
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Fields policies
CREATE POLICY "Clients can view own fields" ON public.fields
  FOR SELECT USING (
    farm_id IN (
      SELECT id FROM public.farms WHERE client_id = public.get_user_client_id(auth.uid())
    )
  );

CREATE POLICY "Admins can manage all fields" ON public.fields
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Soil samples policies
CREATE POLICY "Clients can view own soil samples" ON public.soil_samples
  FOR SELECT USING (
    field_id IN (
      SELECT f.id FROM public.fields f
      JOIN public.farms fa ON f.farm_id = fa.id
      WHERE fa.client_id = public.get_user_client_id(auth.uid())
    )
  );

CREATE POLICY "Admins can manage all soil samples" ON public.soil_samples
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- GIS outputs policies
CREATE POLICY "Clients can view own GIS outputs" ON public.gis_outputs
  FOR SELECT USING (
    field_id IN (
      SELECT f.id FROM public.fields f
      JOIN public.farms fa ON f.farm_id = fa.id
      WHERE fa.client_id = public.get_user_client_id(auth.uid())
    )
  );

CREATE POLICY "Admins can manage all GIS outputs" ON public.gis_outputs
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Services policies
CREATE POLICY "Clients can view own services" ON public.services
  FOR SELECT USING (client_id = public.get_user_client_id(auth.uid()));

CREATE POLICY "Admins can manage all services" ON public.services
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Subscriptions policies
CREATE POLICY "Clients can view own subscriptions" ON public.subscriptions
  FOR SELECT USING (client_id = public.get_user_client_id(auth.uid()));

CREATE POLICY "Admins can manage all subscriptions" ON public.subscriptions
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Service requests policies (public insert, admin view)
CREATE POLICY "Anyone can submit service requests" ON public.service_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage service requests" ON public.service_requests
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_farms_updated_at BEFORE UPDATE ON public.farms
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fields_updated_at BEFORE UPDATE ON public.fields
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data ->> 'full_name');
  
  -- Default role is 'client'
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'client');
  
  RETURN new;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create storage bucket for GIS outputs and reports
INSERT INTO storage.buckets (id, name, public)
VALUES ('gis-outputs', 'gis-outputs', false);

-- Storage policies for gis-outputs bucket
CREATE POLICY "Clients can view own files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'gis-outputs' AND 
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Admins can upload files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'gis-outputs' AND 
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can update files" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'gis-outputs' AND 
    public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can delete files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'gis-outputs' AND 
    public.has_role(auth.uid(), 'admin')
  );