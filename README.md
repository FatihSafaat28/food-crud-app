# Food CRUD App

Aplikasi manajemen menu makanan menggunakan Next.js, Prisma, dan Supabase.

## Login / Register response dengan bantuan API Reqres

    Email : lindsay.ferguson@reqres.in
    Password : [apa saja]

## Cara Menjalankan Aplikasi (Untuk Mentor/Developer Lain)

Ikuti langkah-langkah berikut setelah melakukan clone repository:

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Duplikasi file `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

Lalu isi file `.env` dengan kredensial Supabase Anda sendiri (Database URL & API Keys).

### 3. Setup Database (Prisma)

Jalankan perintah ini untuk membuat tabel di database Supabase Anda sesuai schema yang ada:

```bash
npx prisma db push
```

### 4. Setup Supabase Storage

Agar fitur upload gambar berfungsi:

1.  Buka Dashboard Supabase Anda -> **Storage**.
2.  Buat bucket baru bernama **`menu-images`**.
3.  Biarkan bucket tersebut **private** (jangan centang "Public bucket"). Kita akan mengatur akses melalui Policies yang lebih spesifik.
4.  Buka **SQL Editor** di dashboard Supabase Anda (ikon database di menu kiri).
5.  Copy dan jalankan script SQL di bawah ini. Script ini akan membuat policy yang dibutuhkan agar aplikasi bisa melihat, mengupload, dan menghapus gambar di bucket `menu-images`.

    ```sql
    -- 1. Policy untuk mengizinkan semua orang MELIHAT gambar di bucket 'menu-images'
    CREATE POLICY "Public Read Access"
    ON storage.objects FOR SELECT
    USING ( bucket_id = 'menu-images' );

    -- 2. Policy untuk mengizinkan semua orang UPLOAD gambar ke bucket 'menu-images'
    CREATE POLICY "Public Insert Access"
    ON storage.objects FOR INSERT
    WITH CHECK ( bucket_id = 'menu-images' );

    -- 3. Policy untuk mengizinkan semua orang MENGHAPUS gambar dari bucket 'menu-images'
    CREATE POLICY "Public Delete Access"
    ON storage.objects FOR DELETE
    USING ( bucket_id = 'menu-images' );
    ```

### 5. Jalankan Aplikasi

```bash
npm run dev
```
