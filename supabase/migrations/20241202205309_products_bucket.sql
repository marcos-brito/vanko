INSERT INTO storage.buckets
  (id, name, public ,allowed_mime_types)
VALUES
  ('products', 'products', true, ARRAY['image/jpeg','image/png']);
