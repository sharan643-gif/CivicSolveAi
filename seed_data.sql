-- ═══════════════════════════════════════════════════════════════════
--  JanSetu AI — SEED DATA  (10 sample rows per table)
--  Run this AFTER supabase_schema.sql has been applied.
--  Safe to run multiple times (ON CONFLICT DO NOTHING / DO UPDATE).
-- ═══════════════════════════════════════════════════════════════════


-- ─────────────────────────────────────────────────────────────────
-- 1. SECTORS  (10 rows)
--    Columns: id, name, slug, description, active, created_at
-- ─────────────────────────────────────────────────────────────────
INSERT INTO public.sectors (name, slug, description, active) VALUES
  ('Health',            'health',       'Public health, hospitals, PHCs, maternal care',       TRUE),
  ('Education',         'education',    'Schools, colleges, mid-day meals, scholarships',       TRUE),
  ('Water & Sanitation','water',        'Drinking water, sewage, ODF, drainage',                TRUE),
  ('Agriculture',       'agriculture',  'Crop insurance, irrigation, soil health, MSP',        TRUE),
  ('Infrastructure',    'infra',        'Roads, bridges, buildings, urban planning',            TRUE),
  ('Governance',        'governance',   'RTI, grievance redressal, elections, digitisation',   TRUE),
  ('Energy',            'energy',       'Solar, grid access, energy efficiency, DISCOMs',      TRUE),
  ('Environment',       'environment',  'AQI, waste management, forests, climate resilience',  TRUE),
  ('Transport',         'transport',    'Buses, metro, railways, last-mile connectivity',       TRUE),
  ('Digital Services',  'digital',      'e-Gov portals, digital literacy, broadband',          TRUE)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;


-- ─────────────────────────────────────────────────────────────────
-- 2. ROLES  (10 rows — linked to sectors via sector_id)
--    Columns: id, sector_id, name, slug
-- ─────────────────────────────────────────────────────────────────
INSERT INTO public.roles (sector_id, name, slug)
SELECT s.id, r.name, r.slug
FROM (VALUES
  ('citizen',     'Citizen',              'citizen'),
  ('citizen',     'Community Leader',     'community_leader'),
  ('government',  'Government Officer',   'gov_officer'),
  ('government',  'Government Admin',     'gov_admin'),
  ('ngo',         'NGO Field Worker',     'ngo_field'),
  ('ngo',         'NGO Administrator',    'ngo_admin'),
  ('startup',     'Startup Founder',      'startup_founder'),
  ('research',    'Researcher',           'researcher'),
  ('super_admin', 'Super Admin',          'super_admin'),
  ('student',     'Student Developer',    'student')
) AS r(sector_slug, name, slug)
JOIN public.sectors s ON s.slug = r.sector_slug
ON CONFLICT (slug) DO NOTHING;


-- ─────────────────────────────────────────────────────────────────
-- 3. PERMISSIONS  (10 rows)
--    Columns: id, name, description
-- ─────────────────────────────────────────────────────────────────
INSERT INTO public.permissions (name, description) VALUES
  ('submit_challenge',  'Create new civic challenges'),
  ('review_challenge',  'Change challenge status and priority'),
  ('propose_solution',  'Submit solutions to challenges'),
  ('approve_solution',  'Approve or reject proposed solutions'),
  ('manage_users',      'View and edit user profiles'),
  ('manage_teams',      'Create and dissolve project teams'),
  ('view_audit_logs',   'Access full platform audit log'),
  ('configure_ai',      'Modify AI model settings'),
  ('export_data',       'Export platform data to CSV or JSON'),
  ('view_analytics',    'Access dashboard analytics and reports')
ON CONFLICT (name) DO NOTHING;


-- ─────────────────────────────────────────────────────────────────
-- 4. ROLE_PERMISSIONS  (10 mappings)
--    Columns: role_id, permission_id
-- ─────────────────────────────────────────────────────────────────
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM (VALUES
  ('citizen',        'submit_challenge'),
  ('citizen',        'view_analytics'),
  ('gov_officer',    'review_challenge'),
  ('gov_officer',    'approve_solution'),
  ('student',        'propose_solution'),
  ('student',        'manage_teams'),
  ('researcher',     'view_analytics'),
  ('researcher',     'export_data'),
  ('super_admin',    'configure_ai'),
  ('super_admin',    'manage_users')
) AS rp(role_slug, perm_name)
JOIN public.roles       r ON r.slug = rp.role_slug
JOIN public.permissions p ON p.name = rp.perm_name
ON CONFLICT DO NOTHING;


-- ─────────────────────────────────────────────────────────────────
-- 5. ORGANIZATIONS  (10 rows)
--    Columns: id, name, type (org_type enum), domain, logo_url,
--             description, website, verified
-- ─────────────────────────────────────────────────────────────────
INSERT INTO public.organizations (name, type, domain, description, website, verified) VALUES
  ('Maharashtra Health Dept',          'government', 'health.maharashtra.gov.in', 'State public health authority, Maharashtra',         'https://health.maharashtra.gov.in', TRUE),
  ('Bengaluru Smart City Initiative',  'government', 'bengalurusmart.com',        'Smart city programme for Bengaluru urban area',      'https://bengalurusmart.com',        TRUE),
  ('Pratham Education Foundation',     'ngo',        'pratham.org',               'India-wide foundational literacy NGO',               'https://pratham.org',               TRUE),
  ('AquaVision Technologies',          'startup',    'aquavision.in',             'Water quality monitoring startup, Hyderabad',        'https://aquavision.in',             FALSE),
  ('IIT Delhi Research Centre',        'research',   'iitd.ac.in',                'Environmental and policy research wing of IIT Delhi','https://iitd.ac.in',                TRUE),
  ('Tamil Nadu e-Governance Agency',   'government', 'tnega.tn.gov.in',           'State digital infrastructure agency, Tamil Nadu',    'https://tnega.tn.gov.in',           TRUE),
  ('Grameen Agriculture Collective',   'ngo',        'grameen.org.in',            'Farmer cooperative network across Uttar Pradesh',    'https://grameen.org.in',            FALSE),
  ('Rajasthan Renewable Energy Corp',  'government', 'rrecl.com',                 'Solar and renewable energy board, Rajasthan',        'https://rrecl.com',                 TRUE),
  ('SafeRoads Foundation',             'ngo',        'saferoads.in',              'Road safety advocacy and audit NGO, Gujarat',        'https://saferoads.in',              FALSE),
  ('Kerala IT Mission',                'government', 'itm.kerala.gov.in',         'State IT infrastructure and e-gov mission, Kerala',  'https://itm.kerala.gov.in',         TRUE)
ON CONFLICT DO NOTHING;


-- ─────────────────────────────────────────────────────────────────
-- 6a. AUTH.USERS  — must be inserted BEFORE public.profiles
--     because profiles.id has a FK → auth.users(id).
--     This uses crypt() to hash the shared test password.
--     All 10 seed accounts use password: JanSetu@2024
-- ─────────────────────────────────────────────────────────────────
INSERT INTO auth.users
  (id, instance_id, aud, role, email,
   encrypted_password, email_confirmed_at,
   raw_app_meta_data, raw_user_meta_data,
   created_at, updated_at)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-000000000001','00000000-0000-0000-0000-000000000000','authenticated','authenticated',
   'arjun.sharma@example.com',   crypt('JanSetu@2024', gen_salt('bf')), NOW(),
   '{"provider":"email","providers":["email"]}','{"full_name":"Arjun Sharma"}',  NOW(), NOW()),

  ('aaaaaaaa-aaaa-aaaa-aaaa-000000000002','00000000-0000-0000-0000-000000000000','authenticated','authenticated',
   'priya.nair@example.com',     crypt('JanSetu@2024', gen_salt('bf')), NOW(),
   '{"provider":"email","providers":["email"]}','{"full_name":"Priya Nair"}',    NOW(), NOW()),

  ('aaaaaaaa-aaaa-aaaa-aaaa-000000000003','00000000-0000-0000-0000-000000000000','authenticated','authenticated',
   'rohit.verma@example.com',    crypt('JanSetu@2024', gen_salt('bf')), NOW(),
   '{"provider":"email","providers":["email"]}','{"full_name":"Rohit Verma"}',   NOW(), NOW()),

  ('aaaaaaaa-aaaa-aaaa-aaaa-000000000004','00000000-0000-0000-0000-000000000000','authenticated','authenticated',
   'sunita.patel@example.com',   crypt('JanSetu@2024', gen_salt('bf')), NOW(),
   '{"provider":"email","providers":["email"]}','{"full_name":"Sunita Patel"}',  NOW(), NOW()),

  ('aaaaaaaa-aaaa-aaaa-aaaa-000000000005','00000000-0000-0000-0000-000000000000','authenticated','authenticated',
   'deepak.iyer@example.com',    crypt('JanSetu@2024', gen_salt('bf')), NOW(),
   '{"provider":"email","providers":["email"]}','{"full_name":"Deepak Iyer"}',   NOW(), NOW()),

  ('aaaaaaaa-aaaa-aaaa-aaaa-000000000006','00000000-0000-0000-0000-000000000000','authenticated','authenticated',
   'admin@jansetu.gov.in',        crypt('JanSetu@2024', gen_salt('bf')), NOW(),
   '{"provider":"email","providers":["email"]}','{"full_name":"JanSetu Admin"}', NOW(), NOW()),

  ('aaaaaaaa-aaaa-aaaa-aaaa-000000000007','00000000-0000-0000-0000-000000000000','authenticated','authenticated',
   'meena.reddy@example.com',    crypt('JanSetu@2024', gen_salt('bf')), NOW(),
   '{"provider":"email","providers":["email"]}','{"full_name":"Meena Reddy"}',   NOW(), NOW()),

  ('aaaaaaaa-aaaa-aaaa-aaaa-000000000008','00000000-0000-0000-0000-000000000000','authenticated','authenticated',
   'anil.joshi@example.com',     crypt('JanSetu@2024', gen_salt('bf')), NOW(),
   '{"provider":"email","providers":["email"]}','{"full_name":"Anil Joshi"}',    NOW(), NOW()),

  ('aaaaaaaa-aaaa-aaaa-aaaa-000000000009','00000000-0000-0000-0000-000000000000','authenticated','authenticated',
   'kavitha.m@example.com',       crypt('JanSetu@2024', gen_salt('bf')), NOW(),
   '{"provider":"email","providers":["email"]}','{"full_name":"Kavitha M"}',     NOW(), NOW()),

  ('aaaaaaaa-aaaa-aaaa-aaaa-000000000010','00000000-0000-0000-0000-000000000000','authenticated','authenticated',
   'vijay.kumar@example.com',    crypt('JanSetu@2024', gen_salt('bf')), NOW(),
   '{"provider":"email","providers":["email"]}','{"full_name":"Vijay Kumar"}',   NOW(), NOW())
ON CONFLICT (id) DO NOTHING;


-- ─────────────────────────────────────────────────────────────────
-- 6b. PUBLIC.PROFILES  (10 rows — now safe, auth.users exist above)
--     Columns: id, full_name, email, primary_sector_id,
--              primary_role_id, verification (enum), avatar_url,
--              phone, skills, expertise, bio
-- ─────────────────────────────────────────────────────────────────
INSERT INTO public.profiles
  (id, full_name, email, primary_sector_id, primary_role_id,
   verification, avatar_url, phone, bio, skills, expertise)
SELECT
  p.uid::UUID,
  p.full_name,
  p.email,
  s.id,
  r.id,
  p.verification::verification_level,
  p.avatar_url,
  p.phone,
  p.bio,
  p.skills::TEXT[],
  p.expertise::TEXT[]
FROM (VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-000000000001','Arjun Sharma',  'arjun.sharma@example.com',  'water',      'citizen',        'verified',
   'https://api.dicebear.com/7.x/initials/svg?seed=AS','9800000001','Citizen activist focused on urban flooding in Pune.',
   '{community,advocacy,reporting}','{drainage,urban_planning}'),

  ('aaaaaaaa-aaaa-aaaa-aaaa-000000000002','Priya Nair',    'priya.nair@example.com',    'health',     'gov_officer',    'verified',
   'https://api.dicebear.com/7.x/initials/svg?seed=PN','9800000002','Senior Medical Officer, Kerala Health Department.',
   '{healthcare,policy,data}','{maternal_health,PHC_management}'),

  ('aaaaaaaa-aaaa-aaaa-aaaa-000000000003','Rohit Verma',   'rohit.verma@example.com',   'digital',    'student',        'verified',
   'https://api.dicebear.com/7.x/initials/svg?seed=RV','9800000003','Full-stack developer building civic-tech solutions.',
   '{react,nodejs,supabase,python}','{IoT,web_development}'),

  ('aaaaaaaa-aaaa-aaaa-aaaa-000000000004','Sunita Patel',  'sunita.patel@example.com',  'agriculture','ngo_field',      'verified',
   'https://api.dicebear.com/7.x/initials/svg?seed=SP','9800000004','NGO field worker focused on farmer welfare in UP.',
   '{field_coordination,community_outreach}','{agriculture,rural_development}'),

  ('aaaaaaaa-aaaa-aaaa-aaaa-000000000005','Deepak Iyer',   'deepak.iyer@example.com',   'environment','researcher',     'verified',
   'https://api.dicebear.com/7.x/initials/svg?seed=DI','9800000005','Environmental policy researcher at IIT Delhi.',
   '{data_analysis,policy,GIS}','{AQI,climate_resilience}'),

  ('aaaaaaaa-aaaa-aaaa-aaaa-000000000006','JanSetu Admin', 'admin@jansetu.gov.in',       'digital',    'super_admin',    'verified',
   'https://api.dicebear.com/7.x/initials/svg?seed=JA','9800000006','Platform super-administrator.',
   '{administration,security,AI}','{platform_management}'),

  ('aaaaaaaa-aaaa-aaaa-aaaa-000000000007','Meena Reddy',   'meena.reddy@example.com',   'governance', 'gov_officer',    'verified',
   'https://api.dicebear.com/7.x/initials/svg?seed=MR','9800000007','District-level coordinator for Hyderabad civic issues.',
   '{coordination,reporting,governance}','{district_admin}'),

  ('aaaaaaaa-aaaa-aaaa-aaaa-000000000008','Anil Joshi',    'anil.joshi@example.com',    'energy',     'researcher',     'verified',
   'https://api.dicebear.com/7.x/initials/svg?seed=AJ','9800000008','Data analyst focused on Rajasthan renewable energy data.',
   '{data_analysis,SQL,python}','{solar_energy,data_viz}'),

  ('aaaaaaaa-aaaa-aaaa-aaaa-000000000009','Kavitha M',     'kavitha.m@example.com',      'education',  'startup_founder','pending_verification',
   'https://api.dicebear.com/7.x/initials/svg?seed=KM','9800000009','EdTech startup founder working on senior digital literacy.',
   '{product_management,ux,education}','{edtech,digital_literacy}'),

  ('aaaaaaaa-aaaa-aaaa-aaaa-000000000010','Vijay Kumar',   'vijay.kumar@example.com',   'transport',  'citizen',        'verified',
   'https://api.dicebear.com/7.x/initials/svg?seed=VK','9800000010','Road safety auditor and observer from Ahmedabad.',
   '{auditing,documentation}','{road_safety,transport}')
) AS p(uid, full_name, email, sector_slug, role_slug, verification, avatar_url, phone, bio, skills, expertise)
JOIN public.sectors s ON s.slug = p.sector_slug
JOIN public.roles   r ON r.slug = p.role_slug
ON CONFLICT (email) DO NOTHING;


-- ─────────────────────────────────────────────────────────────────
-- 7. CHALLENGES  (10 rows)
--    Columns: id, title, description, category, subcategory,
--             severity (enum), status (enum), location, district,
--             affected_population, priority_score, reporter_id,
--             skills_required
-- ─────────────────────────────────────────────────────────────────
INSERT INTO public.challenges
  (id, title, description, category, severity, status,
   location, district, affected_population, priority_score,
   reporter_id, skills_required)
VALUES
  ('cccccccc-cccc-cccc-cccc-000000000001',
   'Waterlogging in Kurla Market',
   'Heavy rains cause severe waterlogging every monsoon. Traders lose stock worth lakhs. Drainage needs urgent upgrade.',
   'water', 'high', 'under_review',
   'Kurla, Mumbai', 'Mumbai', 45000, 82,
   'aaaaaaaa-aaaa-aaaa-aaaa-000000000001',
   ARRAY['civil_engineering','IoT','GIS']),

  ('cccccccc-cccc-cccc-cccc-000000000002',
   'Teacher Shortage in Bidar District Schools',
   'Over 60% of govt primary schools have fewer than 2 teachers, affecting 12,000 students.',
   'education', 'critical', 'active_development',
   'Bidar', 'Bidar', 12000, 91,
   'aaaaaaaa-aaaa-aaaa-aaaa-000000000004',
   ARRAY['data_analysis','education_policy','ML']),

  ('cccccccc-cccc-cccc-cccc-000000000003',
   'Non-functional PHCs in Araria District',
   'PHCs in remote blocks without doctors for 8 months. Maternal and child health indicators have worsened sharply.',
   'health', 'critical', 'reported',
   'Araria', 'Araria', 80000, 96,
   'aaaaaaaa-aaaa-aaaa-aaaa-000000000001',
   ARRAY['teleconsultation','healthcare','hardware']),

  ('cccccccc-cccc-cccc-cccc-000000000004',
   'Potholes on NH-48 Bengaluru-Nelamangala',
   '200+ potholes on this highway. 3 fatal accidents in the last month. NHAI intervention urgently required.',
   'infrastructure', 'high', 'pilot',
   'Nelamangala, Bengaluru', 'Bengaluru Rural', 200000, 78,
   'aaaaaaaa-aaaa-aaaa-aaaa-000000000010',
   ARRAY['mobile_dev','computer_vision','GIS']),

  ('cccccccc-cccc-cccc-cccc-000000000005',
   'PM-FASAL BIMA Claim Delays Vidarbha',
   'Thousands of farmers have not received crop insurance payouts for the 2023 Kharif season. Claims stuck 14+ months.',
   'agriculture', 'high', 'active_development',
   'Amravati', 'Amravati', 35000, 85,
   'aaaaaaaa-aaaa-aaaa-aaaa-000000000004',
   ARRAY['blockchain','satellite_imagery','backend']),

  ('cccccccc-cccc-cccc-cccc-000000000006',
   'AQI Exceeds 400 Daily in Anand Vihar Delhi',
   'Residents report severe respiratory issues. Emergency mitigation plan and traffic diversion needed.',
   'environment', 'critical', 'under_review',
   'Anand Vihar, East Delhi', 'East Delhi', 500000, 95,
   'aaaaaaaa-aaaa-aaaa-aaaa-000000000005',
   ARRAY['data_analysis','IoT','policy','React']),

  ('cccccccc-cccc-cccc-cccc-000000000007',
   'No Grid Power in 24 Bastar Tribal Hamlets',
   'Transformer failure 6 months ago. Solar micro-grid proposed but budget not released by state govt.',
   'energy', 'high', 'active_development',
   'Bastar', 'Bastar', 8000, 80,
   'aaaaaaaa-aaaa-aaaa-aaaa-000000000008',
   ARRAY['solar_engineering','embedded','LoRaWAN','Flutter']),

  ('cccccccc-cccc-cccc-cccc-000000000008',
   'No TSRTC Bus After 9 PM in Outer Hyderabad',
   '40,000 IT corridor commuters in Miyapur and Gachibowli have no bus service after 9 PM.',
   'transport', 'medium', 'reported',
   'Miyapur, Hyderabad', 'Hyderabad', 40000, 60,
   'aaaaaaaa-aaaa-aaaa-aaaa-000000000007',
   ARRAY['mobile_dev','GIS','GTFS','backend']),

  ('cccccccc-cccc-cccc-cccc-000000000009',
   'Digital Literacy Gap Among Chennai Senior Citizens',
   '2 lakh seniors cannot use DigiLocker, UMANG or pension portals. Training centres urgently needed.',
   'digital', 'medium', 'pilot',
   'Chennai', 'Chennai', 200000, 65,
   'aaaaaaaa-aaaa-aaaa-aaaa-000000000009',
   ARRAY['UX','chatbot','community_training']),

  ('cccccccc-cccc-cccc-cccc-000000000010',
   'Open Defecation in ODF-Declared Shivamogga Panchayats',
   '17 panchayats still show open defecation due to non-functional toilets. Behaviour change programme required.',
   'water', 'medium', 'implemented',
   'Shivamogga', 'Shivamogga', 15000, 55,
   'aaaaaaaa-aaaa-aaaa-aaaa-000000000001',
   ARRAY['mobile_dev','payments','field_coordination'])
ON CONFLICT DO NOTHING;



-- ─────────────────────────────────────────────────────────────────
-- 8. TEAMS  (10 rows)
--    Columns: id, challenge_id, name, progress_percentage,
--             repository_url, presentation_url, lead_id
-- ─────────────────────────────────────────────────────────────────
INSERT INTO public.teams
  (id, challenge_id, name, progress_percentage, lead_id)
VALUES
  ('tttttttt-tttt-tttt-tttt-000000000001','cccccccc-cccc-cccc-cccc-000000000001','Mumbai Drain Busters',   45,'aaaaaaaa-aaaa-aaaa-aaaa-000000000003'),
  ('tttttttt-tttt-tttt-tttt-000000000002','cccccccc-cccc-cccc-cccc-000000000002','EduSolve Karnataka',     60,'aaaaaaaa-aaaa-aaaa-aaaa-000000000009'),
  ('tttttttt-tttt-tttt-tttt-000000000003','cccccccc-cccc-cccc-cccc-000000000003','Bihar Telehealth Squad',  10,'aaaaaaaa-aaaa-aaaa-aaaa-000000000002'),
  ('tttttttt-tttt-tttt-tttt-000000000004','cccccccc-cccc-cccc-cccc-000000000004','Road Watch Bengaluru',   100,'aaaaaaaa-aaaa-aaaa-aaaa-000000000003'),
  ('tttttttt-tttt-tttt-tttt-000000000005','cccccccc-cccc-cccc-cccc-000000000005','Vidarbha Crop Chain',     35,'aaaaaaaa-aaaa-aaaa-aaaa-000000000005'),
  ('tttttttt-tttt-tttt-tttt-000000000006','cccccccc-cccc-cccc-cccc-000000000006','CleanAir Delhi Force',    55,'aaaaaaaa-aaaa-aaaa-aaaa-000000000005'),
  ('tttttttt-tttt-tttt-tttt-000000000007','cccccccc-cccc-cccc-cccc-000000000007','SolarBastar Collective',  40,'aaaaaaaa-aaaa-aaaa-aaaa-000000000008'),
  ('tttttttt-tttt-tttt-tttt-000000000008','cccccccc-cccc-cccc-cccc-000000000008','Hyderabad MoveRight',     15,'aaaaaaaa-aaaa-aaaa-aaaa-000000000007'),
  ('tttttttt-tttt-tttt-tttt-000000000009','cccccccc-cccc-cccc-cccc-000000000009','Digital Sakhi Chennai',  100,'aaaaaaaa-aaaa-aaaa-aaaa-000000000009'),
  ('tttttttt-tttt-tttt-tttt-000000000010','cccccccc-cccc-cccc-cccc-000000000010','SHG Toilet Keepers',     100,'aaaaaaaa-aaaa-aaaa-aaaa-000000000004')
ON CONFLICT DO NOTHING;


-- ─────────────────────────────────────────────────────────────────
-- 9. TEAM_MEMBERS  (10 rows)
--    Columns: id, team_id, user_id, role_title, joined_at
-- ─────────────────────────────────────────────────────────────────
INSERT INTO public.team_members (team_id, user_id, role_title) VALUES
  ('tttttttt-tttt-tttt-tttt-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-000000000003','Team Lead'),
  ('tttttttt-tttt-tttt-tttt-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-000000000001','Community Reporter'),
  ('tttttttt-tttt-tttt-tttt-000000000002','aaaaaaaa-aaaa-aaaa-aaaa-000000000009','Team Lead'),
  ('tttttttt-tttt-tttt-tttt-000000000002','aaaaaaaa-aaaa-aaaa-aaaa-000000000004','Field Coordinator'),
  ('tttttttt-tttt-tttt-tttt-000000000003','aaaaaaaa-aaaa-aaaa-aaaa-000000000002','Medical Advisor'),
  ('tttttttt-tttt-tttt-tttt-000000000003','aaaaaaaa-aaaa-aaaa-aaaa-000000000007','District Liaison'),
  ('tttttttt-tttt-tttt-tttt-000000000005','aaaaaaaa-aaaa-aaaa-aaaa-000000000005','Research Lead'),
  ('tttttttt-tttt-tttt-tttt-000000000005','aaaaaaaa-aaaa-aaaa-aaaa-000000000008','Data Analyst'),
  ('tttttttt-tttt-tttt-tttt-000000000006','aaaaaaaa-aaaa-aaaa-aaaa-000000000005','Team Lead'),
  ('tttttttt-tttt-tttt-tttt-000000000006','aaaaaaaa-aaaa-aaaa-aaaa-000000000003','Full-Stack Developer')
ON CONFLICT DO NOTHING;


-- ─────────────────────────────────────────────────────────────────
-- 10. AUDIT_LOGS  (10 rows)
--     Columns: id, user_id, action, target, details,
--              ip_address, status, created_at
-- ─────────────────────────────────────────────────────────────────
INSERT INTO public.audit_logs
  (id, user_id, action, target, details, ip_address, status)
VALUES
  ('bbbbbbbb-bbbb-bbbb-bbbb-000000000001','aaaaaaaa-aaaa-aaaa-aaaa-000000000001',
   'challenge.created',   'cccccccc-cccc-cccc-cccc-000000000001',
   '{"title":"Waterlogging in Kurla Market"}',             '103.22.10.1',  'success'),

  ('bbbbbbbb-bbbb-bbbb-bbbb-000000000002','aaaaaaaa-aaaa-aaaa-aaaa-000000000002',
   'challenge.reviewed',  'cccccccc-cccc-cccc-cccc-000000000001',
   '{"old_status":"reported","new_status":"under_review"}','115.99.22.4',  'success'),

  ('bbbbbbbb-bbbb-bbbb-bbbb-000000000003','aaaaaaaa-aaaa-aaaa-aaaa-000000000003',
   'solution.proposed',   'ssssssss-ssss-ssss-ssss-000000000001',
   '{"title":"Smart Drainage Sensor Network"}',            '49.36.104.5',  'success'),

  ('bbbbbbbb-bbbb-bbbb-bbbb-000000000004','aaaaaaaa-aaaa-aaaa-aaaa-000000000006',
   'user.verified',       'aaaaaaaa-aaaa-aaaa-aaaa-000000000009',
   '{"email":"kavitha.m@example.com"}',                    '127.0.0.1',    'success'),

  ('bbbbbbbb-bbbb-bbbb-bbbb-000000000005','aaaaaaaa-aaaa-aaaa-aaaa-000000000005',
   'challenge.created',   'cccccccc-cccc-cccc-cccc-000000000006',
   '{"title":"AQI Exceeds 400 in Anand Vihar"}',           '122.15.60.9',  'success'),

  ('bbbbbbbb-bbbb-bbbb-bbbb-000000000006','aaaaaaaa-aaaa-aaaa-aaaa-000000000006',
   'ai_settings.updated', NULL,
   '{"key":"model","value":"llama-3.3-70b-versatile"}',    '127.0.0.1',    'success'),

  ('bbbbbbbb-bbbb-bbbb-bbbb-000000000007','aaaaaaaa-aaaa-aaaa-aaaa-000000000004',
   'challenge.created',   'cccccccc-cccc-cccc-cccc-000000000002',
   '{"title":"Teacher Shortage in Bidar"}',                '106.51.11.2',  'success'),

  ('bbbbbbbb-bbbb-bbbb-bbbb-000000000008','aaaaaaaa-aaaa-aaaa-aaaa-000000000003',
   'team.created',        'tttttttt-tttt-tttt-tttt-000000000001',
   '{"name":"Mumbai Drain Busters"}',                      '49.36.104.5',  'success'),

  ('bbbbbbbb-bbbb-bbbb-bbbb-000000000009','aaaaaaaa-aaaa-aaaa-aaaa-000000000009',
   'solution.deployed',   'ssssssss-ssss-ssss-ssss-000000000009',
   '{"title":"Senior Citizen Digital Sakhi"}',             '117.21.44.3',  'success'),

  ('bbbbbbbb-bbbb-bbbb-bbbb-000000000010','aaaaaaaa-aaaa-aaaa-aaaa-000000000006',
   'data.exported',       NULL,
   '{"format":"CSV","total_rows":1234}',                   '127.0.0.1',    'success')
ON CONFLICT DO NOTHING;


-- ─────────────────────────────────────────────────────────────────
-- 11. AI_SETTINGS  (10 rows)
--     Columns: key, value, enabled, model_name,
--              confidence_threshold, updated_at
-- ─────────────────────────────────────────────────────────────────
INSERT INTO public.ai_settings (key, value, enabled, model_name, confidence_threshold) VALUES
  ('duplicate_detection',  'true',                         TRUE,  'llama-3.3-70b-versatile', 0.85),
  ('priority_scoring',     'true',                         TRUE,  'llama-3.3-70b-versatile', 0.80),
  ('team_matching',        'true',                         TRUE,  'llama-3.3-70b-versatile', 0.75),
  ('sentiment_analysis',   'true',                         TRUE,  'llama-3.3-70b-versatile', 0.80),
  ('auto_categorize',      'true',                         TRUE,  'llama-3.3-70b-versatile', 0.78),
  ('voice_recognition',    'true',                         TRUE,  'llama-3.3-70b-versatile', 0.90),
  ('language',             'hi-en',                        TRUE,  'llama-3.3-70b-versatile', 0.80),
  ('max_tokens',           '2048',                         TRUE,  'llama-3.3-70b-versatile', 0.80),
  ('temperature',          '0.3',                          TRUE,  'llama-3.3-70b-versatile', 0.80),
  ('ai_suggestions',       'true',                         TRUE,  'llama-3.3-70b-versatile', 0.70)
ON CONFLICT (key) DO UPDATE
  SET value = EXCLUDED.value,
      enabled = EXCLUDED.enabled,
      updated_at = NOW();
