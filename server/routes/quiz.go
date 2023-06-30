package routes

import (
	"net/http"

	"friends.ilaydev.com/auth"
	"friends.ilaydev.com/models/quiz"
	"github.com/IlayBokobza/gover"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func CreateQuizRoutes() {
	var ep = gover.Endpoint("/api/quizes")
	ep.Get(getQuizes).Middleware(auth.Auth)
	ep.Post(postQuiz).Middleware(auth.Auth)
	ep.Patch(patchQuiz).Middleware(auth.Auth)
	ep.Create()
}

func getQuizes(w http.ResponseWriter, r *http.Request, md map[string]interface{}) {
	// 	var owerID = md["id"].(primitive.ObjectID)

	// 	q, err := quiz.Get(owerID)

	// 	if err != nil {
	// 		if err == mongo.ErrNoDocuments {
	// 			w.WriteHeader(http.StatusNotFound)
	// 		} else {
	// 			w.WriteHeader(http.StatusInternalServerError)
	// 		}
	// 		w.Write([]byte(err.Error()))
	// 		return
	// 	}

	// 	fmt.Println(q.Title)
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

}
