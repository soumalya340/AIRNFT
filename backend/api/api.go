package api

import "github.com/gin-gonic/gin"

func ApplyRoutes(r *gin.Engine) {
	r.POST("/collection", PostCollection)
	r.GET("/collection", GetCollection)
	r.GET("/collection/all", GetCollections)
	r.POST("/token", PostToken)
	r.GET("/token", GetToken)
	r.GET("/token/all/:id", GetTokens)
	r.GET("/token/all", AllTokens)
	r.POST("/token/buy", BuyToken)
}
