package main

import (
	"friends.ilaydev.com/database"
	"friends.ilaydev.com/routes"
	"github.com/IlayBokobza/gover"
)

func main() {
	database.ConnectToDB("mongodb://localhost:27017")
	routes.CreateUserRoutes()
	routes.CreateQuizRoutes()

	gover.Listen(3000)
}
