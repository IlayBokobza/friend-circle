package routes

import (
	"encoding/json"
	"net/http"

	"friends.ilaydev.com/auth"
	"friends.ilaydev.com/database"
	"friends.ilaydev.com/models/quiz"
	"github.com/IlayBokobza/gover"
	"github.com/mitchellh/mapstructure"
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
	ep.Get(getQuizMinimal)
	ep.Post(quizLogin)
	ep.Patch(memberAnswer)
	ep.Create()
}

func memberAnswer(w http.ResponseWriter, r *http.Request, _ map[string]interface{}) {
	var idStr = r.URL.Query().Get("id")
	var member, err = quiz.GetMemberFromBody(r.Body)

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}

	ID, err := primitive.ObjectIDFromHex(idStr)

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

	//set response
	var isFound = false
	for i, m := range q.Members {
		if m.ID == member.ID {
			if m.Email == member.Email && m.Password == member.Password {
				isFound = true
				q.Members[i] = member
			}
			break
		}
	}

	if !isFound {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	_, err = database.DB.Collection("quizes").UpdateByID(r.Context(), ID, bson.M{"$set": q})

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}
}

func quizLogin(w http.ResponseWriter, r *http.Request, _ map[string]interface{}) {
	var idStr = r.URL.Query().Get("id")
	var data, err = gover.DynamicJSONBodyParser(r.Body)

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}

	ID, err := primitive.ObjectIDFromHex(idStr)

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

	var email = data["email"].(string)
	var password = data["password"].(string)
	for _, m := range q.Members {
		if m.Email == email {
			if m.Password == password {
				if len(m.Response.Natrual)+len(m.Response.Friend)+len(m.Response.CloseFriend)+len(m.Response.GoodFriend) != 0 {
					w.WriteHeader(http.StatusForbidden)
					w.Write([]byte("עניית כבר על השאלון"))
					return
				}
				j, err := json.Marshal(m)

				if err != nil {
					w.WriteHeader(http.StatusInternalServerError)
					w.Write([]byte(err.Error()))
					return
				}

				w.Write(j)
				return
			}
			break
		}
	}

	w.WriteHeader(http.StatusUnauthorized)
	w.Write([]byte("שם משתמש או סיסמה לא נכונים"))
}

func getQuizMinimal(w http.ResponseWriter, r *http.Request, _ map[string]interface{}) {
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

	var quizMini = quiz.QuizMinmal{
		Title:   q.Title,
		Members: []quiz.MemberMinimal{},
		ID:      q.ID,
	}
	//format data
	for _, m := range q.Members {
		quizMini.Members = append(quizMini.Members, quiz.MemberMinimal{Name: m.Name, ID: m.ID})
	}

	j, err := json.Marshal(quizMini)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	w.Write(j)
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
	var members = []quiz.Member{}
	for _, mRaw := range b["members"].([]interface{}) {
		var m = mRaw.(map[string]interface{})
		var response quiz.Response
		mapstructure.Decode(m["respone"], &response)

		members = append(members, quiz.Member{
			Name:     m["name"].(string),
			Email:    m["email"].(string),
			Password: m["password"].(string),
			Response: response,
			ID:       primitive.NewObjectID(),
		})
	}

	q, err := quiz.Create(b["title"].(string), members, ID)

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
