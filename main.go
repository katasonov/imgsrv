package main

import(
    "net/http"
    "log"
    "os"
    "io/ioutil"
    "strings"
    "fmt"
    "image"
    "image/jpeg"
	"regexp"
	"strconv"
    	"github.com/gorilla/mux"
    "github.com/nfnt/resize"
	_ "github.com/gorilla/handlers"
)

const workingDirectory string = "/root/work/src/github.com/katasonov/imgsrv"

func handler(w http.ResponseWriter, r *http.Request) {
//    w.Write([]byte(resp))
}

func imageHandler(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    
    fmt.Printf("%s\n", vars["bg"])
	
    if !strings.HasSuffix(vars["bg"], ".jpg") {
            http.Error(w, "Wrong File Extension", http.StatusNotFound)
        return
    }
    file, err := ioutil.ReadFile("/root/work/data/" + vars["bg"])
    if err != nil {
	re := regexp.MustCompile("([0-9]+)-([0-9]+)x([0-9]+).jpg")
	reItems := re.FindAllStringSubmatch(vars["bg"], -1)
	if reItems == nil {
		http.Error(w, "File name format is invalid", http.StatusNotFound)
		return
	}
     	reader, err := os.Open("/root/work/data/" + reItems[0][1] + ".jpg")
   	if err != nil {
		http.Error(w, "No file", http.StatusNotFound)
		return
	}
	defer reader.Close()
	m, _, err := image.Decode(reader)
	if err != nil {
		
		http.Error(w, "No file", http.StatusNotFound)
		return
	}
	
	width,err := strconv.ParseUint(reItems[0][2], 10, 32)
	height,err := strconv.ParseUint(reItems[0][3], 10, 32)
	m2 := resize.Thumbnail(uint(width), uint(height), m, resize.Lanczos3);
	out, err := os.Create("/root/work/data/" + vars["bg"])
	if err != nil {
		
		http.Error(w, "Failed to get requested resolution file", http.StatusNotFound)
		return
	}

	defer out.Close()
	log.Println("Writing new jpeg file: " + vars["bg"]);
	jpeg.Encode(out, m2, nil)

	file, err = ioutil.ReadFile("/root/work/data/" + vars["bg"])
	
	if err != nil {
		
		http.Error(w, "File not found", http.StatusNotFound)
		return
	}

    }
    w.Header().Set("Content-type", "image/jpg")
    w.Write(file)
}


func ServeStatic(router *mux.Router, staticDirectory string) {
/*    staticPaths := map[string]string{
        "styles":           staticDirectory + "/styles/",
        "bower_components": staticDirectory + "/bower_components/",
        "images":           staticDirectory + "/images/",
        "scripts":          staticDirectory + "/scripts/",
	"": staticDirectory + "/",
    }
    for pathName, pathValue := range staticPaths {
        pathPrefix := "/" + pathName + "/"
        router.PathPrefix(pathPrefix).Handler(http.StripPrefix(pathPrefix,
            http.FileServer(http.Dir(pathValue))))
    }*/
	router.PathPrefix("/").Handler(http.StripPrefix("/",
            http.FileServer(http.Dir(staticDirectory))))
}


func main() {
	
	staticDirectory := workingDirectory + "/static"
//    http.Handle("/", http.StripPrefix("/", http.FileServer(http.Dir(staticDirectory))))

    r := mux.NewRouter()
    r.HandleFunc("/bg/{bg}", imageHandler)
	ServeStatic(r, staticDirectory)
//	loggedRouter := handlers.LoggingHandler(os.Stdout, r)
    http.Handle("/", r)

  //  err := http.ListenAndServe(":8080", loggedRouter)

	err := http.ListenAndServe(":8080", nil)
//err := http.ListenAndServe(":8080", http.FileServer(http.Dir("/root/work/data")))

    if err != nil {
        log.Println(err)
        os.Exit(1)
    }
}

