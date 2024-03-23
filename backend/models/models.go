package models

type Collection struct {
	Id               string `json:"id"`
	Name             string `json:"name"`
	Description      string `json:"description"`
	ImageIpfsHash    string `json:"imageIpfsHash"`
	MetadataIpfsHash string `json:"metadataIpfsHash"`
	WalletAddress    string `json:"walletAddress"`
}

type Token struct {
	Id               string `json:"id" gorm:"primaryKey"`
	CollectionId     string `json:"collectionId"`
	Name             string `json:"name"`
	Description      string `json:"description"`
	ImageIpfsHash    string `json:"imageIpfsHash"`
	MetadataIpfsHash string `json:"metadataIpfsHash"`
	WalletAddress    string `json:"walletAddress"`
	Price            string `json:"price"`
}
