-- =============================================
-- SEED DATA — Sample data untuk demo awal
-- =============================================

-- Sample Teams
INSERT INTO public.teams (id, name, home_ground, founded_year, colors, description) VALUES
  ('11111111-0000-0000-0000-000000000001', 'Cilangkahan FC', 'Lapangan Utama Malingping', 2018, 'Hijau-Putih', 'Klub kebanggaan Kecamatan Malingping, tulang punggung sepak bola Cilangkahan.'),
  ('11111111-0000-0000-0000-000000000002', 'Bayah United', 'Lapangan Bayah', 2020, 'Merah-Hitam', 'Klub muda berbakat dari pesisir selatan Cilangkahan.'),
  ('11111111-0000-0000-0000-000000000003', 'Panggarangan Putra', 'Lapangan Desa Hegarmanah', 2019, 'Biru-Putih', 'Klub sepak bola berbasis komunitas dari Kecamatan Panggarangan.'),
  ('11111111-0000-0000-0000-000000000004', 'Cihara Muda', 'Lapangan Cihara', 2021, 'Kuning-Hitam', 'Generasi muda berbakat dari Kecamatan Cihara.');

-- Sample Tournament
INSERT INTO public.tournaments (id, name, season, start_date, end_date, format, status, description, prize) VALUES
  ('22222222-0000-0000-0000-000000000001', 'Liga Cilangkahan', '2024/2025', '2024-11-01', '2025-04-30', 'liga', 'ongoing', 'Kompetisi liga utama antar klub se-wilayah calon DOB Cilangkahan. Diikuti oleh 4 klub terbaik daerah.', 'Juara: Rp 5.000.000 + Piala Bupati');

-- Sample Matches
INSERT INTO public.matches (tournament_id, home_team_id, away_team_id, match_date, venue, home_score, away_score, status, match_week) VALUES
  ('22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000002', '2024-11-10 15:00:00+07', 'Lapangan Utama Malingping', 2, 1, 'finished', 1),
  ('22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000004', '2024-11-10 18:00:00+07', 'Lapangan Desa Hegarmanah', 0, 0, 'finished', 1),
  ('22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000003', '2024-11-17 15:00:00+07', 'Lapangan Bayah', 1, 2, 'finished', 2),
  ('22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000004', '2024-11-24 15:00:00+07', 'Lapangan Utama Malingping', 0, 0, 'scheduled', 3);

-- Sample Standings
INSERT INTO public.standings (tournament_id, team_id, played, won, drawn, lost, goals_for, goals_against, points) VALUES
  ('22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 1, 1, 0, 0, 2, 1, 3),
  ('22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000003', 2, 1, 1, 0, 2, 1, 4),
  ('22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000004', 2, 0, 1, 1, 0, 2, 1),
  ('22222222-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000002', 2, 0, 0, 2, 2, 3, 0);

-- Sample Trials
INSERT INTO public.trials (title, club_name, description, requirements, positions, trial_date, location, contact, status, age_min, age_max) VALUES
  ('Open Trial Cilangkahan FC 2025', 'Cilangkahan FC', 'Cilangkahan FC membuka kesempatan bagi pemain muda berbakat dari seluruh wilayah Cilangkahan untuk bergabung dan berjuang bersama membawa nama daerah.', 'WNI putra daerah Cilangkahan, sehat jasmani rohani, berdedikasi tinggi, tidak sedang terikat kontrak klub lain.', ARRAY['GK','CB','CM','ST'], '2025-01-15', 'Lapangan Utama Malingping, Kec. Malingping', '0812-3456-7890', 'open', 16, 25),
  ('Seleksi Pemain Bayah United', 'Bayah United', 'Bayah United mencari pemain potensial usia muda untuk memperkuat skuad musim depan. Prioritas putra asli Kecamatan Bayah.', 'Usia 15-22 tahun, putra Kecamatan Bayah, aktif berlatih minimal 6 bulan terakhir.', ARRAY['GK','LB','RB','LW','RW'], '2025-02-01', 'Lapangan Bayah, Kec. Bayah', '0856-7890-1234', 'open', 15, 22);

-- Sample Products (UMKM)
INSERT INTO public.products (name, description, price, category, seller_name, contact, whatsapp, is_available) VALUES
  ('Jersey Cilangkahan FC Home 2024', 'Jersey resmi Cilangkahan FC musim 2024/2025 warna hijau-putih. Bahan polyester berkualitas, nyaman dipakai, tersedia ukuran S-XXL.', 185000, 'merchandise', 'Official Store CFH', '0812-0000-0001', '6281200000001', true),
  ('Tiket Pertandingan Derby Cilangkahan', 'Tiket masuk pertandingan derby akbar Cilangkahan FC vs Bayah United. Nikmati atmosfer sepak bola daerah yang membara langsung di tribun!', 15000, 'tiket', 'Panitia Liga Cilangkahan', '0812-0000-0002', '6281200000002', true),
  ('Nasi Uduk Stadion Pak Encep', 'Nasi uduk khas Malingping dengan lauk pilihan. Tersedia di area parkir Lapangan Utama Malingping setiap hari pertandingan.', 12000, 'kuliner', 'Warung Pak Encep', '0878-0000-0003', '6287800000003', true),
  ('Syal Supporter Cilangkahan', 'Syal rajut berwarna hijau-putih dengan bordir logo CFH. Cocok untuk supporter setia Cilangkahan FC.', 45000, 'merchandise', 'Konveksi Hijau Banten', '0812-0000-0004', '6281200000004', true),
  ('Kaos Polo Supporter Liga Cilangkahan', 'Kaos polo premium supporter Liga Cilangkahan. Tersedia dalam warna hijau, merah, biru, dan kuning sesuai warna klub.', 125000, 'merchandise', 'Official Store CFH', '0812-0000-0001', '6281200000001', true);
