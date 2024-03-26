<!--

/* START - GOOGLE MAPS CODE */

   var map;
    var geocoder;

    function load() {
      if (GBrowserIsCompatible()) {
        geocoder = new GClientGeocoder();
        map = new GMap2(document.getElementById('map'));
        map.addControl(new GSmallMapControl());
        map.addControl(new GMapTypeControl());
        map.setCenter(new GLatLng(40, -100), 4);
     
      }
    }


   function searchLocationsNear() {
     var searchUrl = 'http://www.partsplus.com.au/phpsqlsearch_genxml.php';
     GDownloadUrl(searchUrl, function(data) {
       var xml = GXml.parse(data);
       var markers = xml.documentElement.getElementsByTagName('marker');
       map.clearOverlays();

       var sidebar = document.getElementById('sidebar');
       sidebar.innerHTML = '';
       if (markers.length == 0) {
         sidebar.innerHTML = 'No results found.';
         alert ('No Markers Found !');
         map.setCenter(new GLatLng(40, -100), 4);
         return;
       }

       var bounds = new GLatLngBounds();
       for (var i = 0; i < markers.length; i++) {
       var name = markers[i].getAttribute('name');
	   var address = markers[i].getAttribute('address');
	   var extraDetails = markers[i].getAttribute('extraDetails');
	   var openingTimes = markers[i].getAttribute('openingTimes');
	   var tel = markers[i].getAttribute('tel');
	   var fax = markers[i].getAttribute('fax');
	   var email = markers[i].getAttribute('email');
	   var website = markers[i].getAttribute('website');	         
	       
	         var point = new GLatLng(parseFloat(markers[i].getAttribute('lat')),
	                                 parseFloat(markers[i].getAttribute('lng')));
	         
	         var marker = createMarker(point, name, address, tel);
	         map.addOverlay(marker);
	         var sidebarEntry = createSidebarEntry(marker, name, address, openingTimes, extraDetails, tel, fax, email, website, i);
	         sidebar.appendChild(sidebarEntry);
	         var sidebarEntry_mapClick = createSidebarEntry_mapClick(marker, name, address, extraDetails, tel, fax, email, website, i);
	         sidebar.appendChild(sidebarEntry_mapClick);
	         
	         bounds.extend(point);
	       
         
       }
       map.setCenter(bounds.getCenter(), map.getBoundsZoomLevel(bounds));
     });
   }

    function createMarker(point, name, address, tel) {
       // Create our "tiny" marker icon
        var baseIcon = new GIcon(G_DEFAULT_ICON);
        baseIcon.image = "http://www.partsplus.com.au/images/mapmarker.png";
        baseIcon.shadow = "http://www.google.com/mapfiles/shadow50.png";
        
		
		// Set up our GMarkerOptions object
		markerOptions = { icon:baseIcon };
		
		var marker = new GMarker(point,markerOptions);
      var html = '<b style="font-size:12px;">' + name + '</b> <br/><span style="font-size:10px;">' + address + '</span><br/><span style="font-size:12px;font-weight:bold;padding:2px;"><img src="http://www.partsplus.com.au/images/telephone.png" height="16px" width="16px" align="top"> ' + tel +'</span>' ;
      GEvent.addListener(marker, 'click', function() {
        marker.openInfoWindowHtml(html);
      });
      return marker;
    }

    function createSidebarEntry_mapClick(marker, name, address, extraDetails, tel, fax, email, website,id) {
      var div_mapClick = document.createElement('div');
      var html_mapClick = '<div id=\"'+id+'_viewonmapbutton\" style="display:none;color:#00235B;font-size:12px;margin:0px;padding:3px;font-weight:bold;text-align:right;"><img src="images/map.png" height="16px" width="16px" align="top"> View on Map</div>';
      
      div_mapClick.innerHTML = html_mapClick;
      div_mapClick.style.cursor = 'pointer';
      
      GEvent.addDomListener(div_mapClick, 'click', function() {
        GEvent.trigger(marker, 'click');
      });
      //GEvent.addDomListener(div_mapClick, 'mouseover', function() {
        //div_mapClick.style.backgroundColor = '#eee';
      //});
      //GEvent.addDomListener(div_mapClick, 'mouseout', function() {
        //div_mapClick.style.backgroundColor = '#fff';
      //});
      return div_mapClick;
    }
    
     function createSidebarEntry(marker, name, address, openingTimes, extraDetails, tel, fax, email, website,id) {
      var div = document.createElement('div');
      var html = '';
      
		html = html+'<div style="height:16px;background-color:#EFEFEF;color:#00235B;font-size:12px;margin:0px;padding:4px;font-weight:bold;">';
		//html = html+	'<img src="images/partsplus_icon.png" height="20px" width="20px" align="absmiddle"> ' + name;
		html = html+ '<span style="float:left;">'+name+'</span>';
		html = html+ '<span id="'+id+'_moreDetails" name="'+id+'_moreDetails" style="float:right;text-align:right;align:right;"><a href="partsplusstores.php#" onClick="toggleLayer(\''+id+'_moreDetailsContainer\');toggleLayer(\''+id+'_viewonmapbutton\');toggleLayer(\''+id+'_moreDetails\');toggleLayer(\''+id+'_lessDetails\');return false;">More..</a></span>';
		html = html+ '<span id="'+id+'_lessDetails" name="'+id+'_lessDetails" style="float:right;text-align:right;align:right;display:none;"><a href="partsplusstores.php#" onClick="toggleLayer(\''+id+'_moreDetailsContainer\');toggleLayer(\''+id+'_viewonmapbutton\');toggleLayer(\''+id+'_moreDetails\');toggleLayer(\''+id+'_lessDetails\');return false;">Less..</a></span>';	
		html = html+ '</div>';
		html = html+ '<div stlye="clear:both;"></div>';
		html = html+ '<div style="padding:4px;">'+address + '<br/>'
		html = html+ '<div id=\"'+id+'_moreDetailsContainer\" name=\"'+id+'_moredetails\" style="display:none;padding:4px;">';
		html = html+ '<span style="font-size:12px;font-weight:bold;padding:2px;color:#4F4F4F;">';
		html = html+ 	'<br/><img src="images/telephone.png" height="16px" width="16px" align="top"> '+tel;
		html = html+ 	'<img src="images/fax.png" height="16px" width="16px" align="top"> '+fax;
		html = html+ '</span><br/>';
		html = html+ '<a href="mailto:'+email+'"><img src="images/email.png" height="16px" width="16px" align="top"> '+email+'</a>';
		if (website != ''){
			html = html+ '<br/><a href="'+website+'"><img src="images/page_world.png" height="16px" width="16px" align="top"> '+website+'</a>';
		}
		html = html+ '<br/><br/>	<strong style="font-size:11px;margin-top:4px;color:#6F6F6F;">Makes and Models</strong><br/><i>'+ extraDetails + '</i>';
		html = html+ '<br/>	<strong style="font-size:11px;margin-top:4px;color:#6F6F6F;">Store Hours</strong><br/><i>'+ openingTimes + '</i>';
		html = html+ '</div>';
		html = html+ '</div>';  
      
      div.innerHTML = html;
     
      return div;
    }

/* END - GOOGLE MAPS CODE */


function bookmarksite(title, url){
	
	if (document.all)
	window.external.AddFavorite(url, title);
	else if (window.sidebar)
	window.sidebar.addPanel(title, url, "")

}

function toggleLayer( whichLayer )

{

  var elem, vis;

  if( document.getElementById ) // this is the way the standards work

    elem = document.getElementById( whichLayer );

  else if( document.all ) // this is the way old msie versions work

      elem = document.all[whichLayer];

  else if( document.layers ) // this is the way nn4 works

    elem = document.layers[whichLayer];

  vis = elem.style;

  // if the style.display value is blank we try to figure it out here

  if(vis.display==''&&elem.offsetWidth!=undefined&&elem.offsetHeight!=undefined)

    vis.display = (elem.offsetWidth!=0&&elem.offsetHeight!=0)?'block':'none';

  vis.display = (vis.display==''||vis.display=='block')?'none':'block';

}

function changeColour(elementId) {
    var interval = 1000;
    var colour1 = "#ff0000"
    var colour2 = "#FFFFFF";
    if (document.getElementById) {
        var element = document.getElementById(elementId);
        element.style.color = (element.style.color == colour1) ? colour2 : colour1;
        setTimeout("changeColour('" + elementId + "')", interval);
    }
}

var elm;

function  checkPartRequestForm(form){

	var errorfields= "";//used to stored the error messages of the form

	if (form.year.options[form.year.selectedIndex].value=="def"){
		errorfields+="\n [+] Year not Selected";
	}

	if (form.manu.options[form.manu.selectedIndex].value=="def"){
		errorfields+="\n [+] Make not Selected";
	}

	if (form.model.options[form.model.selectedIndex].value=="def"){
		errorfields+="\n [+] Model not Selected";
	}

	if (form.group.options[form.group.selectedIndex].value=="def"){
		errorfields+="\n [+] Part Gategory not Selected";
	}

	if (form.part.options[form.part.selectedIndex].value=="def"){
		errorfields+="\n [+] Part not Selected";
	}
	
	//NAME

	if (isfilled(form.name) == false){
		errorfields+="\n [+] Name not filled in";
	}
	
	//EMAIL

	if (isfilled(form.email) == false){
		errorfields+="\n [+] Email not filled in";
	}

	return formattedFormFeedback(errorfields);

	return true;
	
}

function formattedFormFeedback(errorfields){

	if (errorfields != "") {

		errorfields="The form contains an error/s or invalid information \n"+"________________________________________\n"+errorfields+"\n________________________________________\n"+"\nPlease enter correct information into the above fields.\n"+"\nAfter you have completed press please try again.\n";
		window.alert(errorfields);
		return false;

	}else{

		return true;

	}

}

function isfilled(elm) {

	if (elm.value=="" || elm.value==null){
		return false;
	}else{
		return true;
	}

}

function  checkCompetitionForm(form){

	var errorfields= "";//used to stored the error messages of the form

	//NAME

	if (isfilled(form.invoiceNo) == false){
		errorfields+="\n [+] Invoice Number not filled in";
	}
	
	return formattedFormFeedback(errorfields);

	return true;
	
}

//-->
