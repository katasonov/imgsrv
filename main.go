package main

import(
    "net/http"
    "log"
    "os"
    "io/ioutil"
    "strings"
    "fmt"
    "github.com/gorilla/mux"
)

const resp = `<html>
    <head>
        <title>Simple Web App</title>
    </head>
    <body>
        <h1>Simple Web App</h1>
        <p>Hello World!</p>
    </body>
</html>`

func handler(w http.ResponseWriter, r *http.Request) {
    w.Write([]byte(resp))
}

func pngHandler(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    
    fmt.Printf("%s\n", vars["item"])
	
    if !strings.HasSuffix(vars["item"], ".jpg") {
            http.Error(w, "Wrong File Extension", http.StatusNotFound)
        return
    }
    file, err := ioutil.ReadFile("/root/work/data/" + vars["item"])
    if err != nil {
        http.Error(w, err.Error(), http.StatusNotFound)
        return
    }
    w.Header().Set("Content-type", "image/jpg")
    w.Write(file)
}

func main() {
//    http.Handle("/", http.StripPrefix("/", http.FileServer(http.Dir("/root/work/data"))))

    r := mux.NewRouter()
    //http.HandleFunc("/", pngHandler)
    r.HandleFunc("/img/{item}", pngHandler)
    http.Handle("/", r)

    err := http.ListenAndServe(":8080", nil)

    if err != nil {
        log.Println(err)
        os.Exit(1)
    }
}

