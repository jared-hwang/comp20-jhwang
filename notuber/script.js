var USERNAME = "lGhCpJCE5K";
var mylat = 0.0;
var mylng = 0.0;


function haversineDistance(coords1, coords2, isMiles) {
  function toRad(x) {
    return x * Math.PI / 180;
  }

  var lon1 = coords1[0];
  var lat1 = coords1[1];

  var lon2 = coords2[0];
  var lat2 = coords2[1];

  var R = 6371; // km

  var x1 = lat2 - lat1;
  var dLat = toRad(x1);
  var x2 = lon2 - lon1;
  var dLon = toRad(x2)
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;

  if(isMiles) d /= 1.60934;

  return d;
}

function getLocation() {
	geo = navigator.geolocation;
	geo.getCurrentPosition(function (position){
		mylat = position.coords.latitude;
		mylng = position.coords.longitude;
		getData();
		createMap();
	});
}

function createMap() {
	 map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: mylat, lng: mylng},
          zoom: 18
     });
}

function isPassenger(passengerData){
	var me = {
		url: "me.png",
		scaledSize: new google.maps.Size(40, 40),
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(20,20)
	}
	var car = {
		url: "car.png",
		origin: new google.maps.Point(0,0),
		anchor: new google.maps.Point(15, 35)
	}
	distance = 0;
	myLocation = [mylng, mylat];

	var vehicleMarkers = [];

	firstCar = [passengerData[0].lng, passengerData[0].lat];
	distance = haversineDistance(myLocation, firstCar, true);
	for (i = 0; i < passengerData.length; i++) {
		if (haversineDistance(myLocation, [passengerData[i].lng, passengerData[i].lat]) < distance) {
			distance = haversineDistance(myLocation, [passengerData[i].lng, passengerData[i].lat]);
		}
		vehicleMarkers[i] = new google.maps.Marker({
			position: {lat: passengerData[i].lat, lng: passengerData[i].lng},
			map: map,
			icon: car,
			username: passengerData[i].username,
			distanceAway: haversineDistance(myLocation, [passengerData[i].lng, passengerData[i].lat])
		});
		google.maps.event.addListener(vehicleMarkers[i], 'click', function(){
				document.getElementById('printInfo').innerHTML = "<h3>Name: " + this.username + "</h3>" + "<p>Distance Away: " + this.distanceAway + " miles</p>" +document.getElementById('printInfo').innerHTML;
		});

	}
	var meInfo = new google.maps.InfoWindow({
		content: "<h1>" + USERNAME + "</h1>" + "<p>Distance to nearest: " + distance + " miles</p>"
	});
	var marker = new google.maps.Marker({
		position: {lat: mylat, lng: mylng},
		map: map,
		icon: me
	});
	meInfo.open(map, marker);
}

function isVehicle(passengerData) {
	var me = {
		url: "me.png",
		scaledSize: new google.maps.Size(40, 40),
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(20,20)
	}
	var passenger = {
		url: "passenger.png",
		scaledSize: new google.maps.Size(40, 40),
		origin: new google.maps.Point(0,0),
		anchor: new google.maps.Point(20, 20)
	}
	distance = 0;
	var passengerMarkers = [];
	myLocation = [mylng, mylat];

	firstRider = [passengerData[0].lng, passengerData[0].lat];
	distance = haversineDistance(myLocation, firstRider, true);
	for (i = 0; i < passengerData.length; i++) {
		if (haversineDistance(myLocation, [passengerData[i].lng, passengerData[i].lat]) < distance) {
			distance = haversineDistance(myLocation, [passengerData[i].lng, passengerData[i].lat]);
		}
		passengerMarkers[i] = new google.maps.Marker({
			position: {lat: passengerData[i].lat, lng: passengerData[i].lng},
			map: map,
			icon: car,
			username: passengerData[i].username,
			distanceAway: haversineDistance(myLocation, [passengerData[i].lng, passengerData[i].lat])
		});
		google.maps.event.addListener(passengerMarkers[i], 'click', function(){
				document.getElementById('printInfo').innerHTML = "<h3>Name: " + this.username + "</h3>" + "<p>Distance Away: " + this.distanceAway + " miles</p>" +document.getElementById('printInfo').innerHTML;
		});

	}
	var meInfo = new google.maps.InfoWindow({
		content: "<h1>" + USERNAME + "</h1>" + "<p>Distance to nearest: " + distance + " miles</p>"
	});
	var marker = new google.maps.Marker({
		position: {lat: mylat, lng: mylng},
		map: map,
		icon: me
	});
	meInfo.open(map, marker);

}

function getData(){

	var params = "username="+USERNAME+"&lat="+mylat+"&lng="+mylng;
	request = new XMLHttpRequest();
	request.open("POST", "https://jordan-marsh.herokuapp.com/rides", true);
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	request.onreadystatechange = function () {
		if (request.readyState == 4 && request.status == 200) {
			outputDiv = document.getElementById("test");
			passengerJSON = request.responseText;
			passengerData = JSON.parse(passengerJSON);

			if ("vehicles" in passengerData){
				isPassenger(passengerData["vehicles"]);
			} else if ("passengers" in passengerData){
				ifVehicle(passengerData["passengers"]);
			}

		}

	};
	request.send(params);
}
