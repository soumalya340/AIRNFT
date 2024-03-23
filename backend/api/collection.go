package api

import (
	"airfnt/dbconfig"
	"airfnt/models"
	"fmt"
	"math/rand"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

type PostCollectionRequest struct {
	Name             string `json:"name"`
	Description      string `json:"description"`
	ImageIpfsHash    string `json:"imageIpfsHash"`
	WalletAddress    string `json:"walletAddress"`
	MetadataIpfsHash string `json:"metadataIpfsHash"`
}

type GetCollectionRequest struct {
	CollectionId string `json:"collectionId"`
}

func PostCollection(c *gin.Context) {
	var req PostCollectionRequest
	if err := c.BindJSON(&req); err != nil {
		logrus.Error("failed to bind request: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	gameIdInt := rand.Intn(900000) + 100000
	idStr := fmt.Sprint(gameIdInt)
	collection := models.Collection{
		Name:             req.Name,
		Description:      req.Description,
		ImageIpfsHash:    req.ImageIpfsHash,
		WalletAddress:    req.WalletAddress,
		Id:               idStr,
		MetadataIpfsHash: req.MetadataIpfsHash,
	}
	db := dbconfig.GetDb()
	if err := db.Model(&models.Collection{}).Create(&collection).Error; err != nil {
		logrus.Error("db err: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"collection": collection})

}

func GetCollection(c *gin.Context) {
	var req GetCollectionRequest
	if err := c.BindJSON(&req); err != nil {
		logrus.Error("failed to bind request: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	collection := models.Collection{}
	db := dbconfig.GetDb()
	if err := db.Model(&models.Collection{}).Where("collection_id =", req.CollectionId).First(&collection).Error; err != nil {
		logrus.Error("db err: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"collection": collection})

}

func GetCollections(c *gin.Context) {
	collections := []models.Collection{}
	db := dbconfig.GetDb()
	if err := db.Model(&models.Collection{}).Find(&collections).Error; err != nil {
		logrus.Error("db err: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"collections": collections})

}
