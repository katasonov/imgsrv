//var MAIN_DOMAIN = "http://sexytabs.com";
//var MAIN_IMG_DOMAIN  = "http://sexytabs.com";
var MAIN_DOMAIN = "http://62.109.7.27:8080/";
var MAIN_IMG_DOMAIN  = "http://62.109.7.27:8080/";

var TabFilterList = ["chrome-extension://*/newtab.html", "chrome://newtab/"];


    function getNextWord(str, startId) {
        var be = [startId, startId];
        while (startId < str.length && (str.charAt(startId) == ' ' || str.charAt(startId) == '\t')) {
          startId++;
        }

        if (!(startId < str.length))
          return be;

        be[0] = startId;

        while (startId < str.length + 1 && !(str.charAt(startId) == ' ' || str.charAt(startId) == '\t')) {
          startId++;
        }

        be[1] = startId;

        return be;

      }
      
    filterInt = function (value) {
    if(/^(\-|\+)?([0-9]+|Infinity)$/.test(value))
      return Number(value);
    return NaN;
    }

  function parseCategories(categoriesAsStr) {
    var categoriesJson = [];
    var addedAllSubCats = {};

    var lines = categoriesAsStr.match(/[^\r\n]+/g);
    //console.log("Found category lines: " + lines.length);
    
    categoriesJson.push({parentId: 1, id: 0, name: "Все категории"});

    for(var i = 0;i < lines.length;i++){
        //code here using lines[i] which will give you each line        
        be = getNextWord(lines[i], 0);
        var parentId = lines[i].substring(be[0], be[1]);
        be = getNextWord(lines[i], be[1]);
        var id = lines[i].substring(be[0], be[1]);
        var name = lines[i].substring(be[1]);

        if (parentId === "1" && !(addedAllSubCats[id] === true)) {
            categoriesJson.push({parentId: id, id: 0, name: "Все подкатегории"});
            addedAllSubCats[id] = true;
        }
        
        categoriesJson.push({parentId: parentId, id: id, name: name});
        //if (!(parentId === "1"))
        //    categoriesJson.push({parentId: 0, id: id, name: name});
    }
    //alert(categoriesJson);
    return categoriesJson;
  }

  function getFavoritesPicIdUrl(login, password) {
    var url = MAIN_DOMAIN + "components/getfav.support.php?";
    url = url + "action=getpicid&login=" + login + "&password=" + password + "&screen=" + screen.width + "x" + screen.height;
    return url;
  }

  function getCategoryPicIdUrl(catId, subId) {
    var url = MAIN_DOMAIN + "components/getcat.support.php?action=getpicid&";
    url = url + "cat=" + catId + "&subCat=" + subId + "&screen=" + screen.width + "x" + screen.height;
    return url;
  }