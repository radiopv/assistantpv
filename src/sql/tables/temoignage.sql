create table if not exists public.temoignage (
    id uuid default gen_random_uuid() primary key,
    content text not null,
    author text not null,
    rating integer,
    is_approved boolean default false,
    is_featured boolean default false,
    sponsor_id uuid references public.sponsors(id),
    child_id uuid references public.children(id),
    created_at timestamp with time zone default timezone('utc'::text, now()),
    updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Add RLS policies
alter table public.temoignage enable row level security;

create policy "Testimonials are viewable by everyone"
    on public.temoignage for select
    using (true);

create policy "Only authenticated users can insert testimonials"
    on public.temoignage for insert
    to authenticated
    with check (true);

create policy "Only admins can update testimonials"
    on public.temoignage for update
    to authenticated
    using (
        exists (
            select 1 from public.sponsors
            where id = auth.uid()
            and role = 'admin'
        )
    );

create policy "Only admins can delete testimonials"
    on public.temoignage for delete
    to authenticated
    using (
        exists (
            select 1 from public.sponsors
            where id = auth.uid()
            and role = 'admin'
        )
    );

-- Add triggers for updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger handle_testimonials_updated_at
    before update on public.temoignage
    for each row
    execute procedure public.handle_updated_at();