import { Controller } from "@hotwired/stimulus"
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder"

// Connects to data-controller="address-autocomplete"
export default class extends Controller {
  static values = { apiKey: String }
  static targets = ["title", "address", "city", "latitude", "longitude"]

  connect() {
    this.geocoder = new MapboxGeocoder({
      accessToken: this.apiKeyValue,
      types: "neighborhood,address,poi"
    })
    this.geocoder.addTo(this.element)
    this.geocoder.on("result", event => this.#setInputValue(event))
    this.geocoder.on("clear", () => this.#clearInputValue())
  }

  #setInputValue(event) {
    this.addressTarget.value = event.result["place_name"]
    console.log(event.result)

    // Get coordinates, address, poi & city from event.result. Store them in params and send to create method

    // 1. If POI (check this really works)
    if (event.result["id"].includes("poi")) {

      // Title
      this.titleTarget.value = event.result["text"]
    }
    // 2. If address
    else {
      this.titleTarget.value = "Custom location"
     }

    // Coordinates
    this.latitudeTarget.value = event.result["geometry"]["coordinates"][1]
    this.longitudeTarget.value = event.result["geometry"]["coordinates"][0]

    // City
    let city = null
    let district = null
    event.result["context"].forEach((hash) => {
      for (const [key, value] of Object.entries(hash)) {
        if (value.includes("place")) {
          city = hash["text"]
        }
        else if (value.includes("district")) {
          district = hash["text"]
        }
      }
    })
    this.cityTarget.value = city === null ? district : city




    // 3. Calculate new total time and distance

  }

  #clearInputValue() {
    this.addressTarget.value = ""
  }

  disconnect() {
    this.geocoder.onRemove()
  }
}
