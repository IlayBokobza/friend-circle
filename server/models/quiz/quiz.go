package quiz

import (
	"context"
	"io"
	"time"

	"friends.ilaydev.com/database"
	"github.com/IlayBokobza/gover"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Quiz struct {
	Title   string             `json:"title"`
	ID      primitive.ObjectID `json:"id" bson:"_id"`
	Members []Member           `json:"members"`
	Owner   primitive.ObjectID `bson:"owner" json:"-"`
}

type QuizMinmal struct {
	Title   string             `json:"title"`
	ID      primitive.ObjectID `json:"id" bson:"_id"`
	Members []MemberMinimal    `json:"members"`
}

type Member struct {
	Name     string             `json:"name"`
	Email    string             `json:"email"`
	Password string             `json:"password"`
	Response Response           `json:"response"`
	ID       primitive.ObjectID `json:"id" bson:"_id"`
}

type MemberMinimal struct {
	Name string             `json:"name"`
	ID   primitive.ObjectID `json:"id" bson:"_id"`
}

type Response struct {
	Natrual     []primitive.ObjectID `json:"natrual"`
	Friend      []primitive.ObjectID `json:"friend"`
	GoodFriend  []primitive.ObjectID `json:"goodFriend"`
	CloseFriend []primitive.ObjectID `json:"closeFriend"`
}

func Create(title string, members []Member, owner primitive.ObjectID) (Quiz, error) {
	//creates context
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	//create member
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

func GetMemberFromBody(body io.ReadCloser) (Member, error) {
	var data, err = gover.DynamicJSONBodyParser(body)

	if err != nil {
		return *new(Member), err
	}

	var m = Member{}
	m.Name = data["name"].(string)
	m.Email = data["email"].(string)
	m.Password = data["password"].(string)
	m.Response = Response{
		Natrual:     []primitive.ObjectID{},
		Friend:      []primitive.ObjectID{},
		GoodFriend:  []primitive.ObjectID{},
		CloseFriend: []primitive.ObjectID{},
	}

	ID, err := primitive.ObjectIDFromHex(data["id"].(string))

	if err != nil {
		return *new(Member), err
	}

	m.ID = ID

	//format response
	var res = data["response"].(map[string]interface{})

	//naturals
	for _, idStr := range res["naturals"].([]interface{}) {
		mID, err := primitive.ObjectIDFromHex(idStr.(string))

		if err != nil {
			return *new(Member), err
		}

		m.Response.Natrual = append(m.Response.Natrual, mID)
	}

	//friends
	for _, idStr := range res["friends"].([]interface{}) {
		mID, err := primitive.ObjectIDFromHex(idStr.(string))

		if err != nil {
			return *new(Member), err
		}

		m.Response.Friend = append(m.Response.Friend, mID)
	}

	//good friends
	for _, idStr := range res["goodFriends"].([]interface{}) {
		mID, err := primitive.ObjectIDFromHex(idStr.(string))

		if err != nil {
			return *new(Member), err
		}

		m.Response.GoodFriend = append(m.Response.GoodFriend, mID)
	}

	//naturals
	for _, idStr := range res["closeFriends"].([]interface{}) {
		mID, err := primitive.ObjectIDFromHex(idStr.(string))

		if err != nil {
			return *new(Member), err
		}

		m.Response.CloseFriend = append(m.Response.CloseFriend, mID)
	}

	return m, nil
}
