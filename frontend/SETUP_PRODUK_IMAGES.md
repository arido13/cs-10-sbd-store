# Dokumentasi Folder Produk

## Lokasi Folder
```
frontend/public/products/
```

## Penamaan File Gambar

Untuk setiap produk, gunakan format nama file:
```
item-{PRODUCT_ID}.jpg
```

### Contoh:
- `item-1.jpg` - Gambar untuk produk dengan ID 1
- `item-2.jpg` - Gambar untuk produk dengan ID 2
- `item-3.jpg` - Gambar untuk produk dengan ID 3
- dst...

## Cara Memasukkan Gambar

1. **Siapkan gambar** dalam format JPG/PNG dengan ukuran yang sudah dioptimalkan (misal: 400x300px)

2. **Letakkan file** di folder `frontend/public/products/`
   
3. **Beri nama** sesuai format `item-{ID}.jpg`

4. **Contoh path file:**
   ```
   frontend/public/products/item-1.jpg
   frontend/public/products/item-2.jpg
   frontend/public/products/item-3.jpg
   ```

## Cara Frontend Mengakses

Frontend secara otomatis akan mencari gambar di:
```
/products/item-{product_id}.jpg
```

**Contoh dalam kode:**
```typescript
image: `/products/item-${item.id}.jpg`
```

## Tips
- Gunakan ukuran gambar yang konsisten (misal: 400x300px)
- Kompresi gambar agar loading lebih cepat
- Format JPG untuk foto produk, PNG untuk transparent background
- Pastikan nama file sesuai dengan ID produk di database

## Debugging
Jika gambar tidak muncul, pastikan:
1. ✅ File ada di folder `frontend/public/products/`
2. ✅ Nama file sesuai format `item-{ID}.jpg`
3. ✅ ID di database dan nama file sama
4. ✅ Frontend di-refresh
