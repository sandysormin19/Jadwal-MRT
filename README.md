# Aplikasi Jadwal MRT Jakarta

Proyek ini menampilkan daftar stasiun MRT Jakarta serta jadwal keberangkatan kereta berdasarkan data resmi dari API MRT.  
Dibangun menggunakan **Go (Golang) + Gin** untuk backend, dan **React.js** untuk frontend.

##  Deskripsi
Aplikasi ini menyediakan:
- Daftar stasiun MRT Jakarta
- Jadwal keberangkatan per stasiun
- Tampilan frontend yang baik agar pengguna nyaman.
- Dapat melakukan pencarian stasiun dan jadwal.

## Teknologi yang Digunakan

### Backend
- Go (Golang)
- Gin framework ([github.com/gin-gonic/gin](https://github.com/gin-gonic/gin))
- CORS middleware ([github.com/gin-contrib/cors](https://github.com/gin-contrib/cors))
- Go Modules

### Frontend
- React.js
- CSS

### Lainnya
- REST API
- JSON

## Fitur
- Menampilkan daftar stasiun MRT Jakarta
- Aplikasi akan menampilkan jadwal berikutnya dari waktu user.
- Melihat jadwal keberangkatan kereta berdasarkan **Station ID (nid)**
- Fitur untuk filter stasiun dan jadwal.
- Akan terus dikembangkan.......

## Intruksi setup
- git clone https://github.com/sandysormin19/jadwal-MRT.git
- cd backend
- go run main.go

##Penjelasan AI Support
Sebagian besar kode backend dan frontend dibantu dengan AI (IBM Granite & ChatGPT) 
untuk mempercepat pembuatan boilerplate, integrasi API, serta penyusunan frontend sederhana.

