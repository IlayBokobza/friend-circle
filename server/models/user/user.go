package user

import (
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"log"
	"time"

	"friends.ilaydev.com/database"
	"github.com/golang-jwt/jwt"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type User struct {
	Name     string             `json:"name"`
	Email    string             `json:"email"`
	ID       primitive.ObjectID `bson:"_id" json:"id"`
	Token    string             `json:"token"`
	Password string             `json:"-"`
}

func Create(name string, email string, password string) (User, error) {
	//creates context
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	//check if email already is in use
	var _, err = FindUsingEmail(email)

	if err != nil {
		if err != mongo.ErrNoDocuments {
			//Error
			return *new(User), err
		}
	} else {
		//Email in use
		return *new(User), errors.New("איימל כבר בשימוש")
	}

	//hash password
	var hpass = HashPassword(password)

	//create jwt
	var ID = primitive.NewObjectID()
	t, err := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"ID": ID,
	}).SignedString([]byte("secret"))

	if err != nil {
		return *new(User), err
	}

	//create document
	res, err := database.DB.Collection("users").InsertOne(ctx, map[string]interface{}{
		"name":     name,
		"email":    email,
		"password": hpass,
		"_id":      ID,
		"token":    t,
	})

	if err != nil {
		return *new(User), err
	}

	return User{
		Name:     name,
		Email:    email,
		ID:       res.InsertedID.(primitive.ObjectID),
		Token:    t,
		Password: hpass,
	}, err
}

func FindUsingEmail(email string) (User, error) {
	//creates context
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var sres = database.DB.Collection("users").FindOne(ctx, map[string]string{
		"email": email,
	})

	var user User
	err := sres.Decode(&user)

	return user, err
}

func HashPassword(password string) string {
	var h = hmac.New(sha256.New, []byte("secret"))
	h.Write([]byte(password))
	var hpass = hex.EncodeToString(h.Sum(nil))
	return hpass
}

// methods
func (u *User) UpdateToken() {
	//creates context
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	u.Token, _ = jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"ID": u.ID,
	}).SignedString([]byte("secret"))

	var _, err = database.DB.Collection("users").UpdateByID(ctx, u.ID, bson.D{primitive.E{Key: "$set", Value: bson.D{primitive.E{Key: "token", Value: u.Token}}}})

	if err != nil {
		log.Panic(err.Error())
	}
}
