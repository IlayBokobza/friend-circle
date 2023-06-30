package routes

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"friends.ilaydev.com/auth"
	"friends.ilaydev.com/database"
	"friends.ilaydev.com/models/quiz"
	"github.com/IlayBokobza/gover"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func CreateQuizRoutes() {
	var ep = gover.Endpoint("/api/quizes")
	ep.Get(getQuizes).Middleware(auth.Auth)
	ep.Post(postQuiz).Middleware(auth.Auth)
	ep.Patch(patchQuiz).Middleware(auth.Auth)
	ep.Create()
}

func getQuizes(w http.ResponseWriter, r *http.Request, md map[string]interface{}) {
	//creates context
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var owerID = md["id"].(primitive.ObjectID)
	var res, err = database.DB.Collection("quizes").Find(ctx, bson.M{"owner": owerID})

	if err != nil {
		if err == mongo.ErrNoDocuments {
			w.WriteHeader(http.StatusNotFound)
		} else {
			w.WriteHeader(http.StatusInternalServerError)
		}
		w.Write([]byte(err.Error()))
		return
	}

	var quizes []quiz.Quiz
	err = res.All(ctx, &quizes)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	j, err := json.Marshal(quizes)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(j)
}

func postQuiz(w http.ResponseWriter, r *http.Request, md map[string]interface{}) {
	var b, err = gover.DynamicJSONBodyParser(r.Body)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	var ID = md["id"].(primitive.ObjectID)

	q, err := quiz.Create(b["title"].(string), b["members"].([]interface{}), ID)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	w.Write([]byte(q.ID.Hex()))
}

func patchQuiz(w http.ResponseWriter, r *http.Request, md map[string]interface{}) {
	var idStr = r.URL.Query().Get("id")
	var ID, err = primitive.ObjectIDFromHex(idStr)

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}

	data, err := gover.DynamicJSONBodyParser(r.Body)

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}

	_, err = database.DB.Collection("quizes").UpdateByID(r.Context(), ID, bson.M{"$set": data})

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}
}
