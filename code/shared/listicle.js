var urlDefaultListicleHtml = "http://fargo.io/code/shared/listicle.html";

document.write ("<script src=\"http://fargo.io/code/shared/xml.js\"></script>");
document.write ("<link rel=\"stylesheet\" type=\"text/css\" href=\"http://fargo.io/code/slick/slick.css\"/>");
document.write ("<link rel=\"stylesheet\" type=\"text/css\" href=\"http://fargo.io/code/slick/slick-theme.css\"/>");
document.write ("<link rel=\"stylesheet\" type=\"text/css\" href=\"http://fargo.io/code/slick/slick-theme.css\"/>");
document.write ("<script src=\"http://fargo.io/code/slick/slick.min.js\"></script>");
document.write ("<script src=\"http://fargo.io/code/shared/emojify.js\"></script>");
document.write ("<script src=\"http://fargo.io/code/storage/api.js\"></script>"); //2/8/17 by DW

var listiclePrefs = {
	ixCurrentCard: 0
	};
var listicleData = {
	"title": "Readme",
	"link": "http://listicle.io/readme.html", 
	"about": "This is a listicle. Still working on the software. Stay tuned. Dave",
	"urlBackgroundImage": "http://scripting.com/2017/01/03/containers.png",
	"opacityBackground": "0.6",
	"itemLabel": "Idea",
	"author": {
		"name": "Bull Mancuso",
		"email": "bullmancuso@gmail.com",
		"web": "http://bullmancuso.com/"
		},
	urlParamName: "idea",
	pageChangedCallback: listiclePageChanged,
	myUpdateSocket: undefined,
	opmlUrl: undefined,
	opmltext: undefined,
	tweetSerialnum: 0, //2/8/17 by DW
	urlTwitterServer: "http://twitter2.radio3.io:5342/",  //2/8/17 by DW
	status: {
		urlPrevBackground: undefined,
		prevHtmltext: undefined
		}
	};






function viewExpandedTweets () { //2/8/17 by DW
	$(".divTweetInListicle").each (function () {
		var idtweet = $(this).data ("idtweet");
		var idobject = $(this).attr ("id");
		console.log ("Found a tweet with id == " + idtweet + ". the id of the object == " + idobject);
		twViewTweet (idtweet, idobject, function () {
			$("#" + idobject).on ("load", function () { //the div holding for the tweet becomes visible when fully loaded
				$("#" + idobject).css ("visibility", "visible");
				});
			});
		});
	}
function xmlGetHtmlFromNode (adrx) { //2/8/17 by DW
	var typeatt = xmlGetAttribute (adrx, "type"), textatt = xmlGetTextAtt (adrx);
	console.log ("xmlGetHtmlFromNode: typeatt == " + typeatt + ", textatt == " + textatt);
	if (typeatt == "tweet") {
		var tweetUserName = xmlGetAttribute (adrx, "tweetUserName"), tweetId = xmlGetAttribute (adrx, "tweetId");
		var idDiv = "idTweetDiv" + listicleData.tweetSerialnum++;
		var tweetbody = "<div class=\"divTweetInListicle\" id=\"" + idDiv + "\" data-tweetusername=\"" + tweetUserName + "\" data-idtweet=\"" + tweetId + "\"></div>";
		return (tweetbody);
		}
	else {
		return (textatt);
		}
	}

function listicleSetupSlideOverlay (ixPageToAdjust) {
	var theTextObject = $("#idListiclePageText" + ixPageToAdjust);
	if (theTextObject.attr ("adjusted") === undefined) {
		var theOverlayObject = $("#idOverlay" + ixPageToAdjust);
		var  w = theTextObject.width (), h = theTextObject.height ();
		theOverlayObject.width (w);
		theOverlayObject.height (h);
		var textoffset = theTextObject.offset ();
		console.log ("listiclePageChanged: top == " + textoffset.top + ", left == " + textoffset.left);
		theTextObject.offset ({top:textoffset.top - h, left:textoffset.left})
		theTextObject.attr ("adjusted", "true"); //so it won't get adjusted again
		
		if (listicleData.opacityBackground !== undefined) {
			theOverlayObject.css ("opacity", listicleData.opacityBackground);
			}
		
		}
	}
function listiclePageChanged (ixnewpage) {
	listicleSetupSlideOverlay (ixnewpage);
	
	listiclePrefs.ixCurrentCard = ixnewpage;
	saveListiclePrefs ();
	updateListicleArrows ();
	}
function saveListiclePrefs () {
	var allPrefs;
	if (localStorage.listiclePrefsForAll != undefined) {
		allPrefs = JSON.parse (localStorage.listiclePrefsForAll);
		}
	else {
		allPrefs = new Object ();
		}
	allPrefs [window.location.href] = JSON.stringify (listiclePrefs); //no formatting
	localStorage.listiclePrefsForAll = jsonStringify (allPrefs);
	console.log ("saveListiclePrefs: " + allPrefs [window.location.href]);
	
	}
function restoreListiclePrefs (callback) {
	if (localStorage.listiclePrefsForAll != undefined) {
		var allPrefs = JSON.parse (localStorage.listiclePrefsForAll);
		if (allPrefs [window.location.href] != undefined) {
			listiclePrefs = JSON.parse (allPrefs [window.location.href]);
			console.log ("restoreListiclePrefs: " + allPrefs [window.location.href]);
			}
		}
	else {
		if (localStorage.listiclePrefs != undefined) {
			console.log ("restorePrefs: " + localStorage.listiclePrefs);
			listiclePrefs = JSON.parse (localStorage.listiclePrefs);
			}
		}
	
	
	twStorageData.urlTwitterServer = listicleData.urlTwitterServer;
	
	
	if (callback !== undefined) {
		callback ();
		}
	}
function updateListicleArrows () {
	var normalcolor = "white", disabledcolor = "gray";
	var leftarrowcolor, rightarrowcolor;
	
	console.log ("updateListicleArrows: listiclePrefs.ixCurrentCard == " + listiclePrefs.ixCurrentCard + ", listicleData.items.length == " + listicleData.items.length);
	
	if (listiclePrefs.ixCurrentCard == 0) {
		leftarrowcolor = disabledcolor;
		}
	else {
		leftarrowcolor = normalcolor;
		}
	
	if (listiclePrefs.ixCurrentCard == (listicleData.items.length - 1)) {
		rightarrowcolor = disabledcolor;
		}
	else {
		rightarrowcolor = normalcolor;
		}
	
	$("#idListicleLeftArrow").css ("color", leftarrowcolor);
	$("#idListicleRightArrow").css ("color", rightarrowcolor);
	}
function nextListicleItem () {
	$("#idSlickArray").slick ("slickNext");
	}
function prevListicleItem () {
	$("#idSlickArray").slick ("slickPrev");
	}
function getListicleItemHtmltext (ix) {
	var item = listicleData.items [ix];
	if (typeof (item) == "string") {
		return (item);
		}
	else {
		return (item.htmltext);
		}
	}
function homeListicleItem () {
	$("#idSlickArray").slick ("slickGoTo", 0, true);
	}
function listicleTwitterIconClick () {
	var url = window.location.href, onebasedcardnum = listiclePrefs.ixCurrentCard + 1;
	if (stringContains (url, "?")) {
		url = stringNthField (url, "?", 1);
		}
	url += "?" + listicleData.urlParamName + "=" + onebasedcardnum;
	
	var cluetext = stripMarkup (getListicleItemHtmltext (listiclePrefs.ixCurrentCard));
	var text = encodeURIComponent (listicleData.itemLabel + " #" + onebasedcardnum + ": " + cluetext + " " + url);
	window.open ("https://twitter.com/intent/tweet?text=" + text, "_blank", "left=200,top=300,location=no,height=350,width=600,scrollbars=no,status=no");
	}
function listicleInfoIconClick () {
	alertDialog (listicleData.about);
	}
function listicleEverySecond () {
	function watchForChange (urlToWatch, callback) {
		if (listicleData.myUpdateSocket === undefined) {
			listicleData.myUpdateSocket = new WebSocket (listicleData.urlUpdateSocket); 
			listicleData.myUpdateSocket.onopen = function (evt) {
				var msg = "watch " + urlToWatch;
				console.log ("sending: \"" + msg + "\"");
				listicleData.myUpdateSocket.send (msg);
				};
			listicleData.myUpdateSocket.onmessage = function (evt) {
				var s = evt.data;
				if (s !== undefined) { //no error
					var updatekey = "update\r";
					if (beginsWith (s, updatekey)) { //it's an update
						s = stringDelete (s, 1, updatekey.length);
						callback (s);
						}
					}
				};
			listicleData.myUpdateSocket.onclose = function (evt) {
				console.log ("listicleData.myUpdateSocket was closed.");
				listicleData.myUpdateSocket = undefined;
				};
			listicleData.myUpdateSocket.onerror = function (evt) {
				console.log ("listicleData.myUpdateSocket received an error");
				};
			}
		}
	if ((listicleData.urlUpdateSocket !== undefined) && (listicleData.opmlUrl !== undefined)) {
		watchForChange (listicleData.opmlUrl, function (opmltext) {
			console.log ("everySecond: websocket returned with opmltext.length == " + opmltext.length);
			listicleData.options.opmltext = opmltext;
			buildListicleFromTheData ();
			});
		}
	}
function buildListicleFromTheData (callback) {
	var options = listicleData.options;
	function startSlick () {
		var htmltext = "", indentlevel = 0;
		function add (s) {
			htmltext +=  filledString ("\t", indentlevel) + s + "\n";
			}
		if (listiclePrefs.ixCurrentCard === undefined) { //1/4/17 AM by DW
			listiclePrefs.ixCurrentCard = 0;
			}
		var slickOptions = {
			dots: false,
			accessibility: false, //we handle the keyboard
			infinite: false,
			variableWidth: false,
			initialSlide: listiclePrefs.ixCurrentCard,
			slidesToShow: 1,
			slidesToScroll: 1
			};
		for (var i = 0; i < listicleData.items.length; i++) { //build htmltext
			var label = listicleData.itemLabel, permalink = "?" + listicleData.urlParamName + "=" + (i + 1), item = listicleData.items [i], itemhtml, itemtitle = "";
			//set itemhtml, itemtitle
				if (typeof (item) == "string") {
					itemhtml = item;
					}
				else {
					itemhtml = item.htmltext;
					itemtitle = item.title;
					}
			add ("<div>"); indentlevel++;
			add ("<div class=\"divListiclePageTextOverlay\" id=\"idOverlay" + i + "\"></div>");
			add ("<div id=\"idListiclePageText" + i + "\">"); indentlevel++;
			add ("<div class=\"divListicleTextContainer\">"); indentlevel++;
			add ("<div class=\"divListiclePermalink\" ><a href=\"" + permalink + "\">" + label + " #" + (i + 1) + ":</a></div>");
			
			if (itemtitle.length > 0) {
				add ("<div class=\"divListitcleItemTitle\">" + itemtitle + "</div>");
				}
			
			add ("<div class=\"divListicleText\">" + emojiProcess (itemhtml) + "</div>");
			add ("</div>"); indentlevel--;
			add ("</div>"); indentlevel--;
			add ("</div>"); indentlevel--;
			}
		$("#idSlickArray").append (htmltext);
		$("#idSlickArray").slick (slickOptions);
		$("#idSlickArray").on ("beforeChange", function (event, slick, currentSlide, nextSlide){
			listicleData.pageChangedCallback (nextSlide);
			});
		}
	function startBackground () {
		if (listicleData.urlBackgroundImage !== undefined) {
			if (listicleData.urlBackgroundImage !== listicleData.status.urlPrevBackground) {
				$("#idListicleBackgroundImage").css ("background-image", "url(" + listicleData.urlBackgroundImage + ")");
				}
			}
		}
	function startCallback () {
		if (options.pageChangedCallback !== undefined) {
			listicleData.pageChangedCallback = options.pageChangedCallback;
			}
		}
	function startTitle () {
		var rtlink = "<span class=\"spInfoLink\"><a onclick=\"listicleTwitterIconClick ()\" title=\"Send this clue to your Twitter followers.\"><i class=\"fa fa-twitter\"></i></a></span>"
		var infolink = "<span class=\"spInfoLink\"><a onclick=\"listicleInfoIconClick ()\"><i class=\"fa fa-info-circle\"></i></a></span>";
		var homelink = "<span class=\"spHomeLink\"><a onclick=\"homeListicleItem ()\"><i class=\"fa fa-home\"></i></a></span>";
		var titlelink =  "<a href=\"" + listicleData.link + "\" target=\"_blank\">" + listicleData.title + "</a>"
		
		if (listicleData.author.name != undefined) {
			titlelink = listicleData.author.name + ": " + titlelink;
			}
		
		$("#idTitle").html (homelink + titlelink + infolink + rtlink);
		}
	function startKeyboard () {
		$("body").keyup (function (ev) {
			console.log ("keyup == " + ev.which);
			switch (ev.which) {
				case 37: //left arrow
					prevListicleItem ();
					break;
				case 39: //right arrow
					nextListicleItem ();
					break;
				}
			});
		}
	function startArrows () {
		updateListicleArrows ();
		}
	function startOverlay () {
		listicleSetupSlideOverlay (listiclePrefs.ixCurrentCard);
		}
	function startUrlParam () { //5/10/17 by DW
		var urlparam = getURLParameter (listicleData.urlParamName);
		if (urlparam != "null") { //if there's an url param, it overrides pref
			listiclePrefs.ixCurrentCard = Number (urlparam) - 1;
			}
		}
	function readListicleHtml (callback) {
		if (getBoolean (options.flCustomHtml)) {
			if (callback !== undefined) {
				callback ();
				}
			}
		else {
			readHttpFileThruProxy (urlDefaultListicleHtml, undefined, function (s) {
				if (s === undefined) { 
					alertDialog ("There was a problem reading the listicle HTML code.");
					}
				else {
					if (s !== listicleData.status.prevHtmltext) {
						$("#" + options.idContainer).html (s);
						}
					if (callback !== undefined) {
						callback ();
						}
					}
				});
			}
		}
	function startFromListicleData () {
		startUrlParam (); //5/10/17 by DW
		startCallback ();
		startBackground ();
		startTitle ();
		startSlick ();
		startArrows ();
		startKeyboard ();
		startOverlay ();
		viewExpandedTweets (); //2/8/17 by DW
		self.setInterval (listicleEverySecond, 1000); //1/6/17 by DW
		if (callback !== undefined) {
			callback ();
			}
		}
	restoreListiclePrefs (function () {
		readListicleHtml (function () {
			function startFromOpmltext (opmltext) {
				function getHeadElements (adrhead, adrdata) {
					$(adrhead).children ().each (function () {
						var name = $(this).prop ("nodeName");
						if (name.length > 0) {
							var val = $(this).prop ("textContent");
							adrdata [name] = val;
							}
						});
					if (adrdata.authorName !== undefined) {
						adrdata.author.name = adrdata.authorName;
						}
					if (adrdata.authorEmail !== undefined) {
						adrdata.author.email = adrdata.authorEmail;
						}
					if (adrdata.authorWeb !== undefined) {
						adrdata.author.web = adrdata.authorWeb;
						}
					}
				function outlineToJson (adrx, subsArray) { //convert an <outline> to a JSON object
					var indentlevel = 0;
					function getSubHtml (adrx, flExcludeTextOfHead) {
						var htmltext = "";
						function add (s) {
							htmltext +=  filledString ("\t", indentlevel) + s + "\n";
							}
						
						if (indentlevel === 0) {
							if (!flExcludeTextOfHead) {
								add ("<p>" + xmlGetHtmlFromNode (adrx) + "</p>");
								}
							}
						else {
							add ("<li>" + xmlGetHtmlFromNode (adrx) + "</li>");
							}
						
						if (xmlHasSubs (adrx)) {
							if (!flExcludeTextOfHead) {
								add ("<ul>"); indentlevel++
								}
							
							xmlOneLevelVisit (adrx, function (adrsub) {
								add (getSubHtml (adrsub));
								return (true);
								});
							
							if (!flExcludeTextOfHead) {
								add ("</ul>"); indentlevel--
								}
							}
						return (htmltext);
						}
					$(adrx).children ("outline").each (function () {
						if (xmlHasSubs (this) && (xmlCountSibs (this) == 0)) {
							subsArray [subsArray.length] = {
								title: xmlGetTextAtt (this),
								htmltext: getSubHtml (this, true)
								};
							}
						else {
							subsArray [subsArray.length] = getSubHtml (this);
							}
						});
					}
				var xstruct = $($.parseXML (opmltext));
				var adropml = xmlGetAddress (xstruct, "opml");
				var adrhead = xmlGetAddress (adropml, "head");
				var adrbody = xmlGetAddress (adropml, "body");
				var adrbody = getXstuctBody (xstruct);
				listicleData.items = [];
				outlineToJson (adrbody, listicleData.items);
				getHeadElements (adrhead, listicleData);
				listicleData.opmlUrl = options.opmlUrl; //1/6/17 by DW
				startFromListicleData ();
				}
			if (options.opmltext !== undefined) {
				startFromOpmltext (options.opmltext);
				}
			else {
				if (options.opmlUrl !== undefined) {
					readHttpFile (options.opmlUrl, function (opmltext) {
						startFromOpmltext (opmltext);
						})
					}
				else {
					if (options.jsonUrl !== undefined) {
						readHttpFile (options.jsonUrl, function (jsontext) {
							var jstruct = JSON.parse (jsontext);
							for (var x in jstruct) {
								listicleData [x] = jstruct [x];
								}
							startFromListicleData ();
							})
						}
					}
				}
			});
		});
	}
function startListicle (options, callback) {
	listicleData.options = options;
	buildListicleFromTheData (callback);
	}
