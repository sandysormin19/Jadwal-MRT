package main

import (
		"github.com/sandysormin19/Jadwal-MRT/modules/station"
		"github.com/gin-gonic/gin"
)

func main() {
	InitiateRouter()

	
	// Entry point of the application
}
func InitiateRouter(){
	var(
		router = gin.Default()
		api = router.Group("/v1/api")
	)

	station.Initiate(api)

	router.Run(":8080")
}
