-- ============================================================
-- 패션 코디 아카이브 - Supabase 데이터베이스 스키마
-- Supabase 대시보드 > SQL Editor 에서 이 파일 내용을 전체 실행하세요.
-- ============================================================

-- 1. outfit_photos: 사진 한 장의 기본 정보
create table if not exists public.outfit_photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  image_path text not null,
  thumbnail_path text not null,
  season text not null default 'unknown',
  tags text[] not null default '{}',
  memo text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists outfit_photos_user_id_idx on public.outfit_photos (user_id);
create index if not exists outfit_photos_created_at_idx on public.outfit_photos (created_at desc);

-- 2. outfit_items: 사진에 포함된 상의/하의/신발/아우터 정보
create table if not exists public.outfit_items (
  id uuid primary key default gen_random_uuid(),
  photo_id uuid not null references public.outfit_photos (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  category text not null check (category in ('top', 'bottom', 'shoes', 'outer')),
  sub_type text not null default '',
  color text not null default 'unknown',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists outfit_items_photo_id_idx on public.outfit_items (photo_id);
create index if not exists outfit_items_user_id_idx on public.outfit_items (user_id);

-- ============================================================
-- Row Level Security: 본인 데이터만 읽고 쓸 수 있도록 제한
-- ============================================================

alter table public.outfit_photos enable row level security;
alter table public.outfit_items enable row level security;

-- outfit_photos 정책
drop policy if exists "outfit_photos_select_own" on public.outfit_photos;
create policy "outfit_photos_select_own"
  on public.outfit_photos for select
  using (auth.uid() = user_id);

drop policy if exists "outfit_photos_insert_own" on public.outfit_photos;
create policy "outfit_photos_insert_own"
  on public.outfit_photos for insert
  with check (auth.uid() = user_id);

drop policy if exists "outfit_photos_update_own" on public.outfit_photos;
create policy "outfit_photos_update_own"
  on public.outfit_photos for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "outfit_photos_delete_own" on public.outfit_photos;
create policy "outfit_photos_delete_own"
  on public.outfit_photos for delete
  using (auth.uid() = user_id);

-- outfit_items 정책
drop policy if exists "outfit_items_select_own" on public.outfit_items;
create policy "outfit_items_select_own"
  on public.outfit_items for select
  using (auth.uid() = user_id);

drop policy if exists "outfit_items_insert_own" on public.outfit_items;
create policy "outfit_items_insert_own"
  on public.outfit_items for insert
  with check (auth.uid() = user_id);

drop policy if exists "outfit_items_update_own" on public.outfit_items;
create policy "outfit_items_update_own"
  on public.outfit_items for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "outfit_items_delete_own" on public.outfit_items;
create policy "outfit_items_delete_own"
  on public.outfit_items for delete
  using (auth.uid() = user_id);

-- ============================================================
-- Storage: outfit-photos 버킷 정책
-- 버킷은 Supabase 대시보드 Storage 메뉴에서 먼저 생성해야 합니다. (Private 권장)
-- 경로 구조: photos/{userId}/{photoId}.jpg, thumbnails/{userId}/{photoId}.jpg
-- ============================================================

drop policy if exists "outfit_photos_storage_select_own" on storage.objects;
create policy "outfit_photos_storage_select_own"
  on storage.objects for select
  using (
    bucket_id = 'outfit-photos'
    and (storage.foldername(name))[2] = auth.uid()::text
  );

drop policy if exists "outfit_photos_storage_insert_own" on storage.objects;
create policy "outfit_photos_storage_insert_own"
  on storage.objects for insert
  with check (
    bucket_id = 'outfit-photos'
    and (storage.foldername(name))[2] = auth.uid()::text
  );

drop policy if exists "outfit_photos_storage_update_own" on storage.objects;
create policy "outfit_photos_storage_update_own"
  on storage.objects for update
  using (
    bucket_id = 'outfit-photos'
    and (storage.foldername(name))[2] = auth.uid()::text
  );

drop policy if exists "outfit_photos_storage_delete_own" on storage.objects;
create policy "outfit_photos_storage_delete_own"
  on storage.objects for delete
  using (
    bucket_id = 'outfit-photos'
    and (storage.foldername(name))[2] = auth.uid()::text
  );
