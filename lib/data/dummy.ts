// =============================================
// DUMMY DATA — mirrors supabase/seed.sql exactly.
// Swap the functions in lib/data/index.ts to real
// Supabase queries once NEXT_PUBLIC_SUPABASE_URL/KEY
// are set — the shapes here already match
// lib/supabase/types.ts, so callers never change.
// =============================================
import type { Player, Team, Tournament, Match, Standing, Trial, Product, Goal } from '../supabase/types';

export const dummyTeams: Team[] = [
  { id: '11111111-0000-0000-0000-000000000001', name: 'Cilangkahan FC', logo_url: null, home_ground: 'Lapangan Utama Malingping', founded_year: 2018, colors: 'Hijau-Putih', description: 'Klub kebanggaan Kecamatan Malingping, tulang punggung sepak bola Cilangkahan.', created_at: '2024-01-01' },
  { id: '11111111-0000-0000-0000-000000000002', name: 'Bayah United', logo_url: null, home_ground: 'Lapangan Bayah', founded_year: 2020, colors: 'Merah-Hitam', description: 'Klub muda berbakat dari pesisir selatan Cilangkahan.', created_at: '2024-01-01' },
  { id: '11111111-0000-0000-0000-000000000003', name: 'Panggarangan Putra', logo_url: null, home_ground: 'Lapangan Desa Hegarmanah', founded_year: 2019, colors: 'Biru-Putih', description: 'Klub sepak bola berbasis komunitas dari Kecamatan Panggarangan.', created_at: '2024-01-01' },
  { id: '11111111-0000-0000-0000-000000000004', name: 'Cihara Muda', logo_url: null, home_ground: 'Lapangan Cihara', founded_year: 2021, colors: 'Kuning-Hitam', description: 'Generasi muda berbakat dari Kecamatan Cihara.', created_at: '2024-01-01' },
];

export const dummyTournaments: Tournament[] = [
  { id: '22222222-0000-0000-0000-000000000001', name: 'Liga Cilangkahan', season: '2024/2025', start_date: '2024-11-01', end_date: '2025-04-30', format: 'liga', status: 'ongoing', logo_url: null, description: 'Kompetisi liga utama antar klub se-wilayah calon DOB Cilangkahan. Diikuti oleh 4 klub terbaik daerah.', prize: 'Juara: Rp 5.000.000 + Piala Bupati', created_at: '2024-01-01' },
];

export const dummyMatches: Match[] = [
  { id: 'm1', tournament_id: '22222222-0000-0000-0000-000000000001', home_team_id: '11111111-0000-0000-0000-000000000001', away_team_id: '11111111-0000-0000-0000-000000000002', match_date: '2024-11-10T15:00:00+07:00', venue: 'Lapangan Utama Malingping', home_score: 2, away_score: 1, status: 'finished', match_week: 1, notes: null, created_at: '2024-01-01' },
  { id: 'm2', tournament_id: '22222222-0000-0000-0000-000000000001', home_team_id: '11111111-0000-0000-0000-000000000003', away_team_id: '11111111-0000-0000-0000-000000000004', match_date: '2024-11-10T18:00:00+07:00', venue: 'Lapangan Desa Hegarmanah', home_score: 0, away_score: 0, status: 'finished', match_week: 1, notes: null, created_at: '2024-01-01' },
  { id: 'm3', tournament_id: '22222222-0000-0000-0000-000000000001', home_team_id: '11111111-0000-0000-0000-000000000002', away_team_id: '11111111-0000-0000-0000-000000000003', match_date: '2024-11-17T15:00:00+07:00', venue: 'Lapangan Bayah', home_score: 1, away_score: 2, status: 'finished', match_week: 2, notes: null, created_at: '2024-01-01' },
  { id: 'm4', tournament_id: '22222222-0000-0000-0000-000000000001', home_team_id: '11111111-0000-0000-0000-000000000001', away_team_id: '11111111-0000-0000-0000-000000000004', match_date: '2024-11-24T15:00:00+07:00', venue: 'Lapangan Utama Malingping', home_score: 0, away_score: 0, status: 'scheduled', match_week: 3, notes: null, created_at: '2024-01-01' },
];

export const dummyStandings: Standing[] = [
  { id: 's1', tournament_id: '22222222-0000-0000-0000-000000000001', team_id: '11111111-0000-0000-0000-000000000001', played: 1, won: 1, drawn: 0, lost: 0, goals_for: 2, goals_against: 1, points: 3 },
  { id: 's2', tournament_id: '22222222-0000-0000-0000-000000000001', team_id: '11111111-0000-0000-0000-000000000003', played: 2, won: 1, drawn: 1, lost: 0, goals_for: 2, goals_against: 1, points: 4 },
  { id: 's3', tournament_id: '22222222-0000-0000-0000-000000000001', team_id: '11111111-0000-0000-0000-000000000004', played: 2, won: 0, drawn: 1, lost: 1, goals_for: 0, goals_against: 2, points: 1 },
  { id: 's4', tournament_id: '22222222-0000-0000-0000-000000000001', team_id: '11111111-0000-0000-0000-000000000002', played: 2, won: 0, drawn: 0, lost: 2, goals_for: 2, goals_against: 3, points: 0 },
];

export const dummyGoals: Goal[] = [
  { id: 'g1', match_id: 'm1', player_id: 'p1', team_id: '11111111-0000-0000-0000-000000000001', minute: 23, is_own_goal: false, is_penalty: false, created_at: '2024-01-01' },
  { id: 'g2', match_id: 'm1', player_id: 'p1', team_id: '11111111-0000-0000-0000-000000000001', minute: 67, is_own_goal: false, is_penalty: false, created_at: '2024-01-01' },
  { id: 'g3', match_id: 'm3', player_id: 'p2', team_id: '11111111-0000-0000-0000-000000000003', minute: 12, is_own_goal: false, is_penalty: true, created_at: '2024-01-01' },
  { id: 'g4', match_id: 'm3', player_id: 'p3', team_id: '11111111-0000-0000-0000-000000000003', minute: 81, is_own_goal: false, is_penalty: false, created_at: '2024-01-01' },
];

export const dummyPlayers: Player[] = [
  {
    id: 'p1', full_name: 'Rizky Maulana', nickname: 'Rizky', birth_date: '2008-03-14', birth_place: 'Malingping',
    height_cm: 172, weight_kg: 64, position: 'ST', dominant_foot: 'kanan', current_club: 'Cilangkahan FC',
    address: 'Malingping, Lebak', phone: '0812-1111-0001', photo_url: null, video_url: null,
    stats: { goals: 14, assists: 5, appearances: 12, clean_sheets: 0 }, status: 'approved',
    submitted_by: null, approved_by: null, approved_at: '2024-10-01', rejection_reason: null, created_at: '2024-09-20',
  },
  {
    id: 'p2', full_name: 'Deni Firmansyah', nickname: 'Deni', birth_date: '2009-07-02', birth_place: 'Panggarangan',
    height_cm: 168, weight_kg: 58, position: 'CAM', dominant_foot: 'kiri', current_club: 'Panggarangan Putra',
    address: 'Panggarangan, Lebak', phone: '0812-1111-0002', photo_url: null, video_url: null,
    stats: { goals: 9, assists: 11, appearances: 14, clean_sheets: 0 }, status: 'approved',
    submitted_by: null, approved_by: null, approved_at: '2024-10-02', rejection_reason: null, created_at: '2024-09-22',
  },
  {
    id: 'p3', full_name: 'Agus Saputra', nickname: 'Agus', birth_date: '2007-11-20', birth_place: 'Panggarangan',
    height_cm: 175, weight_kg: 66, position: 'CM', dominant_foot: 'kanan', current_club: 'Panggarangan Putra',
    address: 'Panggarangan, Lebak', phone: '0812-1111-0003', photo_url: null, video_url: null,
    stats: { goals: 6, assists: 8, appearances: 14, clean_sheets: 0 }, status: 'approved',
    submitted_by: null, approved_by: null, approved_at: '2024-10-03', rejection_reason: null, created_at: '2024-09-23',
  },
  {
    id: 'p4', full_name: 'Yusuf Ramadhan', nickname: 'Yusuf', birth_date: '2010-01-09', birth_place: 'Bayah',
    height_cm: 180, weight_kg: 70, position: 'GK', dominant_foot: 'kanan', current_club: 'Bayah United',
    address: 'Bayah, Lebak', phone: '0812-1111-0004', photo_url: null, video_url: null,
    stats: { goals: 0, assists: 0, appearances: 10, clean_sheets: 4 }, status: 'approved',
    submitted_by: null, approved_by: null, approved_at: '2024-10-04', rejection_reason: null, created_at: '2024-09-25',
  },
  {
    id: 'p5', full_name: 'Fajar Nugraha', nickname: 'Fajar', birth_date: '2008-05-30', birth_place: 'Cihara',
    height_cm: 170, weight_kg: 62, position: 'LB', dominant_foot: 'kiri', current_club: 'Cihara Muda',
    address: 'Cihara, Lebak', phone: '0812-1111-0005', photo_url: null, video_url: null,
    stats: { goals: 1, assists: 4, appearances: 11, clean_sheets: 0 }, status: 'approved',
    submitted_by: null, approved_by: null, approved_at: '2024-10-05', rejection_reason: null, created_at: '2024-09-26',
  },
  {
    id: 'p6', full_name: 'Bima Pratama', nickname: 'Bima', birth_date: '2009-09-17', birth_place: 'Malingping',
    height_cm: 165, weight_kg: 56, position: 'RW', dominant_foot: 'kanan', current_club: 'Cilangkahan FC',
    address: 'Malingping, Lebak', phone: '0812-1111-0006', photo_url: null, video_url: null,
    stats: { goals: 7, assists: 6, appearances: 12, clean_sheets: 0 }, status: 'approved',
    submitted_by: null, approved_by: null, approved_at: '2024-10-06', rejection_reason: null, created_at: '2024-09-27',
  },
];

export const dummyTrials: Trial[] = [
  { id: 't1', title: 'Open Trial Cilangkahan FC 2025', club_name: 'Cilangkahan FC', description: 'Cilangkahan FC membuka kesempatan bagi pemain muda berbakat dari seluruh wilayah Cilangkahan untuk bergabung dan berjuang bersama membawa nama daerah.', requirements: 'WNI putra daerah Cilangkahan, sehat jasmani rohani, berdedikasi tinggi, tidak sedang terikat kontrak klub lain.', positions: ['GK', 'CB', 'CM', 'ST'], trial_date: '2025-01-15', location: 'Lapangan Utama Malingping, Kec. Malingping', contact: '0812-3456-7890', status: 'open', poster_url: null, age_min: 16, age_max: 25, created_at: '2024-12-01' },
  { id: 't2', title: 'Seleksi Pemain Bayah United', club_name: 'Bayah United', description: 'Bayah United mencari pemain potensial usia muda untuk memperkuat skuad musim depan. Prioritas putra asli Kecamatan Bayah.', requirements: 'Usia 15-22 tahun, putra Kecamatan Bayah, aktif berlatih minimal 6 bulan terakhir.', positions: ['GK', 'LB', 'RB', 'LW', 'RW'], trial_date: '2025-02-01', location: 'Lapangan Bayah, Kec. Bayah', contact: '0856-7890-1234', status: 'open', poster_url: null, age_min: 15, age_max: 22, created_at: '2024-12-05' },
];

export const dummyProducts: Product[] = [
  { id: 'pr1', name: 'Jersey Cilangkahan FC Home 2024', description: 'Jersey resmi Cilangkahan FC musim 2024/2025 warna hijau-putih. Bahan polyester berkualitas, nyaman dipakai, tersedia ukuran S-XXL.', price: 185000, image_url: null, category: 'merchandise', seller_name: 'Official Store CFH', contact: '0812-0000-0001', whatsapp: '6281200000001', is_available: true, created_at: '2024-10-01' },
  { id: 'pr2', name: 'Tiket Pertandingan Derby Cilangkahan', description: 'Tiket masuk pertandingan derby akbar Cilangkahan FC vs Bayah United. Nikmati atmosfer sepak bola daerah yang membara langsung di tribun!', price: 15000, image_url: null, category: 'tiket', seller_name: 'Panitia Liga Cilangkahan', contact: '0812-0000-0002', whatsapp: '6281200000002', is_available: true, created_at: '2024-10-02' },
  { id: 'pr3', name: 'Nasi Uduk Stadion Pak Encep', description: 'Nasi uduk khas Malingping dengan lauk pilihan. Tersedia di area parkir Lapangan Utama Malingping setiap hari pertandingan.', price: 12000, image_url: null, category: 'kuliner', seller_name: 'Warung Pak Encep', contact: '0878-0000-0003', whatsapp: '6287800000003', is_available: true, created_at: '2024-10-03' },
  { id: 'pr4', name: 'Syal Supporter Cilangkahan', description: 'Syal rajut berwarna hijau-putih dengan bordir logo CFH. Cocok untuk supporter setia Cilangkahan FC.', price: 45000, image_url: null, category: 'merchandise', seller_name: 'Konveksi Hijau Banten', contact: '0812-0000-0004', whatsapp: '6281200000004', is_available: true, created_at: '2024-10-04' },
  { id: 'pr5', name: 'Kaos Polo Supporter Liga Cilangkahan', description: 'Kaos polo premium supporter Liga Cilangkahan. Tersedia dalam warna hijau, merah, biru, dan kuning sesuai warna klub.', price: 125000, image_url: null, category: 'merchandise', seller_name: 'Official Store CFH', contact: '0812-0000-0001', whatsapp: '6281200000001', is_available: true, created_at: '2024-10-05' },
];
