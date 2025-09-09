-- Database setup for Project Kisan AI (Local Development)
-- Run this in your PostgreSQL database to create the required tables

-- Create database (run this as superuser if needed)
-- CREATE DATABASE project_kisan;

-- Connect to the project_kisan database and run the following:

-- Session storage table for authentication
CREATE TABLE IF NOT EXISTS "sessions" (
  "sid" varchar PRIMARY KEY,
  "sess" jsonb NOT NULL,
  "expire" timestamp NOT NULL
);

CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "sessions" ("expire");

-- Users table
CREATE TABLE IF NOT EXISTS "users" (
  "id" varchar PRIMARY KEY NOT NULL,
  "email" varchar UNIQUE,
  "first_name" varchar,
  "last_name" varchar,
  "profile_image_url" varchar,
  "location" text,
  "language" text DEFAULT 'en',
  "created_at" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now()
);

-- Disease scans table
CREATE TABLE IF NOT EXISTS "disease_scans" (
  "id" serial PRIMARY KEY,
  "user_id" varchar REFERENCES "users"("id"),
  "image_data" text NOT NULL,
  "diagnosis" text,
  "confidence" integer,
  "remedies" jsonb,
  "scan_date" timestamp DEFAULT now()
);

-- Market prices table
CREATE TABLE IF NOT EXISTS "market_prices" (
  "id" serial PRIMARY KEY,
  "crop" text NOT NULL,
  "price" integer NOT NULL,
  "unit" text DEFAULT 'kg',
  "market" text NOT NULL,
  "trend" text,
  "trend_percentage" integer,
  "last_updated" timestamp DEFAULT now()
);

-- Government schemes table
CREATE TABLE IF NOT EXISTS "government_schemes" (
  "id" serial PRIMARY KEY,
  "name" text NOT NULL,
  "description" text NOT NULL,
  "amount" text,
  "eligibility" jsonb,
  "application_link" text,
  "is_active" boolean DEFAULT true,
  "category" text
);

-- Activities table
CREATE TABLE IF NOT EXISTS "activities" (
  "id" serial PRIMARY KEY,
  "user_id" varchar REFERENCES "users"("id"),
  "type" text NOT NULL,
  "title" text NOT NULL,
  "description" text,
  "icon" text,
  "created_at" timestamp DEFAULT now()
);

-- Insert sample data for testing
INSERT INTO "users" ("id", "email", "first_name", "last_name", "location", "language") 
VALUES ('1', 'farmer@example.com', 'Test', 'Farmer', 'Karnataka, India', 'en')
ON CONFLICT ("id") DO NOTHING;

-- Insert sample government schemes
INSERT INTO "government_schemes" ("name", "description", "amount", "eligibility", "application_link", "category", "is_active") VALUES
('PM-KISAN Scheme', 'Direct income support of ₹6,000 per year to eligible farmer families', '₹6,000/year', '["Small and marginal farmers", "Landholding up to 2 hectares", "Valid Aadhaar card"]', 'https://pmkisan.gov.in/', 'income_support', true),
('Drip Irrigation Subsidy', 'Up to 50% subsidy on drip irrigation systems', '50% subsidy', '["Farmers with irrigation facilities", "Minimum 0.5 hectare land", "No previous subsidy claimed"]', 'https://pmksy.gov.in/', 'subsidy', true),
('Crop Insurance Scheme', 'Comprehensive risk solution for crop loss coverage', 'Up to ₹2 lakh coverage', '["All farmers (loanee and non-loanee)", "Coverage for pre-sowing to post-harvest", "Premium varies by crop"]', 'https://pmfby.gov.in/', 'insurance', true),
('Soil Health Card Scheme', 'Free soil testing and nutrient recommendations', 'Free service', '["All farmers", "Valid land documents"]', 'https://soilhealth.dac.gov.in/', 'advisory', true)
ON CONFLICT DO NOTHING;

-- Insert sample market prices
INSERT INTO "market_prices" ("crop", "price", "unit", "market", "trend", "trend_percentage") VALUES
('Tomato', 2500, 'kg', 'Bangalore Mandi', 'up', 5),
('Onion', 1800, 'kg', 'Bangalore Mandi', 'down', -3),
('Rice', 3200, 'kg', 'Bangalore Mandi', 'up', 2),
('Wheat', 2800, 'kg', 'Bangalore Mandi', 'stable', 0),
('Maize', 2200, 'kg', 'Bangalore Mandi', 'up', 4)
ON CONFLICT DO NOTHING;