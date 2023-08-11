package routes

import (
	"encoding/json"
	"net/http"

	"friends.ilaydev.com/auth"
	"friends.ilaydev.com/models/user"
	"github.com/IlayBokobza/gover"
	"github.com/golang-jwt/jwt"
	"go.mongodb.org/mongo-driver/mongo"
)

func CreateUserRoutes() {
	// /user
	var ep = gover.Endpoint("/api/user")
	ep.Post(signup)
	ep.Get(getUser).Middleware(auth.Auth)
	ep.Create()

	//login
	var loginEp = gover.Endpoint("/api/user/login")
	loginEp.Post(login)
	loginEp.Create()
}

func signup(w http.ResponseWriter, r *http.Request, _ map[string]interface{}) {
	var res, _ = gover.DynamicJSONBodyParser(r.Body)
	var email = res["email"].(string)
	var name = res["name"].(string)
	var password = res["password"].(string)

	var u, err = user.Create(name, email, password)

	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}

	j, err := json.Marshal(u)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
	} else {
		w.Header().Set("Content-Type", "application/json")
		w.Write(j)
	}

}

func login(w http.ResponseWriter, r *http.Request, _ map[string]interface{}) {
	var res, _ = gover.DynamicJSONBodyParser(r.Body)
	var email = res["email"].(string)
	var password = res["password"].(string)
	var u, err = user.FindUsingEmail(email)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			w.WriteHeader(http.StatusBadRequest)
			w.Write([]byte("פרטים שגוים"))
		} else {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
		}
		return
	}

	if u.Password == user.HashPassword(password) {
		//check token
		_, err := jwt.Parse(u.Token, func(t *jwt.Token) (interface{}, error) { return []byte("secret"), nil })

		//if invaild create new one
		if err != nil {
			u.UpdateToken()
		}

		j, err := json.Marshal(u)

		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
		} else {
			w.Header().Set("Content-Type", "application/json")
			w.Write(j)
		}

	} else {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte("פרטים שגוים"))
	}
}

func getUser(w http.ResponseWriter, r *http.Request, md map[string]interface{}) {
	var j, err = json.Marshal(md)

	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	w.Write(j)
}
