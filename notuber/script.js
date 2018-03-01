var USERNAME = "lGhCpJCE5K";
var mylat = 0.0;
var mylng = 0.0;

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
	var marker = new google.maps.Marker({
		position: {lat: mylat, lng: mylng},
		map: map,
		
	})

}

function isVehicle(passengerData) {


}

function getData(){
	console.log("mylat: " + mylat);
	console.log("mylng: " + mylng);

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
	console.log(params);
	request.send(params);
}
