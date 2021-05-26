//---------------------------------------------------
// CONFIGURATION
//---------------------------------------------------
var largeFontSize = '120%';
var cookieName = 'fontsize';
var smElement = 'resizerSmImg';
var lgElement = 'resizerLgImg';
var smImgOnFilename = 'images/interface/resizer2SmOn.gif';
var smImgOffFilename = 'images/interface/resizer2Sm.gif';
var lgImgOnFilename = 'images/interface/resizer2LgOn.gif';
var lgImgOffFilename = 'images/interface/resizer2Lg.gif';
//---------------------------------------------------
// No need to change anything below here
//---------------------------------------------------
var lgImgOn = null;
var lgImgOff = null;
var smImgOn = null;
var smImgOff = null;
// Set up Event Listener - creates addEvent
function addEvent(elm, evType, fn, useCapture) {
    if (elm.addEventListener) {
    elm.addEventListener(evType, fn, useCapture);
    return true;
    } else if (elm.attachEvent) {
    var r = elm.attachEvent('on' + evType, fn);
    return r;
    } else {
    elm['on' + evType] = fn;
    }
}
function detectCookie()
{
    if (readCookie(cookieName) == 'large')
    {
        textResizerGoBig();
    }
    else
    {
        textResizerGoSmall();
    }
}
function textResizerInit() 
{
    // Initialize Scripts - is this a browser that understands DOM?
    if (textResizerScriptingOk())
    {
        // Does the text resizer div exist?
        if ( document.getElementById(smElement) == null || document.getElementById(lgElement) == null     )
        {
            return;
        }
        // add handlers to anchors
        addEvent( document.getElementById(smElement), 'click', textResizerGoSmall, false);
        addEvent( document.getElementById(lgElement), 'click', textResizerGoBig, false);
    }
}
function textResizerPrecacheImages()
{
    smImgOn = new Image();
    smImgOn.src = smImgOnFilename;
    smImgOff = new Image();
    smImgOff.src = smImgOffFilename;
    lgImgOn = new Image();
    lgImgOn.src = lgImgOnFilename;
    lgImgOff = new Image();
    lgImgOff.src = lgImgOffFilename;
}
function textResizerGoSmall()
{
    if (textResizerScriptingOk())
    {
        //default back to CSS fontsize
        document.body.style.fontSize = "";
        //get rid of cookie
        eraseCookie(cookieName);    
        //toggle images
        textResizerSetImage(false);
    }
}
function textResizerGoBig()
{
    if (textResizerScriptingOk())
    {
        document.body.style.fontSize = largeFontSize;
     
        if (readCookie(cookieName) != 'large')
        {
            createCookie(cookieName, 'large', 1);
        }    
        //toggle images
        textResizerSetImage(true);
    }    
}
function createCookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
}
function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {
    createCookie(name,"",-1);
}
function textResizerSetImage(useLarge)
{
    if (textResizerScriptingOk())
    {
        var smImg = document.getElementById(smElement);
        var lgImg = document.getElementById(lgElement);
        // check the images exist
        if ( smImg == null || lgImg == null     )
        {
            return;
        }
        if (useLarge)
        {
            lgImg.src = lgImgOn.src;
            smImg.src = smImgOff.src;
        }
        else
        {
            lgImg.src = lgImgOff.src;
            smImg.src = smImgOn.src;
        }
    }
}
function textResizerScriptingOk()
{
    return (document.getElementById);
}
function checkActive() {
    var a = document.getElementsByTagName("a");
    if (window.location.href.substr(location.href.length - 1, 1) == '/') {
        var loc = window.location.href + ''; 
    }
    else {
        var loc = window.location.href;
    }
    for(var i=0; i < a.length; i++) {
        if (a[i].href == loc) {
            a[i].setAttribute("class", "active");
            a[i].setAttribute("className", "active");
        }
    }
}

// add event to window load
addEvent(window, 'load', textResizerInit, false);
addEvent(window, 'load', checkActive, false);
// precache images
textResizerPrecacheImages();


// 
//
// convert links for webtrends.  
//
//
// apply the classname trackOnClick (case sensitive) to a link
// webtrends will then track that link.
//

function ConvertLink(objLink)
{
    var url = objLink.href;
    var splitURL = url.split('/');
    var filename = splitURL[splitURL.length - 1];
    eval("var myFunc = function() { dcsMultiTrack('DCS.dcsuri', '" + url + "', 'WT.ti', '" + filename + "'); };");
    objLink.onclick = myFunc;
    alert(objLink.onclick);
}
function ConvertLinks()
{
    var links = document.getElementsByTagName("a");
    for (var i = 0; i < links.length; i++)
    {
        if (links[i].className == "trackOnClick")
        {
            ConvertLink(links[i]);
        }
    }
}

