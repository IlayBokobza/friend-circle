package quiz

import (
	"context"
	"time"

	"friends.ilaydev.com/database"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Quiz struct {
	Title   string             `bson:"title"`
	ID      primitive.ObjectID `bson:"_id"`
	Members []Member           `bson:"members"`
	Owner   primitive.ObjectID `bson:"owner"`
}

type Member struct {
	Name     string             `bson:"name"`
	Email    string             `bson:"email"`
	Password string             `bson:"password"`
	ID       primitive.ObjectID `bson:"_id"`
	Response Response           `bson:"response"`
}

type Response struct {
	Natrual     []primitive.ObjectID `bson:"natrual"`
	Friend      []primitive.ObjectID `bson:"friend"`
	GoodFriend  []primitive.ObjectID `bson:"goodFriend"`
	CloseFriend []primitive.ObjectID `bson:"closeFriend"`
}

func Create(title string, members []interface{}, owner primitive.ObjectID) (Quiz, error) {
	//creates context
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var res, err = database.DB.Collection("quizes").InsertOne(ctx, bson.M{"owner": owner, "title": title, "members": members})

	if err != nil {
		return *new(Quiz), err
	}

	return Quiz{
		Title:   title,
		ID:      res.InsertedID.(primitive.ObjectID),
		Members: []Member{},
		Owner:   owner,
	}, nil
}

func Get(ID primitive.ObjectID) (Quiz, error) {
	//creates context
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var q Quiz
	var err = database.DB.Collection("quizes").FindOne(ctx, bson.M{"_id": ID}).Decode(&q)

	if err != nil {
		return *new(Quiz), err
	}

	return q, nil
}
