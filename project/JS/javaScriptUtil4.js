
//The following is used to partially disable the function of the back button. 
//It shuts down the backspace key from taking you to the previous page.  
//As for the back button any changes that are on the screen will be lost, however 
//it will prevent the user from going to the previous page which could be bad.  
//Note bad things happen on the parameter.jsp when this is functioning, and you 
//hit backspace on a drop down.  It tries to reload the page and fails.  Because 
//it is reloading the page changes are lost, so its purpose is essentially defeated.  
//history.forward();



// Performs onload processsing specific to an individual page.
// This is just a stub called by the framework. Individual pages
// can override this for their specific needs.
function onload() {
	return;
}

function setInitialFocus(ctrlName) {
	frm = document.forms[0];
	frm.elements[ctrlName].focus();
}

function doSubmit(frm, command) {
	frm.elements["command"].value = command;
	frm.submit();
}

function openPopup(url, title){
	//alert("test");
	window.open(url, title, "resizable=yes,location=yes,toolbar=yes,menubar=yes,scrollbars=yes");
}

function openFAQ(){
	var actionCls ="frequentlyAskedQuestions.do"; 
// Change the following line to display the popup size.
	var winProp = "left=12, top=25, width=640, height=480, menubar=no, toolbar=no";
	
	//window.open(theURL,"View Resource",winProp);
	window.open(actionCls);
}
function setInitialFocus() {
	frm = document.forms[0];
	var focusField;
	if (arguments.length == 1) {
		focusField = arguments[0];
	} else {
		if (frm.elements["prevCommand"].value == "search") {
			focusField = arguments[1];
		} else {
			focusField = arguments[0];
		}
	}
	if( focusField != null){
		frm.elements[focusField].focus();
	}
}

function focusInput(inp) {
	inp.style.backgroundColor = "#ffffcc"; // "#fff8dc" "#EEE8AA";
}

function blurInput(inp) {
	inp.style.backgroundColor = "white";
}


function openCalendar(frmName, ctrlName, fmt)
{
	if (isReadOnly(ctrlName)) return;

	var theDate = new Date();
	var frm = document.forms[frmName];
	var ctrl = frm.elements[ctrlName];
	if(ctrl.value != "" && ctrl.value != null)
	{

		theDate = new Date(ctrl.value);
		var y = theDate.getFullYear();
		if(y!=y) //this will check if y is NaN
		{
			theDate=new Date();
		}

	}

	var vYear = theDate.getFullYear() + "";
	var vM = theDate.getMonth();
	winDatePicker = show_calendar(frmName + "." + ctrlName, vM, vYear, fmt);
}



function onDocFocus() {
	try	{
		winDatePicker.close();
	}	catch(e)	{	}
}

function getCurrentDate()
{
	var today = new Date();
	var vY = today.getFullYear();
	var vM = today.getMonth() +1;
	if(vM <10)
	{
		vM = "0" + vM
	}
	var vD = today.getDate();
	if(vD <10)
	{
		vD = "0" + vD;
	}
	return vY + "\/" + vM + "\/" + vD;
}


function resetClick(frm, ctrl) {
	try	{
		frm.reset();
		frm.elements[ctrl].focus();
	}	catch(e) {
		//ignore;
	}
}

function doReset(frm) {
	frm.reset();
}

function ResetForm(frm) {
	frm.reset();
}

function resetClickSmart(frm, ctrl, secondCtrl)
{
	try
	{
		frm.elements[ctrl].focus();
	}
	catch(e)
	{
		//try the second control
		try
		{
			frm.elements[secondCtrl].focus();
		}
		catch(e)
		{
			//ignore
		}
	}
}


function setFocusForError(ctrlName){
	//this method assumes that each page only has one form
	//and the ctrlName is the name of the control to set focus on
	try{
		var theCtrl = document.forms[0].elements[ctrlName];
		theCtrl.focus();
		
	}catch(e){
		//ignore.
	}
}


function addField (form, fieldType, fieldName, fieldValue) {
	var fld = document.createElement('INPUT');
	fld.type = fieldType;
	fld.name = fieldName;
	fld.value = fieldValue;
	form.appendChild(fld);
	return fld;
}


// Checks if the input control name passed in is readonly or disabled.
// Returns true if it is, false otherwise.
function isReadOnly(ctrlName) {
	var frm = document.forms[0];
	if (frm == null) return false;
	var ctrl = frm.elements[ctrlName];
	if (ctrl == null) return false;
	if (ctrl.disabled || ctrl.readOnly) {
		return true;
	} else {
		return false;
	}
}

// Checks if the input control name passed in is readonly or disabled.
// Returns true if it is, false otherwise.
function isDisabled(ctrlName) {
	var frm = document.forms[0];
	if (frm == null) return false;
	var ctrl = frm.elements[ctrlName];
	if (ctrl == null) return false;
	if (ctrl.disabled) {
		return true;
	} else {
		return false;
	}
}

function showInputPopup(elt, divId) {
	openElement(divId);
	if (elt) {
		elt.focus();
	}
}

function flipChecks(elt, grpID) {
	if (elt != null && elt.type == "checkbox") {
		checkGroup(grpID, elt.checked);
	}
}

function checkGroup(grpID, checked) {
	reqGrp = document.getElementById(grpID);
	for(i = 0; i < reqGrp.all.length; i++){
		cb = reqGrp.all(i);
		if (cb != null && cb.type == "checkbox") {
			cb.checked = checked;
		}
	}
}

function openElement(id) {
	var elt = document.getElementById(id);
	var ofy = document.body.scrollTop;
	var ofx = document.body.scrollLeft;
	var w = elt.offsetWidth;
	var left = event.clientX + ofx - w;
	if (left < 10) left = 10;
	elt.style.left = left;
	elt.style.top = event.clientY + ofy + 10;
	elt.style.visibility = "visible";
}

function closeElement(id) {
	var elt = document.getElementById(id);
	elt.style.visibility = "hidden";
}

function openRecordInfo(id) {
	openElement(id);
	hideSelectElement();
}

function closeRecordInfo(id) {
	closeElement(id);
	showSelectElement();
}

/**
 * Fix IE bug
 */
function hideSelectElement() {
	if (!document.all) {
		return;
	}
	var selectTags = document.all.tags("select");
	for (i = 0; i < selectTags.length; i++) {
		obj = selectTags[i];
		if (! obj || obj.id=="calmois" || obj.id=="calyear") {
			continue;
		}
		obj.style.visibility = "hidden";
	}
}

/**
 * Fix IE bug
 */
function showSelectElement() {
	if (!document.all) {
		return;
	}
	var selectTags = document.all.tags("select");
	for (i = 0; i < selectTags.length; i++) {
		obj = selectTags[i];
		if (! obj || obj.id=="calmois" || obj.id=="calyear") {
			continue;
		}
		obj.style.visibility = "visible";
	}
}

/**
 * Show the calendar
 * This is a cloned version of the showCalendar function in the
 * javascript.js file that comes with Struts-Layout taglib. The code
 * has been cloned to fix a bug.
 */
function showCalendarCct(year, month, day, pattern, formName, formProperty, event, startYear, endYear) {
	if (startYear!=null) {
		var calyear = document.getElementById("calyear");
		for (i = startYear; i <= endYear; i++) {			
			calyear.options[i - startYear] = new Option(i,i);
		}
		calyear.options.length = endYear - startYear + 1;
	}

	if(document.all) {
		// IE.
		var ofy=document.body.scrollTop;
		var ofx=document.body.scrollLeft;
		
		// fix so that calendar stays on right edge
		var left = event.clientX+ofx+10;
		var width = document.all.slcalcod.offsetWidth;
		if (left + width > document.body.offsetWidth) {
			left = document.body.offsetWidth - width - 20;
		}
		
		// fix so that calendar stays above the bottom
		var top = event.clientY+ofy+10;
		var height = 170; //document.all.slcalcod.offsetHeight;
		if (top + height > document.body.offsetHeight) {
			top = document.body.offsetHeight - height - 20;
		}

		document.all.slcalcod.style.left = left; //event.clientX+ofx+10;
		document.all.slcalcod.style.top = top; //event.clientY+ofy+10;
		document.all.slcalcod.style.visibility="visible";
		document.all.calmois.selectedIndex= month;
		hideElement("SELECT");
	} else if(document.layers) {
		// Netspace 4
		document.slcalcod.left = e.pageX+10;
		document.slcalcod.top = e.pageY+10;
		document.slcalcod.visibility="visible";
		document.slcalcod.document.caltitre.document.forms[0].calmois.selectedIndex=month;
	} else {
		// Mozilla
		var calendrier = document.getElementById("slcalcod");
		var ofy=document.body.scrollTop;
		var ofx=document.body.scrollLeft;
		calendrier.style.left = event.clientX+ofx+10;
		calendrier.style.top = event.clientY+ofy+10;
		calendrier.style.visibility="visible";
		document.getElementById("calmois").selectedIndex=month;
	}
	if (document.forms[formName].elements[formProperty].stlayout) {
		var lc_day = document.forms[formName].elements[formProperty].stlayout.day;
		var lc_month = document.forms[formName].elements[formProperty].stlayout.month;
		var lc_year = parseInt(document.forms[formName].elements[formProperty].stlayout.year);
		cal_chg(lc_day, lc_month, lc_year);	
	} else {
		cal_chg(day, month, year);	
	}
	calformname = formName;
	calformelement = formProperty;
	calpattern = pattern;
}

