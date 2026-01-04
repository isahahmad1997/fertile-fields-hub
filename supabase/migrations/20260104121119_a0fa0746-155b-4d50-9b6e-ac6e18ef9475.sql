-- Drop the overly permissive public INSERT policy on service_requests
-- The edge function now handles insertions with service role key
DROP POLICY IF EXISTS "Anyone can submit service requests" ON service_requests;

-- Fix storage policy to restrict file access by client ownership
-- Drop the current overly permissive policy
DROP POLICY IF EXISTS "Clients can view own files" ON storage.objects;

-- Create proper client-scoped storage policy using path-based access control
-- Files should be stored in client-specific folders: {client_id}/{file_name}
CREATE POLICY "Clients can view own files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'gis-outputs' AND 
    auth.uid() IS NOT NULL AND
    (storage.foldername(name))[1] = (SELECT id::text FROM public.clients WHERE user_id = auth.uid())
  );

-- Admins can still view all files
DROP POLICY IF EXISTS "Admins can view all files" ON storage.objects;
CREATE POLICY "Admins can view all files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'gis-outputs' AND 
    has_role(auth.uid(), 'admin'::app_role)
  );

-- Ensure admins can still manage files
DROP POLICY IF EXISTS "Admins can manage files" ON storage.objects;
CREATE POLICY "Admins can manage files" ON storage.objects
  FOR ALL USING (
    bucket_id = 'gis-outputs' AND 
    has_role(auth.uid(), 'admin'::app_role)
  );