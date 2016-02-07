function mark(e,n){"use strict";var t=n,o=new google.maps.LatLng(e.lat(),e.lng()),r=new google.maps.Marker({title:e.name(),position:o,number:e.number(),label:e.marker(),animation:google.maps.Animation.DROP});r.setMap(t)}function Place(e,n){"use strict";this.name=e.name,this.lat=e.address.lat,this.lng=e.address.lng,this.number=n,this.description=e.description,this._destroy=e._destroy,this.marker=null}function Result(e){"use strict";this.name=e.result,this.url=e.url}var Map={initMap:function(){var e=new google.maps.LatLng(41.074448,-73.541316);try{this.instance=new google.maps.Map(document.getElementById("map"),{center:e,mapTypeId:google.maps.MapTypeId.ROADMAP,scroolwheel:!0,zoom:12,styles:styleArray})}catch(n){Helpers.handleError("Google maps is not loading. This may be due to not having an internet connection.")}},showStreet:function(e,n){"use strict";var t={lat:e,lng:n},o=new google.maps.StreetViewPanorama(document.getElementById("street-view"),{position:t,prob:{heading:24,pitch:18}});this.instance.setStreetView(o),google.maps.event.trigger(this.instance,"resize",function(){})},removeStreet:function(){"use strict";var e=this.instance.getStreetView();e&&e.setVisible(!1)},toggleBounce:function(e){"use strict";null!==e.getAnimation()?e.setAnimation(null):(e.setAnimation(google.maps.Animation.BOUNCE),setTimeout(function(){e.setAnimation(null)},3e3))}},Helpers={handleError:function(e){return"map"===e&&(e="Google Maps could not load. Please check your internet connnection."),alert(e)},logError:function(e){return console.log(e)}},ViewModel=function(){"use strict";var e=this;e.yelpResults=ko.observableArray([]),e.fsResults=ko.observableArray([]),e.places=ko.observableArray([]),e.query=ko.observable(""),e.currentPlace=ko.observable({name:"none"}),e.currentName=ko.observable(),e.currentDesc=ko.observable(),e.showModel=ko.observable(!1),e.showYelpNoResult=ko.observable(!1),e.showYelp=ko.observable(!1),e.showFSnoresult=ko.observable(!1),e.showFS=ko.observable(!1),e.resultsFound=ko.pureComputed(function(){var n=0;return e.places().forEach(function(e){e._destroy()===!1&&n++}),n}),e.fsTipsStyle=ko.pureComputed(function(){return e.fsTips().length>0?"fs-element-show":"fs-element-hide"}),e.fsCrossStyle=ko.pureComputed(function(){return""===e.fsCrossStreet()?"fs-element-show":"fs-element-hide"}),this.currentMarker=function(){return e.places()[e.currentPlace()]},this.search=function(n){e.places().forEach(function(e){e.name.toLowerCase().indexOf(n.toLowerCase())>=0?(e._destroy(!1),e.marker.setVisible(!0)):(e._destroy(!0),e.marker.setVisible(!1))})},this.placeMarker=function(n,t){var o=new google.maps.LatLng(n.address.lat,n.address.lng),r=new google.maps.Marker({title:n.name,position:o,number:t,animation:null});e.places()[t].marker=r,n.marker=r,r.addListener("click",function(){e.selectPlace(n)}),r.setMap(Map.instance)},this.populateLocations=function(){var n=0;places.forEach(function(t){e.places().push(new Place(t,n)),e.placeMarker(t,n),n++})},this.selectPlace=function(n){e.currentPlace().name===n.name?Map.toggleBounce(n.marker):"none"!==e.currentPlace().name&&(e.currentPlace().marker.setIcon(""),e.currentPlace().marker.setAnimation(null)),e.currentPlace(e.places()[n.marker.number]),e.currentPlace().marker.setIcon("http://maps.google.com/mapfiles/ms/icons/green-dot.png");var t=new google.maps.LatLng(e.currentPlace().lat,e.currentPlace().lng);Map.instance.panTo(t),Map.toggleBounce(e.currentPlace().marker),e.currentDesc(n.description),e.currentName(n.name),e.initAjax()},this.initAjax=function(){e.clearObservables(),e.fillcontentWindow(),e.showModel(!0),r(),s()},this.clearObservables=function(){e.yelpResults.removeAll(),e.fsResults.removeAll()},this.fillcontentWindow=function(){var n='<div id="content"><div id="siteNotice"></div><b>'+e.currentPlace().name+"</b> </div>";e.infoWindow.setOptions({content:n}),e.infoWindow.open(Map.instance,e.currentPlace().marker)},this.openSite=function(e,n){"click"===n.type&&window.open(e,"_blank")};var n=function(){return Math.floor(1e12*Math.random()).toString()},t=function(e){},o=function(e){},r=function(){var r="GET",s="YsPDWGOo52SXK3U-FoNm6g",a="d4oiThmVyRCZrZR1o8phpOV4FjI",i="https://api.yelp.com/v2/search?",l="MyX8vDPrsgUCTH3qWMK4M3zp8oLuBkE2",c="Stamford, CT",u="IKtJiQ-P4Gk_arqDvP3buDE-Wio",p={term:e.currentPlace().name,location:c,oauth_consumer_key:s,oauth_token:l,oauth_nonce:n(),oauth_timestamp:Math.floor(Date.now()/1e3),oauth_signature_method:"HMAC-SHA1",callback:"localJsonpCallback"},m=oauthSignature.generate(r,i,p,a,u);p.oauth_signature=m;var h={type:r,url:i,data:p,cache:!0,dataType:"jsonp",timeout:5e3,complete:o("Yelp"),beforeSend:t("Yelp"),success:function(n){n.businesses.length>0?(e.showYelp(!0),e.showYelpNoResult(!1)):(e.showYelp(!1),e.showYelpNoResult(!0));for(var t=0;t<n.businesses.length;t++)e.yelpResults.push({name:n.businesses[t].name,url:n.businesses[t].url})},error:function(e){Helpers.handleError("Error encountered in communicating with Yelp.  Please just your internet connection and firewall settings.")}};$.ajax(h)},s=function(){var n="GET",r=["https://api.foursquare.com/v2/venues/search?client_id=","&client_secret=","&v=20130815&near=","&query="],s="ZUPJOALYACXTHW3ZLE2I0RF2IWBOLFQPORW5LBUFHL2KEFTA",i="S4M2PBBKJVQP3HM3SCKEZIIEJARLZ5ITP1KUKN4IXT03CXTM",l="Stamford, CT",c=r[0]+s+r[1]+i+r[2]+l+r[3]+e.currentPlace().name,u={url:c,type:n,cache:!0,dataType:"json",complete:o("fs"),beforeSend:t("fs"),success:function(n){if(n=n.response,n.venues.length>0){e.showFS(!0),e.showFSnoresult(!1);for(var t=0;t<n.venues.length;t++)a(n.venues[t].id)}else e.showFS(!1),e.showFSnoresult(!0)},error:function(e){Helpers.handleError("Error encountered in communicating with Foursquare.  Please just your internet connection and firewall settings.")}};$.ajax(u)},a=function(n){var t="GET",o="https://api.foursquare.com/v2/venues/"+n,r="ZUPJOALYACXTHW3ZLE2I0RF2IWBOLFQPORW5LBUFHL2KEFTA",s="S4M2PBBKJVQP3HM3SCKEZIIEJARLZ5ITP1KUKN4IXT03CXTM",a="Stamford, CT",i={type:t,url:o+"?client_id="+r+"&client_secret="+s+"&v=20130815&near="+a,success:function(n){e.fsResults.push({name:n.response.venue.name,url:n.response.venue.canonicalUrl})},error:function(e){Helpers.handleError("Error encountered in communicating with Foursquare.  Please just your internet connection and firewall settings.")}};$.ajax(i)};this.query.subscribe(e.search),$("#modal-place").on("shown.bs.modal",function(){Map.showStreet(e.currentPlace().lat,e.currentPlace().lng)}),$("#modal-place").on("hidden.bs.modal",function(){Map.removeStreet()}),Map.initMap(e),e.populateLocations(),e.infoWindow=new google.maps.InfoWindow,e.helpers=Helpers};ko.applyBindings(new ViewModel);