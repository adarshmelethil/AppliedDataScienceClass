// common.js

 /**
 * Validates the length of an object's VALUE.
 * The MAXLENGTH attribute of the object is set in the HTML. 
 * If the length of VALUE is greater than MAXLENGTH, VALUE is
 * contracted until the length of VALUE is equal to MAXLENGTH.
 *
 * @param obj  the object being validated
 */
function isMaxLength( obj ) {
	var mlength=obj.getAttribute?parseInt( obj.getAttribute( "maxlength" ) ):""
	if( obj.getAttribute && obj.value.length>mlength )
	obj.value=obj.value.substring( 0, mlength )
}

/**
 * Returns a Boolean value indicating user response to a query confirming deletion of
 * a Category and related Subcategories.
 */ 
function confirmCategoryDelete(command) {
	var blnConfirm=confirm( "WARNING: Deleting this category will also delete all related " +
		"subcategories and data.\nClick OK to confirm permanent deletion of this category and " +
		"all related subcategories and data." );
	if (blnConfirm == true) { 
		gotoHref(command) ; 
	} 

}

function gotoHref(hrefURL) {
     document.location = hrefURL
} 

/**
 * Returns a Boolean value indicating user response to a query confirming deletion of a Subcategory
 * a Category and related Subcategories.
 */ 
function confirmSubcategoryDelete(command) {
	var blnConfirm=confirm( "WARNING: Deleting this Subcategory will also delete all related " +
		"data.\n" +
		"Click OK to confirm permanent deletion of this Subcategory and all related data." );
	if (blnConfirm == true) { 
		gotoHref(command) ; 
	} 
}

