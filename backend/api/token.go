package api

import (
	"airfnt/dbconfig"
	"airfnt/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

type PostTokenRequest struct {
	CollectionId  string `json:"collectionId"`
	Name          string `json:"name"`
	Description   string `json:"description"`
	ImageIpfsHash string `json:"imageIpfsHash"`
	WalletAddress string `json:"walletAddress"`
	Price         string `json:"price"`
	Id            string `json:"id"`
}

type GetTokenRequest struct {
	CollectionId string `json:"collectionId"`
	TokenId      string `json:"tokenId"`
}

func PostToken(c *gin.Context) {
	var req PostTokenRequest
	if err := c.BindJSON(&req); err != nil {
		logrus.Error("failed to bind request: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	token := models.Token{
		CollectionId:  req.CollectionId,
		Name:          req.Name,
		Description:   req.Description,
		ImageIpfsHash: req.ImageIpfsHash,
		WalletAddress: req.WalletAddress,
		Price:         req.Price,
		Id:            req.Id,
	}
	db := dbconfig.GetDb()
	if err := db.Model(&models.Token{}).Create(&token).Error; err != nil {
		logrus.Error("db err: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"collection": token})

}

func GetToken(c *gin.Context) {
	var req GetTokenRequest
	if err := c.BindJSON(&req); err != nil {
		logrus.Error("failed to bind request: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	token := models.Token{}
	db := dbconfig.GetDb()
	if err := db.Model(&models.Token{}).Where("id =", req.TokenId).First(&token).Error; err != nil {
		logrus.Error("db err: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"collection": token})

}

func GetTokens(c *gin.Context) {
	coll_id := c.Param("id")
	tokens := []models.Token{}
	db := dbconfig.GetDb()
	if err := db.Model(&models.Token{}).Where("collection_id = ?", coll_id).Find(&tokens).Error; err != nil {
		logrus.Error("db err: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"tokens": tokens})
}

type BuyRequest struct {
	WalletAddress string `json:"walletAddress"`
	TokenId       string `json:"tokenId"`
}

func BuyToken(c *gin.Context) {
	var req BuyRequest
	if err := c.BindJSON(&req); err != nil {
		logrus.Error("failed to bind request: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	db := dbconfig.GetDb()
	// Retrieve the existing token from the database
	var token models.Token
	if err := db.Where("id = ?", req.TokenId).First(&token).Error; err != nil {
		logrus.Error("failed to find token: ", err)
		c.JSON(http.StatusNotFound, gin.H{"error": "token not found"})
		return
	}

	// Update the wallet address
	token.WalletAddress = req.WalletAddress

	// Save the updated token back to the database
	if err := db.Save(&token).Error; err != nil {
		logrus.Error("db err: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": "bought"})
}

func AllTokens(c *gin.Context) {
	tokens := []models.Token{}
	db := dbconfig.GetDb()
	if err := db.Model(&models.Token{}).Find(&tokens).Error; err != nil {
		logrus.Error("db err: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"tokens": tokens})
}
