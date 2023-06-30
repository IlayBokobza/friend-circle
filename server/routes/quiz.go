package routes

import (
	"encoding/json"
	"net/http"

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

	ep = gover.Endpoint("/api/quizes/minimal")
	ep.Get(getQuizName)
	ep.Create()
}

func getQuizName(w http.ResponseWriter, r *http.Request, _ map[string]interface{}) {
	var idStr = r.URL.Query().Get("id")
	var ID, err = primitive.ObjectIDFromHex(idStr)

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}

	q, err := quiz.Get(ID)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			w.WriteHeader(http.StatusNotFound)
		} else {
			w.WriteHeader(http.StatusInternalServerError)
		}
		w.Write([]byte(err.Error()))
		return
	}

	w.Write([]byte(q.Title))
}

func getQuizes(w http.ResponseWriter, r *http.Request, md map[string]interface{}) {
	var owerID = md["id"].(primitive.ObjectID)
	var res, err = database.DB.Collection("quizes").Find(r.Context(), bson.M{"owner": owerID})

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
	err = res.All(r.Context(), &quizes)

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

	//check if user ownes quiz
	q, err := quiz.Get(ID)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			w.WriteHeader(http.StatusNotFound)
		} else {
			w.WriteHeader(http.StatusInternalServerError)
		}
		w.Write([]byte(err.Error()))
		return
	}

	if q.Owner != md["id"].(primitive.ObjectID) {
		w.WriteHeader(http.StatusUnauthorized)
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
