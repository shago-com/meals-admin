
# setup google places api

```ts
// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

function initMap(): void {
  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      center: { lat: 40.749933, lng: -73.98633 },
      zoom: 13,
      mapTypeControl: false,
    }
  );
  
  const input = document.getElementById("pac-input") as HTMLInputElement;
  
  const options = {
    fields: ["formatted_address", "geometry", "name"],
    strictBounds: false,
    types: ["establishment"],
  };

  const autocomplete = new google.maps.places.Autocomplete(input, options);

  const infowindow = new google.maps.InfoWindow();
  const infowindowContent = document.getElementById(
    "infowindow-content"
  ) as HTMLElement;


  autocomplete.addListener("place_changed", () => {
    infowindow.close();
    marker.setVisible(false);

    const place = autocomplete.getPlace();

    if (!place.geometry || !place.geometry.location) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
      map.setCenter(place.geometry.location);
	}

    name: place.name;
    address: 	formatted_address;
  });

}

```

```xml

<html>
  <head>
    <title>Place Autocomplete</title>
    <script src="https://polyfill.io/v3/polyfill.min.js?features=default"></script>
    <!-- playground-hide -->
    <script>
      const process = { env: {} };
      process.env.GOOGLE_MAPS_API_KEY =
        "AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg";
    </script>
    <!-- playground-hide-end -->

    <link rel="stylesheet" type="text/css" href="./style.css" />
    <script type="module" src="./index.js"></script>
  </head>
  <body>
    <div class="pac-card" id="pac-card">
      <div>
        <div id="title">Autocomplete search</div>
        <div id="type-selector" class="pac-controls">
          <input
            type="radio"
            name="type"
            id="changetype-all"
            checked="checked"
          />
          <label for="changetype-all">All</label>

          <input type="radio" name="type" id="changetype-establishment" />
          <label for="changetype-establishment">establishment</label>

          <input type="radio" name="type" id="changetype-address" />
          <label for="changetype-address">address</label>

          <input type="radio" name="type" id="changetype-geocode" />
          <label for="changetype-geocode">geocode</label>

          <input type="radio" name="type" id="changetype-cities" />
          <label for="changetype-cities">(cities)</label>

          <input type="radio" name="type" id="changetype-regions" />
          <label for="changetype-regions">(regions)</label>
        </div>
        <br />
        <div id="strict-bounds-selector" class="pac-controls">
          <input type="checkbox" id="use-location-bias" value="" checked />
          <label for="use-location-bias">Bias to map viewport</label>

          <input type="checkbox" id="use-strict-bounds" value="" />
          <label for="use-strict-bounds">Strict bounds</label>
        </div>
      </div>
      <div id="pac-container">
        <input id="pac-input" type="text" placeholder="Enter a location" />
      </div>
    </div>
    <div id="map"></div>
    <div id="infowindow-content">
      <span id="place-name" class="title"></span><br />
      <span id="place-address"></span>
    </div>

    <!-- 
     The `defer` attribute causes the callback to execute after the full HTML
     document has been parsed. For non-blocking uses, avoiding race conditions,
     and consistent behavior across browsers, consider loading using Promises
     with https://www.npmjs.com/package/@googlemaps/js-api-loader.
    -->
    <script
      src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&callback=initMap&libraries=places&v=weekly"
      defer
    ></script>
  </body>
</html>


```