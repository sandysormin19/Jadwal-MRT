package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/sandysormin19/Jadwal-MRT/modules/station"
)

func main() {
	// Optional: aktifkan release mode jika environment production
	if os.Getenv("GIN_MODE") == "release" {
		gin.SetMode(gin.ReleaseMode)
	}

	router := setupRouter()

	// Ambil port dari env (Railway akan inject PORT)
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080" // fallback untuk local
	}

	srv := &http.Server{
		Addr:    ":" + port,
		Handler: router,
	}

	// Run server in goroutine
	go func() {
		log.Printf("Server starting on :%s\n", port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("listen: %s\n", err)
		}
	}()

	// Graceful shutdown: tunggu SIGINT/SIGTERM
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutdown server...")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}

	log.Println("Server exiting")
}

func setupRouter() *gin.Engine {
	router := gin.Default()

	// Jangan trust semua proxy — set explicit (kosong = trust none)
	_ = router.SetTrustedProxies([]string{}) // prevents "trusted all proxies" warning

	// Baca ALLOW_ORIGINS dari env; default '*' untuk development
	allowOriginsEnv := os.Getenv("ALLOW_ORIGINS")
	var allowOrigins []string
	if allowOriginsEnv != "" {
		for _, o := range strings.Split(allowOriginsEnv, ",") {
			if s := strings.TrimSpace(o); s != "" {
				allowOrigins = append(allowOrigins, s)
			}
		}
	} else {
		allowOrigins = []string{"*"}
	}

	router.Use(cors.New(cors.Config{
		AllowOrigins:     allowOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// API routes
	api := router.Group("/v1/api")
	station.Initiate(api)

	// Optional: serve frontend build jika kamu memang menyertakan build di backend repo.
	// Set FRONTEND_BUILD_DIR env = "./frontend-build" kalau mau aktifkan.
	fbDir := os.Getenv("FRONTEND_BUILD_DIR")
	if fbDir != "" {
		router.Static("/static", fbDir+"/static")
		router.NoRoute(func(c *gin.Context) {
			c.File(fbDir + "/index.html")
		})
	}

	return router
}
