package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/sandysormin19/Jadwal-MRT/modules/station"
	"time" // import the time package
)

func main() {
	InitiateRouter()
}

func InitiateRouter() {
	router := gin.Default()

	
	//Konfigurasi CORS
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"}, 
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	api := router.Group("/v1/api")
	station.Initiate(api)

	router.Run(":8080")
}
