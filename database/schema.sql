-- LeadFlow AI Database Schema
-- Run this in your Supabase SQL editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  subscription_plan TEXT DEFAULT 'free' CHECK (subscription_plan IN ('free', 'pro', 'business')),
  connected_accounts JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  title TEXT,
  phone TEXT,
  location TEXT,
  source TEXT,
  score INTEGER DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  segment TEXT DEFAULT 'Cold' CHECK (segment IN ('Hot', 'Warm', 'Cold', 'Nurture')),
  status TEXT DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Qualified', 'Converted', 'Lost')),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  external_crm_id TEXT,
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, email)
);

-- Sequences table
CREATE TABLE sequences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  trigger_conditions JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sequence steps table
CREATE TABLE sequence_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sequence_id UUID NOT NULL REFERENCES sequences(id) ON DELETE CASCADE,
  step_order INTEGER NOT NULL,
  step_type TEXT NOT NULL CHECK (step_type IN ('email', 'delay', 'condition', 'action')),
  content JSONB NOT NULL,
  delay_days INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(sequence_id, step_order)
);

-- Lead activities table
CREATE TABLE lead_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('email_sent', 'email_opened', 'email_clicked', 'website_visit', 'form_submit', 'call_made', 'meeting_scheduled', 'note_added')),
  activity_details JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sequence executions table (tracks which leads are in which sequences)
CREATE TABLE sequence_executions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sequence_id UUID NOT NULL REFERENCES sequences(id) ON DELETE CASCADE,
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  current_step INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'failed')),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  next_action_at TIMESTAMP WITH TIME ZONE,
  
  UNIQUE(sequence_id, lead_id)
);

-- Create indexes for better performance
CREATE INDEX idx_leads_user_id ON leads(user_id);
CREATE INDEX idx_leads_segment ON leads(segment);
CREATE INDEX idx_leads_score ON leads(score DESC);
CREATE INDEX idx_leads_last_activity ON leads(last_activity DESC);
CREATE INDEX idx_sequences_user_id ON sequences(user_id);
CREATE INDEX idx_sequence_steps_sequence_id ON sequence_steps(sequence_id);
CREATE INDEX idx_lead_activities_lead_id ON lead_activities(lead_id);
CREATE INDEX idx_lead_activities_timestamp ON lead_activities(timestamp DESC);
CREATE INDEX idx_sequence_executions_sequence_id ON sequence_executions(sequence_id);
CREATE INDEX idx_sequence_executions_lead_id ON sequence_executions(lead_id);
CREATE INDEX idx_sequence_executions_next_action ON sequence_executions(next_action_at);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sequences_updated_at BEFORE UPDATE ON sequences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sequence_steps_updated_at BEFORE UPDATE ON sequence_steps
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE sequence_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE sequence_executions ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Leads policies
CREATE POLICY "Users can view own leads" ON leads
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own leads" ON leads
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own leads" ON leads
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own leads" ON leads
  FOR DELETE USING (auth.uid() = user_id);

-- Sequences policies
CREATE POLICY "Users can view own sequences" ON sequences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sequences" ON sequences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sequences" ON sequences
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sequences" ON sequences
  FOR DELETE USING (auth.uid() = user_id);

-- Sequence steps policies
CREATE POLICY "Users can view own sequence steps" ON sequence_steps
  FOR SELECT USING (auth.uid() = (SELECT user_id FROM sequences WHERE id = sequence_id));

CREATE POLICY "Users can insert own sequence steps" ON sequence_steps
  FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM sequences WHERE id = sequence_id));

CREATE POLICY "Users can update own sequence steps" ON sequence_steps
  FOR UPDATE USING (auth.uid() = (SELECT user_id FROM sequences WHERE id = sequence_id));

CREATE POLICY "Users can delete own sequence steps" ON sequence_steps
  FOR DELETE USING (auth.uid() = (SELECT user_id FROM sequences WHERE id = sequence_id));

-- Lead activities policies
CREATE POLICY "Users can view own lead activities" ON lead_activities
  FOR SELECT USING (auth.uid() = (SELECT user_id FROM leads WHERE id = lead_id));

CREATE POLICY "Users can insert own lead activities" ON lead_activities
  FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM leads WHERE id = lead_id));

-- Sequence executions policies
CREATE POLICY "Users can view own sequence executions" ON sequence_executions
  FOR SELECT USING (auth.uid() = (SELECT user_id FROM sequences WHERE id = sequence_id));

CREATE POLICY "Users can insert own sequence executions" ON sequence_executions
  FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM sequences WHERE id = sequence_id));

CREATE POLICY "Users can update own sequence executions" ON sequence_executions
  FOR UPDATE USING (auth.uid() = (SELECT user_id FROM sequences WHERE id = sequence_id));

CREATE POLICY "Users can delete own sequence executions" ON sequence_executions
  FOR DELETE USING (auth.uid() = (SELECT user_id FROM sequences WHERE id = sequence_id));

-- Create a function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create some sample data (optional - remove in production)
-- This will be populated by the application instead
