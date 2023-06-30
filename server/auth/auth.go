package auth

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"friends.ilaydev.com/database"
	"friends.ilaydev.com/models/user"
	"github.com/IlayBokobza/gover"
	"github.com/golang-jwt/jwt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// auth middleware
func Auth(w http.ResponseWriter, r *http.Request, md *gover.MiddlewareData) bool {
	var c, err = r.Cookie("token")

	if err != nil {
		if err == http.ErrNoCookie {
			w.WriteHeader(http.StatusUnauthorized)
			w.Write([]byte("No token"))
		} else {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
		}

		return false
	}

	claims := jwt.MapClaims{}
	_, err = jwt.ParseWithClaims(c.Value, claims, func(t *jwt.Token) (interface{}, error) { return []byte("secret"), nil })

	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(err.Error()))
		return false
	}

	ID, err := primitive.ObjectIDFromHex(claims["ID"].(string))

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return false
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var user user.User
	err = database.DB.Collection("users").FindOne(ctx, bson.M{"_id": ID}).Decode(&user)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			w.WriteHeader(http.StatusNotFound)
			fmt.Println(ID)
			w.Write([]byte("No user found with this token's id"))
		} else {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
		}

		return false
	}

	(*md)["email"] = user.Email
	(*md)["id"] = ID
	(*md)["name"] = user.Name

	return true
}
