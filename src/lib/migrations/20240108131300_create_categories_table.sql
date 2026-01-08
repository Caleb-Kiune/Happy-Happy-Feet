-- Create categories table
create table if not exists categories (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  slug text not null unique,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies (Open for now as it's an internal tool, or restrict modifications to authenticated users)
alter table categories enable row level security;

create policy "Enable read access for all users" on categories
  for select using (true);

create policy "Enable write access for authenticated users only" on categories
  for insert with check (auth.role() = 'authenticated');

create policy "Enable update access for authenticated users only" on categories
  for update using (auth.role() = 'authenticated');

create policy "Enable delete access for authenticated users only" on categories
  for delete using (auth.role() = 'authenticated');

-- Function to safely rename a category and update all products
-- This ensures data consistency in a single transaction
create or replace function rename_category(old_name text, new_name text, new_slug text)
returns void
language plpgsql
security definer
as $$
begin
  -- 1. Update the category itself
  update categories
  set name = new_name,
      slug = new_slug
  where name = old_name;

  -- 2. Update all products that contain this category in their array
  -- We use array_replace to swap the old string for the new one
  update products
  set categories = array_replace(categories, old_name, new_name)
  where categories @> array[old_name];
end;
$$;

-- Seed initial data from existing constants
insert into categories (name, slug) values
  ('block heels', 'block-heels'),
  ('pencil heels', 'pencil-heels'),
  ('flats', 'flats'),
  ('wedge', 'wedge'),
  ('open', 'open'),
  ('sneakers', 'sneakers'),
  ('orthopedic', 'orthopedic')
on conflict (name) do nothing;
