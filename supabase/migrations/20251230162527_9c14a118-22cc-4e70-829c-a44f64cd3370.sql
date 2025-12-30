-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Add boundary geometry column to fields table
ALTER TABLE public.fields 
ADD COLUMN IF NOT EXISTS boundary_geom geometry(Polygon, 4326);

-- Create spatial index for efficient querying
CREATE INDEX IF NOT EXISTS idx_fields_boundary_geom 
ON public.fields USING GIST (boundary_geom);