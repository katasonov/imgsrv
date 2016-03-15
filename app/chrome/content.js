//console.log = function (){}
var intervalId = 0;

var newtabBackgroundColorRemoved = false;


var popupSelectedItem = -1;

function handleKeyUpDownOnPopup(direction) {
	if (direction != "up" && direction != "down") {
		return;
	};
	if ($("#popup").css("display") == "none")
		return;
	console.log(direction);
	//$( "*" ).removeClass("b-autocomplete-item_hovered_yes");
	var items = $("#hints-list").children();
	items.removeClass("b-autocomplete-item_hovered_yes");
	if (direction == "down")
		popupSelectedItem++;
	else
		popupSelectedItem--;
	if (popupSelectedItem < 0) {
		popupSelectedItem = 0;
	};
	if (popupSelectedItem >= items.length) {
		popupSelectedItem = items.length - 1;
	};
	items.eq(popupSelectedItem).addClass("b-autocomplete-item_hovered_yes");
	$("#uniq0").val(items.eq(popupSelectedItem).text());

}

function handleEnterKey() {
	var text = $("#uniq0").val();
	if (!(popupSelectedItem < 0 || $("#popup").css("display") == "none"))
	{
		if ($("#hints-list").children().eq(popupSelectedItem).attr("url").length > 0) {
			window.location.href = $("#hints-list").children().eq(popupSelectedItem).attr("url");
			return;
		}

		text = $("#hints-list").children().eq(popupSelectedItem).text();
	}
		
	window.location.href = "https://yandex.ru/search/?text=" + text + "&clid=2258262";
}


$(function() {
	
	if (location.hostname != MAIN_DOMAIN)
	{

	    console.log( "ready!" );

	    $("#uniq0").focus();

	    $(".b-form-button__content").click(function () {
	    	window.location.href = "https://yandex.ru/search/?text=" + $("#uniq0").val() + "&clid=2258262";
	    });

		$( window ).resize(function() {
		  if ($( window ).width() < $(".b-search__table").width() + 200) {
		  	$(".b-search__table").width($( window ).width() - 200);
		  } else {
		  	var width = $( window ).width() - 200;
		  	if (width > 705)
		  		width = 705;
		  	$(".b-search__table").width(width.toString() + "px");
		  }
		  //console.log("<div>" + $( window ).width() + "</div>");
		});


	    $(document).keydown(function(e) {
		    switch(e.which) {
		        case 37: // left
		        break;

		        case 38: handleKeyUpDownOnPopup("up");e.preventDefault()// up
		        break;

		        case 39: // right
		        break;

		        case 40: handleKeyUpDownOnPopup("down");e.preventDefault()// down
		        break;

		        case 13: handleEnterKey();e.preventDefault()
		        break;

		        default: return; // exit this handler for other keys
		    }
		    //e.preventDefault(); // prevent the default action (scroll / move caret)
		});

	    $('#uniq0').on('propertychange input', function (e) {
		    
		    var valueChanged = false;

		    if (e.type=='propertychange') {
		        valueChanged = e.originalEvent.propertyName=='value';
		    } else {
		        valueChanged = true;
		    }
		    if (valueChanged) {       
				var val = $('#uniq0').val();
				$.ajax({
					dataType: "text",
					url: "https://suggest.yandex.ru/suggest-ya.cgi?part=" + $('#uniq0').val(),
					success: function (data) {
						//console.log(data);
						var array = JSON.parse(data.match(/suggest.apply\(\[.*?(\[.*?\]).*/)[1]);
						var link = JSON.parse(data.match(/suggest.apply\(.*(\[.*?\])\)/)[1]);
						
						$("#hints-list").html("");
						popupSelectedItem = -1;
						if (array.length > 0)
							$("#popup").css("display", "block");
						else
							$("#popup").css("display", "none");

						var isValid = function(s) {
						    return !(/[а-яА-ЯЁё]/.test(s));
						};

						if (link.length > 0) {
							var url = link[1];

							if (url.indexOf("http://") > -1)
								url = url.substring(7,url.length);
							if (url.indexOf("https://") > -1)
								url = url.substring(8,url.length);

							var urlFavicon = url;
							if (!isValid(urlFavicon))
							{
								console.log("url: " + urlFavicon);
								urlFavicon = punycode.encode(urlFavicon);
							}

							var text = link[0];

							if (text.length > 48) {
								text = text.substring(0, 45);
								text = text + "...";
							};

							var item = $("<li url=\"" + "http://" + link[1] + 
								"\" class=\"b-autocomplete-item b-autocomplete-item_type_text b-autocomplete-item_index_0 i-bem \
								b-autocomplete-item_js_inited\"><div><span style=\"color:blue;text-decoration:underline;\">" + url + 
								"</span>  <div style=\"padding:0;padding-left:8px;padding-right:8px;height:100%;vertical-align:middle; \
								display:inline-block;line-height:0px;height:16px;padding-bottom:2px;\"><img src=\"http://favicon.yandex.net/favicon/" + urlFavicon + "\"/> </div>" + 
								"<div style=\"display:inline;color:#999;font-size:16px;text-overflow: ellipsis;\">" + text + "</div></div></li>");
							item.mouseenter( function() {
								popupSelectedItem = $(this).index("li");
								//console.log(popupSelectedItem);
								$("#hints-list").children().removeClass("b-autocomplete-item_hovered_yes");
								$(this).addClass("b-autocomplete-item_hovered_yes");
							}).mouseleave( function() {
								$(this).removeClass("b-autocomplete-item_hovered_yes");
							});
							item.click(function () {
								window.location.href = "http://" + link[1];
							});
							$("#hints-list").append(item);							
						}


						for(var i = 0; i < array.length && i < 5; i++)
						{
							var item = $("<li class=\"b-autocomplete-item b-autocomplete-item_type_text b-autocomplete-item_index_0 i-bem b-autocomplete-item_js_inited\">" + array[i] + "</li>");
							item.mouseenter( function() {
								popupSelectedItem = $(this).index("li");
								//console.log(popupSelectedItem);
								$("#hints-list").children().removeClass("b-autocomplete-item_hovered_yes");
								$(this).addClass("b-autocomplete-item_hovered_yes");
							}).mouseleave( function() {
								$(this).removeClass("b-autocomplete-item_hovered_yes");
							});
							item.click(function () {
								window.location.href = "https://yandex.ru/search/?text=" + $(this).text() + "&clid=2258262";
							});
							$("#hints-list").append(item);
						}
						//console.log($("#hints-list").html());
					}
				});
		    }
		});
	}
});



(function(){

	if (location.hostname != MAIN_DOMAIN)
	{

		console.log("content script ready");





		chrome.runtime.onMessage.addListener(function (msg) {
			console.log("On Message");
			if (msg.name === "reloadBackgroundMessage") {
				console.log("on reloadBackgroundMessage");
				//setNewImage();
				setImage(msg.picid);
			}
		});

		chrome.storage.local.get("needReload", function (items) {		
			needReload = items.needReload;
			if (needReload && needReload === 1) {
				console.log("needReload");
				setNewImage();
				chrome.storage.local.set({"needReload": 0});			
			}
			else {
				chrome.storage.local.get("autochange", function (items) {				
					autochange = items.autochange;
					if (autochange) {					
						if (autochange.type === "static") {
							console.log("autochange static");
							chrome.storage.local.get("picid", function (items) {
								picid = items.picid;
								if (picid) {
									setImage(picid);
								}
								else {
									setNewImage();
								}
							});
						}
						else if (autochange.type === "period") {
							console.log("autochange period");
							periodSec = getPeriodInSecByPeriodName(autochange.period);
							console.log("periodSec " + periodSec);
							chrome.storage.local.get("imageStartTimeInSec", function (items) {
								imageStartTimeInSec = items.imageStartTimeInSec;
								console.log("imageStartTimeInSec " + imageStartTimeInSec);
								var n = new Date().getTime()/1000;
								if (imageStartTimeInSec && (n - imageStartTimeInSec < periodSec)) {
									console.log("take loaded image");
									chrome.storage.local.get("picid", function (items) {
										picid = items.picid;
										console.log("picid len = " + picid.length);
										if (picid) {
											setImage(picid);
										}
										else {
											setNewImage();
										}
									});
									return;
								}
								setNewImage();
								chrome.storage.local.set({"imageStartTimeInSec": n});
							});
						} 
						else if (autochange.type === "onstart") {
							console.log("autochange onstart");
							setNewImage();			
						}
					} else {
						//This is on plugin install.
						//setImage(72849);
					}
				});
			}
		});

		function setNewImage() {
			console.log("setNewImage");

			chrome.storage.local.get("source", function (items) {
				source = items.source;
				if (source) {
					if (source.type === "favorites") {
						setFromFavorites();					
						return;
					}
				} 
				setFromCategory();			
			});
		}

		function setFromFavorites() {		
			console.log("setFromFavorites");
			//url = MAIN_DOMAIN + "components/getfav.support.php?";
			chrome.storage.local.get("login", function (items) {
				login = items.login;
				if (login) {
					//url = url + "action=getpicid&login=" + login.name + "&password=" + login.password + "&screen=" + screen.width + "x" + screen.height;
					var url = getFavoritesPicIdUrl(login.name, login.password);				
					chrome.runtime.sendMessage({name: "MsgRequestNewPicID", url: url}, function(response) {
						console.log("got new picid = " + response.picid);
						setImage(response.picid);
					});

				}
			});
		}

		function setFromCategory() {
			console.log("setFromCategory");
			//url = MAIN_DOMAIN + "components/getcat.support.php?action=getpicid&";
			chrome.storage.local.get("selectedCategory", function (items) {
				selectedCategory = items.selectedCategory;
				if (selectedCategory) {
					//url = url + "cat=" + selectedCategory.id + "&subCat=" + selectedCategory.subId + "&screen=" + screen.width + "x" + screen.height;
					var url = getCategoryPicIdUrl(selectedCategory.id, selectedCategory.subId);
					console.log("requesting new picid");	
					chrome.runtime.sendMessage({name: "MsgRequestNewPicID", url: url}, function(response) {
						console.log("got new picid = " + response.picid);
						setImage(response.picid);
					});
				};
			});
		}


		function setImage(picid) {
			//var imgs = ["https://pp.vk.me/c628019/v628019336/2b0e7/SiwbveYRNpk.jpg", "https://httpsnow.org/doc/images/https.png"];//MAIN_IMG_DOMAIN + "picd/" + picid + "/" + screen.width + "x" + screen.height + ".jpg";
			//var url = imgs [Math.floor((Math.random()*2))];
			$.ajax({
				dataType: "text",
				url: MAIN_DOMAIN + "/picd_img?id=" + picid + "&screen=" + screen.width + "x" + screen.height,
				success: function (data) {
					var url = MAIN_IMG_DOMAIN + data;
					console.log("setImage: " + url);
					updateDOM(url);
					//if (intervalId != 0)
					//	clearInterval(intervalId);
					//intervalId = setInterval(function () { updateDOM(url); }, 500);		
				}
			});
		}

		function restoreGMail() {
		}

		function updateDOM(imageUrl) {
			
			var body = document.getElementsByTagName('body')[0];
			$("body").css("background-image", "url(" + imageUrl + ")");
			/*

			chrome.storage.local.get("pages", function (items) {
				var pages = items.pages;

			    if (!pages) {
			       pages = {google: true, gmail: true};
			       chrome.storage.local.set({pages: pages});
			    }

				if (window.location.href.indexOf("mail.google") > -1) {
					if (pages.gmail) {
						$("body").css("background-image", "url(" + imageUrl + ")");
						$("body").css("background-size", "cover");

						$(".nH.w-asV.aiw").css("opacity", "0.8");
						$(".vI8oZc.cS").css("opacity", "0.8");
						$(".vI8oZc.cN").css("opacity", "0.8");
						//$(".nH.w-asV.aiw").css("background-color", "rgba(0, 0, 0, 0)");
						//$(".vI8oZc.cS").css("background-color", "rgba(0, 0, 0, 0)");
						$(".gb_Sd.gb_Me").css("background-color", "rgba(0, 0, 0, 0)");
						$("#\\:4").css("background-color", "rgba(0, 0, 0, 0)");
						$(".Bu").css("background-color", "rgba(0, 0, 0, 0)");			
						$(".zA.yO").css("background-color", "rgba(0, 0, 0, 0)");
					}
					else {
						restoreGMail();
					}
				}
				else  if($(location).attr('href').indexOf("q=")==-1&&$(location).attr('href').indexOf("sourceid=chrome-instant")==-1) {
					if (pages.google) {
						if (location.href.indexOf("chrome/newtab") > -1) {
							$("body").css("background-color", "");
							if (!newtabBackgroundColorRemoved)
								setTimeout( function () {
									$("html").width('100%').height('100%');
									$("html").css("background-image", "url(" + imageUrl + ")");								
									$("html").css("background-size", "cover");
								}, 500);
							else
							{
								$("html").width('100%').height('100%');
								$("html").css("background-image", "url(" + imageUrl + ")");
								$("html").css("background-size", "cover");							
							}
						} else {
							$("body").css("background-image", "url(" + imageUrl + ")");
							$("body").css("background-size", "cover");
						}
					} else{
						$("body").css("background-image", "");
						$("body").css("background-size", "auto");
					}

					//$("#viewport").css("opacity", "1");
					//$("#viewport").css("background-color", "white");
				}
			    else if($(location).attr('href').indexOf("q=")>-1 || $(location).attr('href').indexOf("sourceid=chrome-instant")> -1){
		    		$("body").css("background-image", "");
					$("body").css("background-size", "auto");

					$("#viewport").css("opacity", "1.0");
					$("#viewport").css("background-color", "");
			    }

			    if (body.className.match('srp')) {
			    	console.log("start searching");
			    	$("body").css("background-image", "");
					$("body").css("background-size", "auto");

					$("#viewport").css("opacity", "1.0");
					$("#viewport").css("background-color", "");
			    }


			});*/

		}



	/*
		function convertToDataURLviaCanvas(url, callback, outputFormat){
		    var img = new Image();
		    img.crossOrigin = 'Anonymous';
		    img.onload = function(){
		        var canvas = document.createElement('CANVAS');
		        var ctx = canvas.getContext('2d');
		        var dataURL;
		        canvas.height = this.height;
		        canvas.width = this.width;
		        ctx.drawImage(this, 0, 0);
		        dataURL = canvas.toDataURL(outputFormat);
		        callback(dataURL);
		        canvas = null; 
		    };
		    img.onerror = function(){
		    	chrome.storage.local.set({"needReload": 1});
		    	chrome.storage.local.get("base64Image", function (items) {
					base64Image = items.base64Image;
					if (base64Image) {
						setImage(base64Image);
					}
				});
		    }
		    img.src = url;
		}*/

		function getPeriodInSecByPeriodName(periodName) {
			if (periodName === "hour") {
				return 3600;
			} 
			else if (periodName === "day") {
				return 3600*24;
			} 
			else if (periodName === "week") {
				return 3600*24*7;
			} 
			else if (periodName === "month") {
				return 3600*24*7*30;
			} 
			else {
				return 3600;
			}
		}
	}
})();

